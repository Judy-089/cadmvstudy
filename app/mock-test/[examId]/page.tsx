"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTestStore, getSavedExam, clearSavedExam } from "@/store/useTestStore";
import { useAppStore } from "@/store/useAppStore";
import { getExamText, EXAM_LANGUAGE_LABELS } from "@/lib/language";
import { getAdultExamQuestions, getPassThreshold } from "@/lib/examUtils";
import { useRequireSession } from "@/lib/useRequireSession";
import { LockedPage } from "@/components/LockedOverlay";
import { tagImages, type ImageMapping } from "@/data/imageMap";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { ExamExitGuard } from "@/components/ExamExitGuard";
import { useT } from "@/lib/useT";
import type { ExamLanguage } from "@/store/useAppStore";

interface Question {
  id: string;
  stem_en: string;
  stem_zhHant?: string;
  options: { key: string; text_en: string; text_zhHant?: string }[];
  answer: string;
  explanation_en: string;
  explanation_zh: string;
  explanation_zhHant?: string;
  module: string;
  tags: string[];
  driverEd?: boolean;
}

interface ExamData {
  examId: string;
  questions: Question[];
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const t = useT();
  const [rawExam, setRawExam] = useState<ExamData | null>(null);

  const redirecting = useRequireSession();
  const isExamUnlocked = useAppStore((s) => s.isExamUnlocked);
  const sessionMode = useAppStore((s) => s.sessionMode);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const globalExamLang = useAppStore((s) => s.examLanguage);

  // Exam language — locked after first answer
  const [examLang, setExamLang] = useState<ExamLanguage>(
    sessionMode === "guest" ? "en" : globalExamLang
  );
  const [langLocked, setLangLocked] = useState(false);

  // Resume state
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [pendingSaved, setPendingSaved] = useState<ReturnType<typeof getSavedExam>>(null);

  const {
    answers, flagged, currentIndex, startTime, isSubmitted, elapsedOffset,
    setAnswer, toggleFlag, setCurrentIndex, startExam, submitExam,
    saveExam, restoreExam,
  } = useTestStore();

  // Check for saved exam on mount
  useEffect(() => {
    const saved = getSavedExam();
    if (saved && saved.examId === examId) {
      setPendingSaved(saved);
      setShowResumeBanner(true);
    }
  }, [examId]);

