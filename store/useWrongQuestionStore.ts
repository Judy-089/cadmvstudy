"use client";

import { create } from "zustand";

export const RESOLVE_STREAK = 3; // consecutive correct answers needed to resolve

export interface WrongQuestion {
  questionId: string;
  source: "mock" | "quiz" | "crash";
  sourceId: string;        // e.g. "MOCK-01", "M02-S01", "CC-P1-groupId", "CC-P4"
  moduleId: string;        // e.g. "M02", "CC-P1", "CC-P4"
  wrongAnswer: string;     // "" if only flagged (not actually wrong)
  correctAnswer: string;
  wrongCount: number;
  lastWrongAt: number;
  resolved: boolean;       // true when correctStreak >= RESOLVE_STREAK
  // New fields
  flaggedUnknown: boolean;    // user manually flagged as uncertain
  correctStreak: number;      // consecutive correct answers in review
  lastReviewedAt: number | null;
  addedAt: number;            // first time entered the store
}

// Omit fields that are auto-managed
type AddWrongInput = Omit<WrongQuestion, "wrongCount" | "lastWrongAt" | "resolved" | "flaggedUnknown" | "correctStreak" | "lastReviewedAt" | "addedAt">;
type FlagInput = Omit<WrongQuestion, "wrongAnswer" | "wrongCount" | "lastWrongAt" | "resolved" | "flaggedUnknown" | "correctStreak" | "lastReviewedAt" | "addedAt">;

interface WrongQuestionState {
  questions: Record<string, WrongQuestion>;  // keyed by questionId

  addWrongQuestion: (q: AddWrongInput) => void;
  flagQuestion: (q: FlagInput) => void;
  unflagQuestion: (questionId: string) => void;
  recordReviewResult: (questionId: string, isCorrect: boolean) => void;
  resolveQuestion: (questionId: string) => void; // backward compat
  // Accepts partial data from Firestore (old docs may lack new fields)
  loadQuestions: (questions: Record<string, Partial<WrongQuestion> & { questionId: string }>) => void;
  getUnresolved: () => WrongQuestion[];
  getAll: () => WrongQuestion[];
  getByModule: (moduleId: string) => WrongQuestion[];
  getBySource: (source: "mock" | "quiz" | "crash") => WrongQuestion[];
  getTodaysMistakes: () => WrongQuestion[];
  getFlagged: () => WrongQuestion[];
  totalCount: () => number;
  unresolvedCount: () => number;
  resolvedCount: () => number;
  flaggedCount: () => number;
  todayCount: () => number;
}

// Fill defaults for old data that lacks new fields
function migrateQuestion(q: Record<string, unknown>): WrongQuestion {
  return {
    questionId: (q.questionId as string) ?? "",
    source: (q.source as WrongQuestion["source"]) ?? "quiz",
    sourceId: (q.sourceId as string) ?? "",
    moduleId: (q.moduleId as string) ?? "",
    wrongAnswer: (q.wrongAnswer as string) ?? "",
    correctAnswer: (q.correctAnswer as string) ?? "",
    wrongCount: (q.wrongCount as number) ?? 0,
    lastWrongAt: (q.lastWrongAt as number) ?? Date.now(),
    resolved: (q.resolved as boolean) ?? false,
    flaggedUnknown: (q.flaggedUnknown as boolean) ?? false,
    correctStreak: (q.correctStreak as number) ?? (q.resolved ? RESOLVE_STREAK : 0),
    lastReviewedAt: (q.lastReviewedAt as number | null) ?? null,
    addedAt: (q.addedAt as number) ?? (q.lastWrongAt as number) ?? Date.now(),
  };
}

function isTodayTimestamp(ts: number): boolean {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return ts >= start;
}

