"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  saveCrashCourseProgress,
  loadCrashCourseProgress,
} from "@/lib/firestore";

/* ── Phase group totals ── */
const PHASE_TOTALS: Record<number, number> = {
  1: 5, // 5 groups
  2: 6, // 6 topics
  3: 7, // 7 comparison pairs
};

export interface PhaseProgress {
  completedGroups: string[];
  scores: Record<string, number>; // groupId → score
}

export interface Phase4Result {
  score: number;
  total: number;
  passed: boolean;
  wrongIds: string[];
  completedAt: number;
}

interface CrashCourseState {
  // Progress
  phase1: PhaseProgress;
  phase2: PhaseProgress;
  phase3: PhaseProgress;
  phase4: Phase4Result | null;
  lastAccessedAt: number | null;

  // Actions
  completeGroup: (
    phase: 1 | 2 | 3,
    groupId: string,
    score: number
  ) => void;
  submitPhase4: (
    score: number,
    total: number,
    wrongIds: string[]
  ) => void;
  getPhaseProgress: (phase: number) => { completed: number; total: number };
  isPhaseUnlocked: (phase: number) => boolean;
  isPhaseCompleted: (phase: number) => boolean;
  getOverallProgress: () => { completed: number; total: number };
  reset: () => void;

  // Firestore sync
  syncToFirestore: (userId: string) => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
}

const emptyPhase = (): PhaseProgress => ({
  completedGroups: [],
  scores: {},
});

export const useCrashCourseStore = create<CrashCourseState>()(
  persist(
    (set, get) => ({
      phase1: emptyPhase(),
      phase2: emptyPhase(),
      phase3: emptyPhase(),
      phase4: null,
      lastAccessedAt: null,

      completeGroup: (phase, groupId, score) => {
        const key = `phase${phase}` as "phase1" | "phase2" | "phase3";
        set((state) => {
          const prev = state[key];
          const completedGroups = prev.completedGroups.includes(groupId)
            ? prev.completedGroups
            : [...prev.completedGroups, groupId];
          // Keep best score
          const prevScore = prev.scores[groupId] ?? 0;
          return {
            [key]: {
              completedGroups,
              scores: {
                ...prev.scores,
                [groupId]: Math.max(prevScore, score),
              },
            },
            lastAccessedAt: Date.now(),
          };
        });
      },

      submitPhase4: (score, total, wrongIds) => {
        const passThreshold = 38;
        set({
          phase4: {
            score,
            total,
            passed: score >= passThreshold,
            wrongIds,
            completedAt: Date.now(),
          },
          lastAccessedAt: Date.now(),
        });
      },

      getPhaseProgress: (phase) => {
        const state = get();
        if (phase === 4) {
          return {
            completed: state.phase4 ? 1 : 0,
            total: 1,
          };
        }
        const key = `phase${phase}` as "phase1" | "phase2" | "phase3";
        return {
          completed: state[key].completedGroups.length,
          total: PHASE_TOTALS[phase] ?? 0,
        };
      },

      isPhaseUnlocked: (_phase) => {
        // All phases are always unlocked — no gating
        return true;
      },

      isPhaseCompleted: (phase) => {
        const { completed, total } = get().getPhaseProgress(phase);
        return completed >= total;
      },

      getOverallProgress: () => {
        const state = get();
        let completed = 0;
        let total = 0;
        for (let p = 1; p <= 4; p++) {
          const prog = state.getPhaseProgress(p);
          completed += prog.completed;
          total += prog.total;
        }
        return { completed, total };
      },

      reset: () =>
        set({
          phase1: emptyPhase(),
          phase2: emptyPhase(),
          phase3: emptyPhase(),
          phase4: null,
          lastAccessedAt: null,
        }),

      syncToFirestore: async (userId) => {
        try {
          const { phase1, phase2, phase3, phase4, lastAccessedAt } = get();
          await saveCrashCourseProgress(userId, {
            phase1,
            phase2,
            phase3,
            phase4,
            lastAccessedAt,
          });
        } catch {
          /* ignore if Firestore not configured */
        }
      },

      loadFromFirestore: async (userId) => {
        try {
          const data = await loadCrashCourseProgress(userId);
          if (data) {
            set({
              phase1: data.phase1 ?? emptyPhase(),
              phase2: data.phase2 ?? emptyPhase(),
              phase3: data.phase3 ?? emptyPhase(),
              phase4: data.phase4 ?? null,
              lastAccessedAt: data.lastAccessedAt ?? null,
            });
          }
        } catch {
          /* ignore */
        }
      },
    }),
    {
      name: "crash-course-progress",
      partialize: (state) => ({
        phase1: state.phase1,
        phase2: state.phase2,
        phase3: state.phase3,
        phase4: state.phase4,
        lastAccessedAt: state.lastAccessedAt,
      }),
    }
  )
);
