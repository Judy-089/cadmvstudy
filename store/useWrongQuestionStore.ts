"use client";

import { create } from "zustand";

export interface WrongQuestion {
  questionId: string;
  source: "mock" | "quiz";
  sourceId: string;        // e.g. "MOCK-01" or "M02-S01"
  moduleId: string;
  wrongAnswer: string;
  correctAnswer: string;
  wrongCount: number;
  lastWrongAt: number;
  resolved: boolean;
}

interface WrongQuestionState {
  questions: Record<string, WrongQuestion>;  // keyed by questionId

  addWrongQuestion: (q: Omit<WrongQuestion, "wrongCount" | "lastWrongAt" | "resolved">) => void;
  resolveQuestion: (questionId: string) => void;
  loadQuestions: (questions: Record<string, WrongQuestion>) => void;
  getUnresolved: () => WrongQuestion[];
  getAll: () => WrongQuestion[];
  getByModule: (moduleId: string) => WrongQuestion[];
  totalCount: () => number;
  unresolvedCount: () => number;
  resolvedCount: () => number;
}

export const useWrongQuestionStore = create<WrongQuestionState>((set, get) => ({
  questions: {},

  addWrongQuestion: (q) =>
    set((state) => {
      const existing = state.questions[q.questionId];
      return {
        questions: {
          ...state.questions,
          [q.questionId]: {
            ...q,
            wrongCount: (existing?.wrongCount ?? 0) + 1,
            lastWrongAt: Date.now(),
            resolved: false,
          },
        },
      };
    }),

  resolveQuestion: (questionId) =>
    set((state) => {
      const q = state.questions[questionId];
      if (!q) return state;
      return {
        questions: {
          ...state.questions,
          [questionId]: { ...q, resolved: true },
        },
      };
    }),

  loadQuestions: (questions) => set({ questions }),

  getUnresolved: () => {
    const qs = Object.values(get().questions).filter((q) => !q.resolved);
    // Sort: most wrong first, then most recent
    return qs.sort((a, b) => b.wrongCount - a.wrongCount || b.lastWrongAt - a.lastWrongAt);
  },

  getAll: () => {
    const qs = Object.values(get().questions);
    return qs.sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return b.wrongCount - a.wrongCount || b.lastWrongAt - a.lastWrongAt;
    });
  },

  getByModule: (moduleId) => {
    return Object.values(get().questions)
      .filter((q) => q.moduleId === moduleId)
      .sort((a, b) => b.wrongCount - a.wrongCount);
  },

  totalCount: () => Object.keys(get().questions).length,
  unresolvedCount: () => Object.values(get().questions).filter((q) => !q.resolved).length,
  resolvedCount: () => Object.values(get().questions).filter((q) => q.resolved).length,
}));