export const useWrongQuestionStore = create<WrongQuestionState>((set, get) => ({
  questions: {},

  addWrongQuestion: (q) =>
    set((state) => {
      const existing = state.questions[q.questionId];
      const now = Date.now();
      return {
        questions: {
          ...state.questions,
          [q.questionId]: {
            ...q,
            wrongCount: (existing?.wrongCount ?? 0) + 1,
            lastWrongAt: now,
            resolved: false,
            flaggedUnknown: existing?.flaggedUnknown ?? false,
            correctStreak: 0, // reset streak on new wrong
            lastReviewedAt: existing?.lastReviewedAt ?? null,
            addedAt: existing?.addedAt ?? now,
          },
        },
      };
    }),

  flagQuestion: (q) =>
    set((state) => {
      const existing = state.questions[q.questionId];
      const now = Date.now();
      if (existing) {
        // Already in store — just mark as flagged
        return {
          questions: {
            ...state.questions,
            [q.questionId]: {
              ...existing,
              flaggedUnknown: true,
              // If already resolved, un-resolve it so it needs review again
              correctStreak: 0,
              resolved: false,
            },
          },
        };
      }
      // New entry — flagged but not actually wrong
      return {
        questions: {
          ...state.questions,
          [q.questionId]: {
            ...q,
            wrongAnswer: "",
            wrongCount: 0,
            lastWrongAt: now,
            resolved: false,
            flaggedUnknown: true,
            correctStreak: 0,
            lastReviewedAt: null,
            addedAt: now,
          },
        },
      };
    }),

  unflagQuestion: (questionId) =>
    set((state) => {
      const q = state.questions[questionId];
      if (!q) return state;
      // If it was only flagged (never actually wrong), remove it entirely
      if (q.wrongCount === 0) {
        const { [questionId]: _, ...rest } = state.questions;
        return { questions: rest };
      }
      return {
        questions: {
          ...state.questions,
          [questionId]: { ...q, flaggedUnknown: false },
        },
      };
    }),

  recordReviewResult: (questionId, isCorrect) =>
    set((state) => {
      const q = state.questions[questionId];
      if (!q) return state;
      const now = Date.now();
      if (isCorrect) {
        const newStreak = q.correctStreak + 1;
        return {
          questions: {
            ...state.questions,
            [questionId]: {
              ...q,
              correctStreak: newStreak,
              resolved: newStreak >= RESOLVE_STREAK,
              lastReviewedAt: now,
            },
          },
        };
      } else {
        // Wrong in review — reset streak, increment wrongCount
        return {
          questions: {
            ...state.questions,
            [questionId]: {
              ...q,
              correctStreak: 0,
              resolved: false,
              wrongCount: q.wrongCount + 1,
              lastWrongAt: now,
              lastReviewedAt: now,
            },
          },
        };
      }
    }),

  // Backward compat — old code calls this
  resolveQuestion: (questionId) =>
    set((state) => {
      const q = state.questions[questionId];
      if (!q) return state;
      return {
        questions: {
          ...state.questions,
          [questionId]: {
            ...q,
            resolved: true,
            correctStreak: RESOLVE_STREAK,
            lastReviewedAt: Date.now(),
          },
        },
      };
    }),

  loadQuestions: (questions: Record<string, Partial<WrongQuestion> & { questionId: string }>) => {
    // Migrate all loaded questions to fill new field defaults
    const migrated: Record<string, WrongQuestion> = {};
    for (const [key, q] of Object.entries(questions)) {
      migrated[key] = migrateQuestion(q as unknown as Record<string, unknown>);
    }
    set({ questions: migrated });
  },

  getUnresolved: () => {
    const qs = Object.values(get().questions).filter((q) => !q.resolved);
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
      .sort((a, b) => {
        if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
        return b.wrongCount - a.wrongCount;
      });
  },

  getBySource: (source) => {
    return Object.values(get().questions)
      .filter((q) => q.source === source)
      .sort((a, b) => b.wrongCount - a.wrongCount || b.lastWrongAt - a.lastWrongAt);
  },

  getTodaysMistakes: () => {
    return Object.values(get().questions)
      .filter((q) => isTodayTimestamp(q.addedAt) || isTodayTimestamp(q.lastWrongAt))
      .sort((a, b) => b.lastWrongAt - a.lastWrongAt);
  },

  getFlagged: () => {
    return Object.values(get().questions)
      .filter((q) => q.flaggedUnknown && !q.resolved)
      .sort((a, b) => b.lastWrongAt - a.lastWrongAt);
  },

  totalCount: () => Object.keys(get().questions).length,
  unresolvedCount: () => Object.values(get().questions).filter((q) => !q.resolved).length,
  resolvedCount: () => Object.values(get().questions).filter((q) => q.resolved).length,
  flaggedCount: () => Object.values(get().questions).filter((q) => q.flaggedUnknown && !q.resolved).length,
  todayCount: () => {
    return Object.values(get().questions).filter(
      (q) => isTodayTimestamp(q.addedAt) || isTodayTimestamp(q.lastWrongAt)
    ).length;
  },
}));
