import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function getDb() {
  if (!db) throw new Error("Firebase not configured");
  return db;
}

// --- Module Progress ---

export interface ModuleProgress {
  moduleId: string;
  status: "not_started" | "in_progress" | "completed";
  completedSections: string[];
  lastAccessedAt: Timestamp | null;
  completedAt: Timestamp | null;
}

export async function getModuleProgress(
  userId: string,
  moduleId: string
): Promise<ModuleProgress | null> {
  const ref = doc(getDb(), "users", userId, "moduleProgress", moduleId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ModuleProgress) : null;
}

export async function getAllModuleProgress(
  userId: string
): Promise<ModuleProgress[]> {
  const ref = collection(getDb(), "users", userId, "moduleProgress");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as ModuleProgress);
}

export async function markSectionComplete(
  userId: string,
  moduleId: string,
  sectionId: string,
  totalSections: number
) {
  const ref = doc(getDb(), "users", userId, "moduleProgress", moduleId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? (snap.data() as ModuleProgress) : null;

  const completedSections = existing?.completedSections ?? [];
  if (!completedSections.includes(sectionId)) {
    completedSections.push(sectionId);
  }

  const isComplete = completedSections.length >= totalSections;

  await setDoc(ref, {
    moduleId,
    status: isComplete ? "completed" : "in_progress",
    completedSections,
    lastAccessedAt: serverTimestamp(),
    completedAt: isComplete ? serverTimestamp() : null,
  });

  // Update user's last position
  const userRef = doc(getDb(), "users", userId);
  await updateDoc(userRef, {
    lastModule: moduleId,
    lastSection: sectionId,
    lastActiveAt: serverTimestamp(),
  });
}

// --- Test Results ---

export interface TestResult {
  testType: "mock" | "chapter_quiz";
  examId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  duration: number;
  completedAt: Timestamp;
  wrongQuestionIds: string[];
}

export async function saveTestResult(
  userId: string,
  testId: string,
  result: Omit<TestResult, "completedAt">
) {
  const ref = doc(getDb(), "users", userId, "testResults", testId);
  await setDoc(ref, {
    ...result,
    completedAt: serverTimestamp(),
  });
}

export async function getAllTestResults(
  userId: string
): Promise<TestResult[]> {
  const ref = collection(getDb(), "users", userId, "testResults");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as TestResult);
}

// --- Quiz Results ---

export interface QuizResultData {
  moduleId: string;
  sectionId: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: Timestamp;
}

export async function saveQuizResult(
  userId: string,
  moduleId: string,
  sectionId: string,
  result: { score: number; total: number; percentage: number }
) {
  const ref = doc(getDb(), "users", userId, "quizResults", `${moduleId}-${sectionId}`);
  await setDoc(ref, {
    moduleId,
    sectionId,
    ...result,
    completedAt: serverTimestamp(),
  });
}

export async function getAllQuizResults(
  userId: string
): Promise<Record<string, QuizResultData>> {
  const ref = collection(getDb(), "users", userId, "quizResults");
  const snap = await getDocs(ref);
  const results: Record<string, QuizResultData> = {};
  snap.docs.forEach((d) => {
    const data = d.data() as QuizResultData;
    results[`${data.moduleId}-${data.sectionId}`] = data;
  });
  return results;
}

// --- Language Preferences ---

export interface LanguagePreference {
  languageMode: "zhHant_zhHans" | "en_zhHans" | "en_only";
  examLanguage: "zhHant" | "en";
}

export async function getLanguagePreference(
  userId: string
): Promise<LanguagePreference | null> {
  const ref = doc(getDb(), "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (!data.languageMode) return null;
  return {
    languageMode: data.languageMode,
    examLanguage: data.examLanguage ?? "en",
  };
}

export async function saveLanguagePreference(
  userId: string,
  prefs: LanguagePreference
) {
  const ref = doc(getDb(), "users", userId);
  await updateDoc(ref, {
    languageMode: prefs.languageMode,
    examLanguage: prefs.examLanguage,
  });
}

// --- Wrong Questions ---

export interface WrongQuestionData {
  questionId: string;
  source: "mock" | "quiz" | "crash";
  sourceId: string;
  moduleId: string;
  wrongAnswer: string;
  correctAnswer: string;
  wrongCount: number;
  lastWrongAt: number;
  resolved: boolean;
  // New fields (may be missing in old Firestore docs)
  flaggedUnknown?: boolean;
  correctStreak?: number;
  lastReviewedAt?: number | null;
  addedAt?: number;
}

export async function saveWrongQuestion(userId: string, q: WrongQuestionData) {
  const ref = doc(getDb(), "users", userId, "wrongQuestions", q.questionId);
  await setDoc(ref, q);
}

export async function loadWrongQuestions(userId: string): Promise<Record<string, WrongQuestionData>> {
  const ref = collection(getDb(), "users", userId, "wrongQuestions");
  const snap = await getDocs(ref);
  const results: Record<string, WrongQuestionData> = {};
  snap.docs.forEach((d) => {
    const raw = d.data();
    // Fill defaults for old docs missing new fields
    results[d.id] = {
      questionId: raw.questionId ?? d.id,
      source: raw.source ?? "quiz",
      sourceId: raw.sourceId ?? "",
      moduleId: raw.moduleId ?? "",
      wrongAnswer: raw.wrongAnswer ?? "",
      correctAnswer: raw.correctAnswer ?? "",
      wrongCount: raw.wrongCount ?? 0,
      lastWrongAt: raw.lastWrongAt ?? Date.now(),
      resolved: raw.resolved ?? false,
      flaggedUnknown: raw.flaggedUnknown ?? false,
      correctStreak: raw.correctStreak ?? (raw.resolved ? 3 : 0),
      lastReviewedAt: raw.lastReviewedAt ?? null,
      addedAt: raw.addedAt ?? raw.lastWrongAt ?? Date.now(),
    };
  });
  return results;
}

export async function resolveWrongQuestion(userId: string, questionId: string) {
  const ref = doc(getDb(), "users", userId, "wrongQuestions", questionId);
  await updateDoc(ref, { resolved: true, correctStreak: 3 });
}

export async function updateWrongQuestionReview(
  userId: string,
  questionId: string,
  updates: { correctStreak: number; resolved: boolean; lastReviewedAt: number; wrongCount?: number; lastWrongAt?: number }
) {
  const ref = doc(getDb(), "users", userId, "wrongQuestions", questionId);
  await updateDoc(ref, updates);
}

// --- Crash Course Progress ---

export interface CrashCourseProgressData {
  phase1: { completedGroups: string[]; scores: Record<string, number> };
  phase2: { completedGroups: string[]; scores: Record<string, number> };
  phase3: { completedGroups: string[]; scores: Record<string, number> };
  phase4: {
    score: number;
    total: number;
    passed: boolean;
    wrongIds: string[];
    completedAt: number;
  } | null;
  lastAccessedAt: number | null;
}

export async function saveCrashCourseProgress(
  userId: string,
  data: CrashCourseProgressData
) {
  const ref = doc(getDb(), "users", userId, "crashCourseProgress", "main");
  await setDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function loadCrashCourseProgress(
  userId: string
): Promise<CrashCourseProgressData | null> {
  const ref = doc(getDb(), "users", userId, "crashCourseProgress", "main");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as CrashCourseProgressData) : null;
}
