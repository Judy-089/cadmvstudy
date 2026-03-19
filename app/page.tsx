"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { signInWithGoogle } from "@/lib/auth";
import { modules } from "@/data/modules";
import { useT } from "@/lib/useT";
import { getPassThreshold } from "@/lib/examUtils";
import { useProgressStore } from "@/store/useProgressStore";
import { useWrongQuestionStore } from "@/store/useWrongQuestionStore";
import { AgeSelectionModal } from "@/components/AgeSelectionModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { LockedCard, FreeBadge } from "@/components/LockedOverlay";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { UILanguageSwitcher } from "@/components/UILanguageSwitcher";
import { Tutorial } from "@/components/Tutorial";
import { useUILanguageStore } from "@/store/useUILanguageStore";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const sessionMode = useAppStore((s) => s.sessionMode);
  const isModuleUnlocked = useAppStore((s) => s.isModuleUnlocked);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const t = useT();
  const uiLang = useUILanguageStore((s) => s.uiLang);
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
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-light/40 via-bg to-bg">
        {/* Hero Section */}
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-10 text-center md:pt-16">
          {/* Logo — large combined mark */}
          <img
            src="/visuals/ACEDRIVEGO/aceDriveGo_combined_c_transparent.png"
            alt="AceDriveGo"
            className="h-44 w-44 object-contain md:h-52 md:w-52"
          />

          <p className="mt-1 text-base font-medium tracking-wide text-text-gray md:text-lg">
            Ace Your California DMV Test
          </p>
          <p className="mt-0.5 text-sm text-text-light">
            {uiLang === "zhHant" ? "加州駕照雙語學習平台" : uiLang === "zhHans" ? "加州驾考双语学习平台" : "Bilingual CA DMV Study Platform"}
          </p>

          {/* Language switcher */}
          <div className="mt-3">
            <UILanguageSwitcher />
          </div>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-light">
            {t("landing.subtitle")}
          </p>

          {/* Entry mode selector */}
          <div className="mt-7 w-full max-w-sm">
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
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-8 max-w-lg px-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { value: "800+", key: "landing.questions" as const },
              { value: "13", key: "landing.modules" as const },
              { value: "10", key: "landing.mockExams" as const },
              { value: "95%", key: "landing.passRate" as const },
            ].map((s) => (
              <div key={s.key} className="rounded-lg bg-white/70 p-2.5">
                <p className="text-lg font-bold text-primary">{s.value}</p>
                <p className="text-xs text-text-gray">{t(s.key)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-text-gray">{t("landing.basedOn")}</p>
        </div>

        {/* Testimonials — centered */}
        <div className="mx-auto mt-8 max-w-2xl px-4 pb-8">
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
  const ageGroup = useAppStore.getState().ageGroup;
  const questionCount = ageGroup === "under18" ? 46 : 36;

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
              {Object.keys(testResults).length > 0
                ? (() => { const vals = Object.values(testResults).filter(Boolean); const last = vals[vals.length - 1]; return last ? `${last.score}/${last.total}` : "--"; })()
                : "--"}
            </p>
            <p className="mt-0.5 text-xs text-text-gray">{t("home.testScore")}</p>
          </div>
        </div>
      )}

      {/* Guide prompt */}
      <Link
        href="/guide"
        className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-light/30 p-4 transition-all hover:bg-primary-light/50"
      >
        <span className="text-xl">🗺️</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">
            {t("home.guidePrompt")}
          </p>
        </div>
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Learning Modules — 3-column grid */}
      <h2 className="mb-4 text-xl font-bold text-text-dark">
        {t("home.learningModules")}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => {
          const unlocked = isModuleUnlocked(mod.id);
          const mp = moduleProgress[mod.id];
          const completedCount = mp?.completedSections?.length ?? 0;
          const pct = mp ? Math.min(100, Math.round((completedCount / mod.sectionCount) * 100)) : 0;
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

      {/* Mock Tests */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-text-dark">
          {t("mock.title")}
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {[1,2,3,4,5,6,7,8,9,10].map((num) => {
            const examId = `MOCK-${num.toString().padStart(2,"0")}`;
            const unlocked = useAppStore.getState().isExamUnlocked(examId);
            const result = useProgressStore.getState().testResults[examId];
            const hasTaken = !!result;
            const passed = result ? result.score >= getPassThreshold(result.total) : false;
            const isNew = num >= 6;

            const card = (
              <div className={`relative rounded-xl border bg-card p-3 text-center shadow-sm transition-all hover:shadow-md ${
                isNew && !hasTaken ? "border-primary/40" : "border-border"
              }`}>
                {isNew && !hasTaken && (
                  <div className="absolute -top-2 -right-2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white">NEW</div>
                )}
                {hasTaken && (
                  <div className={`absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white ${passed ? "bg-success" : "bg-error"}`}>
                    {passed ? "PASS" : "FAIL"}
                  </div>
                )}
                <p className="text-sm font-semibold text-text-dark">#{num}</p>
                {hasTaken ? (
                  <p className={`text-xs font-medium ${passed ? "text-success" : "text-error"}`}>{result.score}/{result.total}</p>
                ) : (
                  <p className="text-xs text-text-gray">{questionCount}Q</p>
                )}
              </div>
            );

            if (unlocked) return <Link key={examId} href={`/mock-test/${examId}`}>{card}</Link>;
            return <div key={examId} className="opacity-40 grayscale">{card}</div>;
          })}
        </div>
      </div>

      {/* Mistake Review */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-text-dark">
          {t("home.mistakeReview")}
        </h2>
        {sessionMode === "authenticated" ? (
          <MistakeReviewCard t={t} />
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

function MistakeReviewCard({ t }: { t: (key: any) => string }) {
  const unresolvedCount = useWrongQuestionStore((s) => s.unresolvedCount)();
  const totalCount = useWrongQuestionStore((s) => s.totalCount)();

  return (
    <Link href="/mistakes" className="block rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-light text-xl">✏️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-dark">{t("home.reviewWrong")}</h3>
          <p className="text-sm text-text-gray">
            {totalCount > 0
              ? `${unresolvedCount} to review / ${totalCount} total`
              : t("home.reviewDesc")}
          </p>
        </div>
        {unresolvedCount > 0 && (
          <span className="rounded-full bg-error px-3 py-1 text-xs font-bold text-white">{unresolvedCount}</span>
        )}
      </div>
    </Link>
  );
}