  // Load exam data
  useEffect(() => {
    import(`@/data/exams/${examId}.json`)
      .then((mod) => {
        setRawExam(mod.default || mod);
        // Only auto-start if no resume banner is pending
        const saved = getSavedExam();
        if (!saved || saved.examId !== examId) {
          startExam();
        }
      })
      .catch(() => setRawExam(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const handleResume = useCallback(() => {
    if (pendingSaved) {
      restoreExam(pendingSaved);
      setExamLang(pendingSaved.examLang as ExamLanguage);
      setLangLocked(true);
    }
    setShowResumeBanner(false);
    setPendingSaved(null);
  }, [pendingSaved, restoreExam]);

  const handleStartFresh = useCallback(() => {
    clearSavedExam();
    startExam();
    setShowResumeBanner(false);
    setPendingSaved(null);
  }, [startExam]);

  // Filter questions based on age
  const exam = useMemo(() => {
    if (!rawExam) return null;
    const isAdult = ageGroup !== "under18";
    const questions = isAdult
      ? getAdultExamQuestions(rawExam.questions)
      : rawExam.questions;
    return { ...rawExam, questions };
  }, [rawExam, ageGroup, sessionMode]);

  const elapsed = (startTime ? Math.floor((Date.now() - startTime) / 1000) : 0) + elapsedOffset;
  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  // Challenger mode: show answer immediately after selecting
  const isChallenger = examId === "MOCK-11";
  const [showChallengerAnswer, setShowChallengerAnswer] = useState(false);

  // Timer tick
  const [, setTick] = useState(0);
  useEffect(() => {
    if (isSubmitted || !startTime) return;
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, startTime]);

  // Whether exam is actively in progress (for exit guard)
  const examInProgress = !!startTime && !isSubmitted && !showResumeBanner;

  // Exit handlers
  const handleSaveAndExit = useCallback(() => {
    saveExam(examId, examLang);
    router.push("/mock-test");
  }, [saveExam, examId, examLang, router]);

  const handleDiscardAndExit = useCallback(() => {
    clearSavedExam();
    useTestStore.getState().resetExam();
    router.push("/mock-test");
  }, [router]);

  if (redirecting) return null;

  // Lock guard
  if (!isExamUnlocked(examId)) {
    return <LockedPage title={`Mock Exam ${examId.replace("MOCK-", "")}`} />;
  }

  if (!exam) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-text-gray">Loading exam...</p>
      </div>
    );
  }

  // Resume banner — show before exam starts
  if (showResumeBanner && pendingSaved) {
    const savedAnswered = Object.keys(pendingSaved.answers).length;
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border-2 border-primary/30 bg-card p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-xl font-bold text-text-dark">{t("exam.resumeBanner")}</h2>
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-text-gray">{t("exam.exitProgress")}</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {savedAnswered} / {exam.questions.length}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${(savedAnswered / exam.questions.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-text-gray">
              {formatTime(pendingSaved.elapsedBeforeSave)} elapsed
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              onClick={handleResume}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              {t("exam.resumeBtn")}
            </button>
            <button
              onClick={handleStartFresh}
              className="w-full rounded-xl border-2 border-border px-4 py-3 text-sm font-medium text-text-gray transition-colors hover:bg-gray-50"
            >
              {t("exam.resumeDiscard")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentIndex];
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).length;
  const passThreshold = getPassThreshold(totalQuestions);

  // Get text in chosen language
  const qt = getExamText(question, examLang);

  const handleAnswer = (index: number, key: string) => {
    if (isChallenger && answers[index] !== undefined) return; // prevent changing answer in challenger
    setAnswer(index, key);
    if (!langLocked) setLangLocked(true);
    if (isChallenger) setShowChallengerAnswer(true);
  };

  const handleChallengerNext = () => {
    setShowChallengerAnswer(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions answered — auto submit
      submitExam();
    }
  };

  if (isSubmitted) {
    let correct = 0;
    const wrongIds: string[] = [];
    exam.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
      else wrongIds.push(q.id);
    });
    // Save to Firestore for signed-in users
    const user = useAuthStore.getState().user;
    if (user) {
      const saveExamResult = useProgressStore.getState().saveExamResult;
      saveExamResult(user.uid, `${examId}-${Date.now()}`, {
        testType: "mock",
        examId,
        score: correct,
        totalQuestions,
        passed: correct >= passThreshold,
        duration: elapsed,
        wrongQuestionIds: wrongIds,
      });
    }
    router.push(`/mock-test/${examId}/result?score=${correct}&total=${totalQuestions}&time=${elapsed}&lang=${examLang}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
      {/* Exit Guard */}
      <ExamExitGuard
        active={examInProgress}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />

      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Exit button */}
          <button
            onClick={() => {
              const trigger = (window as unknown as Record<string, unknown>).__examExitTrigger;
              if (typeof trigger === "function") (trigger as () => void)();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-gray transition-colors hover:bg-gray-100 hover:text-error"
            title={t("exam.exitBtn")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-primary">
            {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="text-sm text-text-gray">
            Answered: {answeredCount}/{totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Language toggle — auth users only, locked after first answer */}
          {sessionMode === "authenticated" && (
            <div className="hidden items-center gap-1 rounded-lg bg-gray-100 p-0.5 sm:flex">
              {(Object.keys(EXAM_LANGUAGE_LABELS) as ExamLanguage[]).map((lang) => (
                <button
                  key={lang}
                  disabled={langLocked}
                  onClick={() => setExamLang(lang)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    lang === examLang
                      ? "bg-primary text-white"
                      : langLocked
                      ? "text-text-gray/50 cursor-not-allowed"
                      : "text-text-gray hover:text-text-dark"
                  }`}
                >
                  {EXAM_LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>
          )}

