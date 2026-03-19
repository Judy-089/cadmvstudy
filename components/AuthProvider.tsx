"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { useQuizStore } from "@/store/useQuizStore";
import { useWrongQuestionStore } from "@/store/useWrongQuestionStore";
import { onAuthChange } from "@/lib/auth";
import { getLanguagePreference, loadWrongQuestions } from "@/lib/firestore";

const AUTH_TIMEOUT_MS = 8000; // 8 seconds max wait for Firebase auth

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const enterAuthMode = useAppStore((s) => s.enterAuthMode);
  const exitSession = useAppStore((s) => s.exitSession);
  const loadProgress = useProgressStore((s) => s.loadAll);
  const loadQuizResults = useQuizStore((s) => s.loadResults);
  const authResolved = useRef(false);

  useEffect(() => {
    // Safety timeout: if onAuthStateChanged never fires (mobile background tab),
    // force loading to false so the user isn't stuck on a spinner.
    const timeout = setTimeout(() => {
      if (!authResolved.current) {
        authResolved.current = true;
        const { loading } = useAuthStore.getState();
        if (loading) {
          console.warn("[AuthProvider] Auth timeout — forcing loading=false");
          setUser(null);
        }
      }
    }, AUTH_TIMEOUT_MS);

    const unsubscribe = onAuthChange(async (user) => {
      authResolved.current = true;
      clearTimeout(timeout);

      if (user) {
        // CRITICAL FIX: Set user FIRST to unblock UI immediately,
        // then load data in background. This prevents infinite spinner
        // when Firestore calls are slow (e.g., mobile cold network).
        try {
          const prefs = await getLanguagePreference(user.uid);
          enterAuthMode(prefs ?? undefined);
        } catch {
          enterAuthMode();
        }
        setUser(user); // ← Unblock UI before data loading

        // Load data in background (non-blocking)
        (async () => {
          try {
            await loadProgress(user.uid);
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
          } catch { /* progress load failed silently */ }
          try {
            const wrongQs = await loadWrongQuestions(user.uid);
            useWrongQuestionStore.getState().loadQuestions(wrongQs);
          } catch { /* wrong questions load failed silently */ }
        })();
      } else {
        const currentMode = useAppStore.getState().sessionMode;
        if (currentMode === "authenticated") {
          exitSession();
        }
        setUser(null);
      }
    });

    // Visibility change handler: when tab becomes visible again after being
    // backgrounded (common on mobile), check if auth is stuck in loading state.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const { loading } = useAuthStore.getState();
        if (loading) {
          // Auth still loading after tab resume — set a short timeout
          // to give Firebase one more chance, then force-resolve.
          setTimeout(() => {
            const { loading: stillLoading } = useAuthStore.getState();
            if (stillLoading) {
              console.warn("[AuthProvider] Forcing auth resolve after tab resume");
              setUser(null);
            }
          }, 3000);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setUser, enterAuthMode, exitSession, loadProgress, loadQuizResults]);

  return <>{children}</>;
}
