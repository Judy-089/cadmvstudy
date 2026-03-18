"use client";

import { create } from "zustand";

export interface QuizResult {
  moduleId: string;
  sectionId: string;
  score: number;       // correct answers
  total: number;       // total questions
  percentage: number;  // 0-100
  completedAt: number; // timestamp
}

interface QuizState {
  // Results keyed by "M01-S01" format
  results: Record<string, QuizResult>;

  // Current quiz state
  isQuizActive: boolean;
  quizModuleId: string | null;
  quizSectionId: string | null;

  // Actions
  setResult: (result: QuizResult) => void;
  loadResults: (results: Record<string, QuizResult>) => void;
  getResult: (moduleId: string, sectionId: string) => QuizResult | null;
  getSectionColor: (moduleId: string, sectionId: string) => "gray" | "green" | "orange" | "red";
  startQuiz: (moduleId: string, sectionId: string) => void;
  endQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  results: {},
  isQuizActive: false,
  quizModuleId: null,
  quizSectionId: null,

  setResult: (result) =>
    set((state) => ({
      results: {
        ...state.results,
        [`${result.moduleId}-${result.sectionId}`]: result,
      },
    })),

  loadResults: (results) => set({ results }),

  getResult: (moduleId, sectionId) => {
    return get().results[`${moduleId}-${sectionId}`] ?? null;
  },

  getSectionColor: (moduleId, sectionId) => {
    const result = get().results[`${moduleId}-${sectionId}`];
    if (!result) return "gray";
    if (result.percentage === 100) return "green";
    if (result.percentage >= 80) return "orange";
    return "red";
  },

  startQuiz: (moduleId, sectionId) =>
    set({ isQuizActive: true, quizModuleId: moduleId, quizSectionId: sectionId }),

  endQuiz: () =>
    set({ isQuizActive: false, quizModuleId: null, quizSectionId: null }),
}));