          <span className="font-mono text-sm text-text-gray">
            {formatTime(elapsed)}
          </span>
          {!isChallenger && (
            <button
              onClick={() => {
                if (answeredCount < totalQuestions && !confirm(`You've answered ${answeredCount}/${totalQuestions} questions. Submit anyway?`))
                  return;
                submitExam();
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Submit
            </button>
          )}
          {isChallenger && (
            <span className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-xs font-bold text-white">
              🔥 Challenger
            </span>
          )}
        </div>
      </div>

      {/* Pass info */}
      <div className="mb-4 text-center text-xs text-text-gray">
        Pass: {passThreshold}/{totalQuestions} (83%)
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-text-gray">Q{currentIndex + 1}</span>
          {!isChallenger && (
            <button
              onClick={() => toggleFlag(currentIndex)}
              className={`text-xs ${flagged.has(currentIndex) ? "text-warning font-medium" : "text-text-gray hover:text-warning"}`}
            >
              {flagged.has(currentIndex) ? "⚑ Flagged" : "⚐ Flag"}
            </button>
          )}
        </div>

        <p className="text-lg leading-relaxed text-text-dark">{qt.stem}</p>

        {/* Sign images for tagged questions */}
        {question.tags && question.tags.length > 0 && (() => {
          const imgs: ImageMapping[] = [];
          const seen = new Set<string>();
          for (const tag of question.tags) {
            const matches = tagImages[tag];
            if (matches) {
              for (const img of matches) {
                const src = img.srcExam || img.src;
                if (!seen.has(src)) {
                  seen.add(src);
                  imgs.push({ ...img, src });
                }
              }
            }
          }
          if (imgs.length === 0) return null;
          return (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {imgs.slice(0, 2).map((img) => (
                <figure key={img.src} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <img src={img.src} alt={img.alt} className="h-32 w-auto object-contain p-3" loading="lazy" />
                </figure>
              ))}
            </div>
          );
        })()}

        <div className="mt-6 space-y-3">
          {question.options.map((opt) => {
            const isSelected = answers[currentIndex] === opt.key;
            const optText = qt.getOptionText(opt);
            const isCorrect = opt.key === question.answer;
            const showResult = isChallenger && showChallengerAnswer;
            return (
              <button
                key={opt.key}
                onClick={() => handleAnswer(currentIndex, opt.key)}
                disabled={showResult}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? "border-green-500 bg-green-50"
                      : isSelected
                      ? "border-red-400 bg-red-50"
                      : "border-border opacity-50"
                    : isSelected
                    ? "border-primary bg-primary-light"
                    : "border-border hover:border-primary/30 hover:bg-gray-50"
                }`}
              >
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  showResult
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : isSelected
                      ? "bg-red-400 text-white"
                      : "bg-gray-100 text-text-gray"
                    : isSelected ? "bg-primary text-white" : "bg-gray-100 text-text-gray"
                }`}>
                  {showResult ? (isCorrect ? "✓" : isSelected ? "✗" : opt.key) : opt.key}
                </span>
                <span className="text-text-dark">{optText}</span>
              </button>
            );
          })}
        </div>

        {/* Challenger mode: show bilingual explanation immediately */}
        {isChallenger && showChallengerAnswer && (
          <div className="mt-6 rounded-xl border-2 border-primary/20 bg-primary-light/30 p-5">
            <div className="mb-2 flex items-center gap-2">
              {answers[currentIndex] === question.answer ? (
                <span className="rounded-full bg-green-500 px-3 py-0.5 text-xs font-bold text-white">✓ Correct</span>
              ) : (
                <span className="rounded-full bg-red-400 px-3 py-0.5 text-xs font-bold text-white">✗ Incorrect</span>
              )}
              <span className="text-xs text-text-gray">
                Answer: {question.answer}
              </span>
            </div>
            {/* English explanation */}
            <p className="text-sm leading-relaxed text-text-dark">{question.explanation_en}</p>
            {/* Chinese explanation (zhHant or zh) */}
            <p className="mt-2 text-sm leading-relaxed text-text-light">
              {question.explanation_zhHant || question.explanation_zh}
            </p>
            <button
              onClick={handleChallengerNext}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              {currentIndex < totalQuestions - 1 ? "Next Question →" : "See Results →"}
            </button>
          </div>
        )}
      </div>

      {/* Navigation — hidden in Challenger mode */}
      {!isChallenger && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary-light disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(totalQuestions - 1, currentIndex + 1))}
            disabled={currentIndex === totalQuestions - 1}
            className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary-light disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}

      {/* Question Grid — hidden in Challenger mode */}
      {!isChallenger && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="mb-3 text-xs font-medium text-text-gray">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isFlagged = flagged.has(i);
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                    isCurrent ? "ring-2 ring-primary ring-offset-1" : ""
                  } ${
                    isFlagged ? "bg-warning-light text-warning"
                      : isAnswered ? "bg-primary-light text-primary"
                      : "bg-gray-100 text-text-gray"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Challenger mode: progress bar */}
      {isChallenger && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-text-gray mb-2">
            <span>Progress: {answeredCount}/{totalQuestions}</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
