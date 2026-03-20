"use client";

import { useEffect, useState, useCallback } from "react";
import { useT } from "@/lib/useT";

interface ExamExitGuardProps {
  /** Whether the guard is active (exam in progress) */
  active: boolean;
  /** Called when user confirms they want to save and exit */
  onSaveAndExit: () => void;
  /** Called when user confirms they want to discard and exit */
  onDiscardAndExit: () => void;
  /** Number of answered questions */
  answeredCount: number;
  /** Total number of questions */
  totalQuestions: number;
}

/**
 * Exam exit protection:
 * 1. Browser tab close / refresh → native beforeunload dialog
 * 2. In-app back button → custom modal with Save / Discard / Cancel
 * 3. Browser back button → intercepts via popstate + pushState trick
 */
export function ExamExitGuard({
  active,
  onSaveAndExit,
  onDiscardAndExit,
  answeredCount,
  totalQuestions,
}: ExamExitGuardProps) {
  const [showModal, setShowModal] = useState(false);
  const t = useT();

  // 1. Prevent browser tab close / refresh
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);

  // 2. Intercept browser back button via popstate
  useEffect(() => {
    if (!active) return;

    // Push a dummy state so pressing Back triggers popstate instead of leaving
    window.history.pushState({ examGuard: true }, "");

    const handlePopState = () => {
      // User pressed browser back — show our modal instead of navigating
      setShowModal(true);
      // Push again so they stay on the page
      window.history.pushState({ examGuard: true }, "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [active]);

  // Public trigger for in-app exit buttons
  const triggerExit = useCallback(() => {
    setShowModal(true);
  }, []);

  // Expose trigger via a global ref so parent can call it
  useEffect(() => {
    if (active) {
      (window as unknown as Record<string, unknown>).__examExitTrigger = triggerExit;
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__examExitTrigger;
    };
  }, [active, triggerExit]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning-light">
          <span className="text-3xl">⚠️</span>
        </div>

        <h2 className="text-center text-lg font-bold text-text-dark">
          {t("exam.exitTitle")}
        </h2>
        <p className="mt-2 text-center text-sm text-text-gray">
          {t("exam.exitDesc")}
        </p>

        {/* Progress indicator */}
        <div className="mt-4 rounded-xl bg-gray-50 p-3 text-center">
          <p className="text-sm font-medium text-text-dark">
            {t("exam.exitProgress")}
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {answeredCount} / {totalQuestions}
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => {
              setShowModal(false);
              onSaveAndExit();
            }}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {t("exam.exitSave")}
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              onDiscardAndExit();
            }}
            className="w-full rounded-xl border-2 border-error/30 px-4 py-3 text-sm font-medium text-error transition-colors hover:bg-error-light"
          >
            {t("exam.exitDiscard")}
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-text-gray transition-colors hover:bg-gray-100"
          >
            {t("exam.exitCancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Helper to trigger the exit modal from outside the component */
export function triggerExamExit() {
  const trigger = (window as unknown as Record<string, unknown>).__examExitTrigger;
  if (typeof trigger === "function") {
    (trigger as () => void)();
  }
}
