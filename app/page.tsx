"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { signInWithGoogle } from "@/lib/auth";
import { modules } from "@/data/modules";
import { useT } from "@/lib/useT";
import { useProgressStore } from "@/store/useProgressStore";
import { AgeSelectionModal } from "@/components/AgeSelectionModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { LockedCard, FreeBadge } from "@/components/LockedOverlay";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { UILanguageSwitcher } from "@/components/UILanguageSwitcher";
import { Tutorial } from "@/components/Tutorial";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const sessionMode = useAppStore((s) => s.sessionMode);
  const isModuleUnlocked = useAppStore((s) => s.isModuleUnlocked);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const t = useT();
  const moduleProgress = useProgressStore((s) => s.moduleProgress);
  const overallPercent = useProgressStore((s) => s.getOverallPercent)();
  const testResults = useProgressStore((s) => s.testResults);

  // Show onboarding for newly signed-in users
  useEffect(() => {
    if (sessionMode === "authenticated" && user) {
      const done = typeof window !== "undefined" && localStorage.getItem("onboarding-done");
      if (!done) {
        setShowOnboarding(true);
      }
    }
  }, [sessionMode, user]);

  // While auth is loading, show nothing (prevents landing page flash for signed-in users)
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // ── Landing screen (no session and no signed-in user) ──
  if (sessionMode === "none" && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-light/40 to-bg">
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-14 text-center md:pt-20">
          {/* Logo */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <svg className="h-12 w-12 text-white" viewBox="0 0 48 48" fill="none">
              {/* Road */}
              <path d="M8 40L18 8h12l10 32H8z" fill="currentColor" fillOpacity="0.25" />
              {/* Center dashes */}
              <rect x="22" y="12" width="4" height="6" rx="1" fill="currentColor" />
              <rect x="22" y="22" width="4" height="6" rx="1" fill="currentColor" />
              <rect x="22" y="32" width="4" height="6" rx="1" fill="currentColor" />
              {/* Car silhouette */}
              <rect x="16" y="6" width="16" height="3" rx="1.5" fill="currentColor" />
              <path d="M19 3h10l2 3H17l2-3z" fill="currentColor" />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-text-dark md:text-4xl">
            CA DMV <span className="text-primary">Study</span>
          </h1>
          <p className="mt-2 text-base text-text-gray">
            加州驾考双语学习平台
          </p>

          {/* Language switcher — below subtitle */}
          <div className="mt-3">
            <UILanguageSwitcher />
          </div>

          <p className="mt-4 max-w-sm text-sm text-text-light">
            {t("landing.subtitle")}
          </p>

          {/* Entry mode selector — segmented control style */}
          <div className="mt-8 w-full max-w-sm">
            <div className="rounded-2xl border border-border bg-white p-1.5 shadow-sm">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setShowAgeModal(true)}
                  className="group relative flex flex-col items-center gap-1 rounded-xl px-4 py-4 transition-all hover:bg-primary-light"
                >
                  <span className="text-2xl">👋</span>
                  <span className="text-sm font-semibold text-text-dark group-hover:text-primary">{t("landing.guestBtn")}</span>
                  <span className="text-xs text-text-gray leading-tight">{t("landing.guestDesc")}</span>
                </button>

                <button
                  onClick={signInWithGoogle}
                  className="group relative flex flex-col items-center gap-1 rounded-xl bg-primary px-4 py-4 text-white transition-all hover:bg-primary/90"
                >
                  <span className="text-2xl">🔓</span>
                  <span className="text-sm font-semibold">{t("landing.signInBtn")}</span>
                  <span className="text-xs text-white/75 leading-tight">{t("landing.signInDesc")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid w-full grid-cols-4 gap-2 text-center">
            {[
              { value: "460+", key: "landing.questions" as const },
              { value: "12", key: "landing.modules" as const },
              { value: "10", key: "landing.mockExams" as const },
              { value: "95%", key: "landing.passRate" as const },
            ].map((s) => (
              <div key={s.key} className="rounded-lg bg-white/70 p-2.5">
                <p className="text-lg font-bold text-primary">{s.value}</p>
                <p className="text-xs text-text-gray">{t(s.key)}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-text-gray">{t("landing.basedOn")}</p>
        </div>

        <div className="mt-10 pb-8">
          <p className="mb-4 text-center text-sm font-medium text-text-gray">
            {t("landing.trusted")}
          </p>
          <TestimonialCarousel />
        </div>

        <footer className="border-t border-border/50 py-4 text-center text-xs text-text-gray">
          {t("landing.disclaimer")}
        </footer>

        {showAgeModal && <AgeSelectionModal onClose={() => setShowAgeModal(false)} />}
      </div>
    );
  }

  // ── Dashboard (guest or authenticated) ──
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
      {sessionMode === "guest" && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-warning-light px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-warning">
            <span>👋</span>
            <span>{t("home.guestBanner")}</span>
          </div>
          <button
            onClick={signInWithGoogle}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
          >
            {t("home.signInUnlock")}
          </button>
        </div>
      )}

      {user && sessionMode === "authenticated" && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-primary">{overallPercent}%</p>
            <p className="mt-0.5 text-xs text-text-gray">{t("home.progress")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-text-dark">
              {Object.keys(moduleProgress).length > 0
                ? Object.keys(moduleProgress).sort().pop()
                : "--"}
            </p>
            <p className="mt-0.5 text-xs text-text-gray">{t("home.lastModule")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-text-dark">
              {testResults.length > 0
                ? `${testResults[testResults.length - 1].score}/${testResults[testResults.length - 1].totalQuestions}`
                : "--"}
            </p>
            <p className="mt-0.5 text-xs text-text-gray">{t("home.testScore")}</p>
          </div>
        </div>
      )}

      {/* Learning Modules — 3-column grid */}
      <h2 className="mb-4 text-xl font-bold text-text-dark">
        {t("home.learningModules")}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => {
          const unlocked = isModuleUnlocked(mod.id);
          const mp = moduleProgress[mod.id];
          const completedCount = mp?.completedSections?.length ?? 0;
          // Estimate total sections (we'll use 5 as average if unknown)
          const pct = mp ? Math.min(100, Math.round((completedCount / 5) * 100)) : 0;
          const cardContent = (
            <div className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-lg">
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-dark group-hover:text-primary truncate">
                    {mod.titleEn}
                  </h3>
                  <p className="text-xs text-text-gray">{mod.titleZh}</p>
                </div>
                {sessionMode === "authenticated" && <FreeBadge />}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-text-gray">{pct}%</span>
              </div>
            </div>
          );

          if (unlocked) {
            return <Link key={mod.id} href={`/study/${mod.id}`}>{cardContent}</Link>;
          }
          return <LockedCard key={mod.id}>{cardContent}</LockedCard>;
        })}
      </div>

      {/* Mistake Review */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-text-dark">
          {t("home.mistakeReview")}
        </h2>
        {sessionMode === "authenticated" ? (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-light text-xl">✏️</div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark">{t("home.reviewWrong")}</h3>
                <p className="text-sm text-text-gray">{t("home.reviewDesc")}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-text-gray">{t("home.comingSoon")}</span>
            </div>
          </div>
        ) : (
          <LockedCard>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-light text-xl">✏️</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-dark">{t("home.reviewWrong")}</h3>
                  <p className="text-sm text-text-gray">{t("home.reviewDescGuest")}</p>
                </div>
              </div>
            </div>
          </LockedCard>
        )}
      </div>

      <footer className="mt-10 border-t border-border py-6 text-center text-xs text-text-gray">
        {t("landing.disclaimer")}
      </footer>

      {/* Onboarding modal for first-time signed-in users */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}

      {/* Tutorial walkthrough — shows after onboarding, only once */}
      {!showOnboarding && <Tutorial />}
    </div>
  );
}
