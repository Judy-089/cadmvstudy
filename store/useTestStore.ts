"use client";

import { create } from "zustand";

interface TestState {
  answers: Record<number, string>; // questionIndex -> selected option key
  flagged: Set<number>;
  currentIndex: number;
  startTime: number | null;
  isSubmitted: boolean;
  setAnswer: (index: number, key: string) => void;
  toggleFlag: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  startExam: () => void;
  submitExam: () => void;
  resetExam: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  answers: {},
  flagged: new Set(),
  currentIndex: 0,
  startTime: null,
  isSubmitted: false,
  setAnswer: (index, key) =>
    set((state) => ({ answers: { ...state.answers, [index]: key } })),
  toggleFlag: (index) =>
    set((state) => {
      const next = new Set(state.flagged);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { flagged: next };
    }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  startExam: () => set({ answers: {}, flagged: new Set(), currentIndex: 0, startTime: Date.now(), isSubmitted: false }),
  submitExam: () => set({ isSubmitted: true }),
  resetExam: () => set({ answers: {}, flagged: new Set(), currentIndex: 0, startTime: null, isSubmitted: false }),
}));
