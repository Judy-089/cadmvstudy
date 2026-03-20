"use client";

import { create } from "zustand";

// ── Saved exam snapshot (persisted to localStorage) ──
export interface SavedExam {
  examId: string;
  answers: Record<number, string>;
  flagged: number[];          // Set<number> serialized as array
  currentIndex: number;
  startTime: number;
  elapsedBeforeSave: number;  // seconds already spent before saving
  examLang: string;
  savedAt: number;
}

const SAVED_EXAM_KEY = "acedrivego_saved_exam";

export function getSavedExam(): SavedExam | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVED_EXAM_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedExam;
  } catch {
    return null;
  }
}

export function clearSavedExam() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SAVED_EXAM_KEY);
}

function persistExam(data: SavedExam) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_EXAM_KEY, JSON.stringify(data));
}

// ── Store ──
interface TestState {
  answers: Record<number, string>; // questionIndex -> selected option key
  flagged: Set<number>;
  currentIndex: number;
  startTime: number | null;
  isSubmitted: boolean;
  elapsedOffset: number;          // seconds from previous saved session
  setAnswer: (index: number, key: string) => void;
  toggleFlag: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  startExam: () => void;
  submitExam: () => void;
  resetExam: () => void;
  /** Save current progress and return the snapshot */
  saveExam: (examId: string, examLang: string) => SavedExam | null;
  /** Restore from a saved snapshot */
  restoreExam: (saved: SavedExam) => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  answers: {},
  flagged: new Set(),
  currentIndex: 0,
  startTime: null,
  isSubmitted: false,
  elapsedOffset: 0,

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

  startExam: () =>
    set({
      answers: {},
      flagged: new Set(),
      currentIndex: 0,
      startTime: Date.now(),
      isSubmitted: false,
      elapsedOffset: 0,
    }),

  submitExam: () => {
    clearSavedExam();
    set({ isSubmitted: true });
  },

  resetExam: () => {
    clearSavedExam();
    set({
      answers: {},
      flagged: new Set(),
      currentIndex: 0,
      startTime: null,
      isSubmitted: false,
      elapsedOffset: 0,
    });
  },

  saveExam: (examId, examLang) => {
    const { answers, flagged, currentIndex, startTime, isSubmitted, elapsedOffset } = get();
    if (!startTime || isSubmitted) return null;
    const elapsedNow = Math.floor((Date.now() - startTime) / 1000);
    const snapshot: SavedExam = {
      examId,
      answers,
      flagged: Array.from(flagged),
      currentIndex,
      startTime,
      elapsedBeforeSave: elapsedOffset + elapsedNow,
      examLang,
      savedAt: Date.now(),
    };
    persistExam(snapshot);
    return snapshot;
  },

  restoreExam: (saved) => {
    set({
      answers: saved.answers,
      flagged: new Set(saved.flagged),
      currentIndex: saved.currentIndex,
      startTime: Date.now(), // fresh timer from now
      isSubmitted: false,
      elapsedOffset: saved.elapsedBeforeSave,
    });
  },
}));
