"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useCrashCourseStore } from "@/store/useCrashCourseStore";
import { useT } from "@/lib/useT";
import { useRequireSession } from "@/lib/useRequireSession";
import { signInWithGoogle } from "@/lib/auth";

const PHASES = [
  { phase: 1, key: "cc.phase1" as const, minutes: 20 },
  { phase: 2, key: "cc.phase2" as const, minutes: 50 },
  { phase: 3, key: "cc.phase3" as const, minutes: 20 },
  { phase: 4, key: "cc.phase4" as const, minutes: 30 },
] as const;

export default function CrashCoursePage() {
  const sessionMode = useAppStore((s) => s.sessionMode);
  const t = useT();
  const redirecting = useRequireSession();

  const isPhaseUnlocked = useCrashCourseStore((s) => s.isPhaseUnlocked);
  const isPhaseCompleted = useCrashCourseStore((s) => s.isPhaseCompleted);
  const getPhaseProgress = useCrashCourseStore((s) => s.getPhaseProgress);
  const getOverallProgress = useCrashCourseStore((s) => s.getOverallProgress);

  if (redirecting) return null;

  // Crash course is for authenticated users only
  if (sessionMode !== "authenticated") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-4xl">
          🔒
        </div>
        <h1 className="mt-6 text-xl font-bold text-text-dark">
          {t("cc.signInRequired")}
        </h1>
        <p className="mt-2 text-sm text-text-gray">
          {t("cc.disclaimer")}
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
        >
          {t("nav.signIn")}
        </button>
      </div>
    );
  }

  const overall = getOverallProgress();
  const overallPct = overall.total > 0
    ? Math.round((overall.completed / overall.total) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg">
        <h1 className="text-xl font-bold md:text-2xl">
          {t("cc.banner")} 🔥
        </h1>
        <p className="mt-1 text-sm text-white/80">
          ~2 {t("cc.minutes")} &middot; 4 {t("cc.phase")}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-800">
          ⚠️ {t("cc.disclaimer")}
        </p>
      </div>

      {/* Overall progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text-dark">{t("cc.overallProgress")}</span>
          <span className="text-text-gray">{overallPct}%</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-gray-100">
          <div
            className="h-2.5 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Quick Reference Numbers button */}
      <Link
        href="/crash-course/numbers"
        className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-light/30 p-4 transition-all hover:bg-primary-light/50 hover:shadow-md"
      >
        <span className="text-2xl">📊</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">
            {t("cc.numbersBtn")}
          </p>
        </div>
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Phase cards with progress line */}
      <div className="relative mt-8">
        {/* Vertical progress line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {PHASES.map(({ phase, key, minutes }, idx) => {
            const unlocked = isPhaseUnlocked(phase);
            const completed = isPhaseCompleted(phase);
            const progress = getPhaseProgress(phase);
            const phasePct = progress.total > 0
              ? Math.round((progress.completed / progress.total) * 100)
              : 0;

            const isLast = idx === PHASES.length - 1;

            // Status icon (all phases always unlocked)
            let statusIcon: string;
            let dotColor: string;
            if (completed) {
              statusIcon = "✅";
              dotColor = "bg-success";
            } else {
              statusIcon = `${phase}`;
              dotColor = "bg-primary";
            }

            const cardContent = (
              <div className="relative flex gap-4 pl-0">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                      completed
                        ? "bg-success/10 text-success"
                        : unlocked
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {statusIcon}
                  </div>
                </div>

                {/* Card body */}
                <div
                  className={`flex-1 rounded-xl border p-4 transition-all ${
                    completed
                      ? "border-success/30 bg-success/5"
                      : unlocked
                        ? "border-primary/30 bg-card shadow-sm hover:shadow-md hover:border-primary/50"
                        : "border-border bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-text-gray">
                        {t("cc.phase")} {phase}
                      </p>
                      <h3
                        className={`mt-0.5 text-base font-semibold ${
                          unlocked ? "text-text-dark" : "text-text-gray"
                        }`}
                      >
                        {t(key)}
                      </h3>
                    </div>
                    <span className="text-xs text-text-gray">
                      ~{minutes} {t("cc.minutes")}
                    </span>
                  </div>

                  {/* Progress or status */}
                  {completed ? (
                    <p className="mt-2 text-xs font-medium text-success">
                      ✅ {t("cc.completed")}
                    </p>
                  ) : unlocked ? (
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-primary transition-all"
                            style={{ width: `${phasePct}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-gray">{phasePct}%</span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-primary">
                        {t("cc.startPractice")} →
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-text-gray">
                      🔒 {t("cc.locked")}
                    </p>
                  )}
                </div>
              </div>
            );

            // All phases are always clickable (no gating)
            return (
              <Link key={phase} href={`/crash-course/phase/${phase}`}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
