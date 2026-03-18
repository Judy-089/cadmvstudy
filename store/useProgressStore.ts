"use client";

import { create } from "zustand";
import {
  getAllModuleProgress,
  getAllTestResults,
  getAllQuizResults,
  markSectionComplete,
  saveTestResult,
  saveQuizResult,
  type ModuleProgress,
  type TestResult,
  type QuizResultData,
} from "@/lib/firestore";

interface ProgressState {
  // Data
  moduleProgress: Record<string, ModuleProgress>;
  testResults: TestResult[];
  quizResults: Record<string, QuizResultData>;
  loaded: boolean;

  // Actions
  loadAll: (userId: string) => Promise<void>;
  completeSection: (userId: string, moduleId: string, sectionId: string, totalSections: number) => Promise<void>;
  saveExamResult: (userId: string, testId: string, result: Omit<TestResult, "completedAt">) => Promise<void>;
  saveQuiz: (userId: string, moduleId: string, sectionId: string, score: number, total: number) => Promise<void>;
  getModulePercent: (moduleId: string) => number;
  getOverallPercent: () => number;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  moduleProgress: {},
  testResults: [],
  quizResults: {},
  loaded: false,

  loadAll: async (userId) => {
    try {
      const [mp, tr, qr] = await Promise.all([
        getAllModuleProgress(userId),
        getAllTestResults(userId),
        getAllQuizResults(userId),
      ]);

      const mpMap: Record<string, ModuleProgress> = {};
      mp.forEach((m) => { mpMap[m.moduleId] = m; });

      set({ moduleProgress: mpMap, testResults: tr, quizResults: qr, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  completeSection: async (userId, moduleId, sectionId, totalSections) => {
    try {
      await markSectionComplete(userId, moduleId, sectionId, totalSections);

      // Update local state
      set((state) => {
        const existing = state.moduleProgress[moduleId];
        const completedSections = [...(existing?.completedSections ?? [])];
        if (!completedSections.includes(sectionId)) {
          completedSections.push(sectionId);
        }
        const isComplete = completedSections.length >= totalSections;

        return {
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              moduleId,
              status: isComplete ? "completed" : "in_progress",
              completedSections,
              lastAccessedAt: null,
              completedAt: null,
            },
          },
        };
      });
    } catch { /* ignore if Firestore not configured */ }
  },

  saveExamResult: async (userId, testId, result) => {
    try {
      await saveTestResult(userId, testId, result);
      set((state) => ({
        testResults: [...state.testResults, { ...result, completedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any }],
      }));
    } catch { /* ignore */ }
  },

  saveQuiz: async (userId, moduleId, sectionId, score, total) => {
    const percentage = Math.round((score / total) * 100);
    try {
      await saveQuizResult(userId, moduleId, sectionId, { score, total, percentage });
      set((state) => ({
        quizResults: {
          ...state.quizResults,
          [`${moduleId}-${sectionId}`]: {
            moduleId, sectionId, score, total, percentage,
            completedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          },
        },
      }));
    } catch { /* ignore */ }
  },

  getModulePercent: (moduleId) => {
    const mp = get().moduleProgress[moduleId];
    if (!mp || !mp.completedSections) return 0;
    // We don't know total sections here, so return based on completed count
    // This will be used with actual section count from content
    return mp.completedSections.length;
  },

  getOverallPercent: () => {
    const mp = get().moduleProgress;
    const modules = Object.values(mp);
    if (modules.length === 0) return 0;
    const completed = modules.filter((m) => m.status === "completed").length;
    return Math.round((completed / 11) * 100); // 11 base modules
  },
}));
