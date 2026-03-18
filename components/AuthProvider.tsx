"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { useQuizStore } from "@/store/useQuizStore";
import { useWrongQuestionStore } from "@/store/useWrongQuestionStore";
import { onAuthChange } from "@/lib/auth";
import { getLanguagePreference, loadWrongQuestions } from "@/lib/firestore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const enterAuthMode = useAppStore((s) => s.enterAuthMode);
  const exitSession = useAppStore((s) => s.exitSession);
  const loadProgress = useProgressStore((s) => s.loadAll);
  const loadQuizResults = useQuizStore((s) => s.loadResults);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          const prefs = await getLanguagePreference(user.uid);
          enterAuthMode(prefs ?? undefined);
        } catch {
          enterAuthMode();
        }
        // Load progress data from Firestore
        try {
          await loadProgress(user.uid);
          // Also sync quiz results to quiz store
          const progressState = useProgressStore.getState();
          if (progressState.quizResults) {
            const quizMap: Record<string, any> = {};
            Object.entries(progressState.quizResults).forEach(([key, val]) => {
              quizMap[key] = {
                moduleId: val.moduleId,
                sectionId: val.sectionId,
                score: val.score,
                total: val.total,
                percentage: val.percentage,
                completedAt: Date.now(),
              };
            });
            loadQuizResults(quizMap);
          }
        } catch { /* ignore */ }
        // Load wrong questions
        try {
          const wrongQs = await loadWrongQuestions(user.uid);
          useWrongQuestionStore.getState().loadQuestions(wrongQs);
        } catch { /* ignore */ }
        setUser(user);
      } else {
        const currentMode = useAppStore.getState().sessionMode;
        if (currentMode === "authenticated") {
          exitSession();
        }
        setUser(null);
      }
    });
    return unsubscribe;
  }, [setUser, enterAuthMode, exitSession, loadProgress, loadQuizResults]);

  return <>{children}</>;
}
