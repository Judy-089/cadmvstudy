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
import { Footer } from "@/components/Footer";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { UILanguageSwitcher } from "@/components/UILanguageSwitcher";
import { Tutorial } from "@/components/Tutorial";
import { CrashCourseBanner } from "@/components/CrashCourseBanner";
import { useUILanguageStore } from "@/store/useUILanguageStore";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const sessionMode = useAppStore((s) => s.sessionMode);
  const languageMode = useAppStore((s) => s.languageMode);
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
  const isEn = uiLang === "en";

  if (sessionMode === "none" && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/50 via-bg to-bg pb-16 pt-10 md:pt-20">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

          {/* Language switcher — top right */}
          <div className="absolute right-4 top-4 z-10 md:right-8 md:top-6">
            <UILanguageSwitcher />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            {/* Logo */}
            <img
              src="/visuals/ACEDRIVEGO/aceDriveGo_combined_c_transparent.png"
              alt="AceDriveGo"
              className="mx-auto h-28 w-28 object-contain md:h-36 md:w-36"
            />

            {/* H1 — bold, high-contrast */}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text-dark sm:text-4xl md:text-5xl">
              {t("landing.heroTitle")}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t("landing.heroHighlight")}
              </span>
            </h1>

            {/* Subtitle — visible, good contrast */}
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-dark/70 md:text-lg">
              {t("landing.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {/* Primary CTA — Get Started */}
              <button
                onClick={signInWithGoogle}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 sm:w-auto"
              >
                {t("landing.getStarted")}
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Secondary CTA — Try without account */}
              <button
                onClick={() => setShowAgeModal(true)}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white px-8 py-4 text-base font-semibold text-text-dark shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 sm:w-auto"
              >
                {t("landing.tryFree")}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-text-gray group-hover:bg-primary-light group-hover:text-primary transition-colors">
                  {t("landing.tryFreeDesc")}
                </span>
              </button>
            </div>

            {/* Already have account — small text link */}
            <p className="mt-3 text-sm text-text-gray">
              {t("landing.alreadyHaveAccount")}{" "}
              <button onClick={signInWithGoogle} className="font-medium text-primary hover:underline">
                {t("landing.signInBtn")}
              </button>
            </p>
          </div>
        </section>

        {/* ═══ STATS BAR — dynamic by language ═══ */}
        <section className="border-y border-border bg-white">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-0 divide-x divide-border">
            {(isEn ? [
              { value: "870+", label: t("landing.questions"), icon: "📝" },
              { value: "12", label: t("landing.modules"), icon: "📖" },
              { value: "6 hrs", label: t("landing.avgStudyTime"), icon: "⏱️" },
              { value: "11", label: t("landing.mockExams"), icon: "📋" },
            ] : [
              { value: "870+", label: t("landing.questions"), icon: "📝" },
              { value: "12", label: t("landing.modules"), icon: "📖" },
              { value: "11", label: t("landing.mockExams"), icon: "📋" },
              { value: "95%", label: t("landing.passRateNote"), icon: "🎯" },
            ]).map((s, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1 px-4 py-5 min-w-[140px]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-2xl font-extrabold text-text-dark md:text-3xl">{s.value}</span>
                </div>
                <span className="text-xs font-medium text-text-gray">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="pb-1 text-center text-xs text-text-gray/60">{t("landing.basedOn")}</p>
          <p className="pb-3 text-center text-xs text-text-gray/40">{t("landing.statsDisclaimer")}</p>
        </section>

        {/* ═══ WHY ACEDRIVEGO — Feature Cards (3-branch: en / zhHant / zhHans) ═══ */}
        <section className="bg-bg py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-text-dark md:text-3xl">
              {t("landing.whyTitle")}
            </h2>

            {uiLang === "en" ? (
              /* ══════ EN: Crash Course hero + 3 small cards ══════ */
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Hero card: 2-Hour Crash Course */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-100/50 blur-2xl" />
                  <div className="relative flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                      <span>⚡</span> Most Popular
                    </div>
                    <h3 className="text-xl font-bold text-text-dark md:text-2xl">
                      {t("landing.featureCrashCourse")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark/70 md:text-base">
                      {t("landing.featureCrashCourseDesc")}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-text-gray">
                      <span>⏰</span> {t("landing.studyModulesRecommend")}
                    </p>
                    <p className="mt-1 text-[10px] text-text-gray/60">{t("landing.crashCourseDisclaimer")}</p>
                  </div>
                  {/* Visual — 4 phases progress */}
                  <div className="mt-6 w-full flex-shrink-0 md:mt-0 md:w-64">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      <p className="text-xs font-medium text-amber-700">4 Focused Phases</p>
                      <div className="mt-3 space-y-2.5">
                        {["Learn Key Rules", "Targeted Practice", "Weak Point Review", "Full Mock Exam"].map((phase, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{i + 1}</div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-text-dark">{phase}</p>
                              <div className="mt-0.5 h-1 rounded-full bg-gray-100">
                                <div className="h-1 rounded-full bg-amber-400" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small card 1: Questions */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">📝</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureQuestions")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureQuestionsDesc")}</p>
                </div>

                {/* Small card 2: Modules */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">📖</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureModules")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureModulesDesc")}</p>
                </div>

                {/* Small card 3: Free */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">✨</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureFreeEn")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureFreeEnDesc")}</p>
                </div>
              </div>

            ) : uiLang === "zhHant" ? (
              /* ══════ 繁體: Crash Course hero + Mock Exam hero + 3 small cards ══════ */
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Hero card 1: Crash Course */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-100/50 blur-2xl" />
                  <div className="relative flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                      <span>⚡</span> {t("landing.mostPopular")}
                    </div>
                    <h3 className="text-xl font-bold text-text-dark md:text-2xl">
                      {t("landing.featureCrashCourseZh")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark/70 md:text-base">
                      {t("landing.featureCrashCourseZhDesc")}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-text-gray">
                      <span>⏰</span> {t("landing.studyModulesRecommend")}
                    </p>
                    <p className="mt-1 text-[10px] text-text-gray/60">{t("landing.crashCourseDisclaimer")}</p>
                  </div>
                  {/* Visual — 4 phases progress */}
                  <div className="mt-6 w-full flex-shrink-0 md:mt-0 md:w-64">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      <p className="text-xs font-medium text-amber-700">4 個衝刺階段</p>
                      <div className="mt-3 space-y-2.5">
                        {["數字速記訓練", "六大核心專題", "易混淆對比訓練", "考前衝刺模擬"].map((phase, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{i + 1}</div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-text-dark">{phase}</p>
                              <div className="mt-0.5 h-1 rounded-full bg-gray-100">
                                <div className="h-1 rounded-full bg-amber-400" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero card 2: Mock Exams */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary-light/40 to-white p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                  <div className="relative flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                      <span>📋</span> {t("landing.mustPractice")}
                    </div>
                    <h3 className="text-xl font-bold text-text-dark md:text-2xl">
                      {t("landing.featureMockHero")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark/70 md:text-base">
                      {t("landing.featureMockHeroDesc")}
                    </p>
                  </div>
                  {/* Visual — exam preview */}
                  <div className="mt-6 w-full flex-shrink-0 md:mt-0 md:w-56">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      <p className="text-xs font-medium text-primary">模擬考試預覽</p>
                      <div className="mt-3 grid grid-cols-5 gap-1.5">
                        {[1,2,3,4,5,6,7,8,9,10,11].map((n) => (
                          <div key={n} className={`flex h-8 items-center justify-center rounded-lg text-[10px] font-bold ${n <= 3 ? "bg-success/10 text-success" : n <= 5 ? "bg-error/10 text-error" : "bg-gray-50 text-text-gray"}`}>
                            #{n}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-success font-medium">✓ 3 PASS</span>
                        <span className="text-text-gray">36題 · 83%及格</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small card 1: Structured */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">📖</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureStructured")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureStructuredDesc")}</p>
                </div>

                {/* Small card 2: Free */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">✨</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureFreeZh")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureFreeZhDesc")}</p>
                </div>

                {/* Small card 3: 870+ Questions */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">📝</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">870+ 練習題庫</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">涵蓋所有考試主題，每道題附帶詳細解析，讓你真正理解規則而不僅僅是背答案。</p>
                </div>
              </div>

            ) : (
              /* ══════ 简体: Bilingual hero + Crash Course hero + 3 small cards ══════ */
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Hero card 1: 英中双语对照 */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary-light/40 to-white p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                  <div className="relative flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                      <span>🌐</span> 核心功能
                    </div>
                    <h3 className="text-xl font-bold text-text-dark md:text-2xl">
                      {t("landing.featureBilingual")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark/70 md:text-base">
                      {t("landing.featureBilingualDesc")}
                    </p>
                  </div>
                  {/* Visual — English + 简体 learning preview */}
                  <div className="mt-6 w-full flex-shrink-0 md:mt-0 md:w-80">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-primary">English + 简体 学习预览</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">全部显示 ▼</span>
                      </div>
                      {/* Knowledge point 1 — expanded */}
                      <div className="mt-3">
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 inline-block rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold text-amber-700 leading-none">高频</span>
                          <p className="text-xs leading-relaxed text-text-dark">At an uncontrolled intersection, yield to the vehicle that arrived first. If two vehicles arrive at the same time, yield to the vehicle on your right.</p>
                        </div>
                        <div className="ml-4 mt-1.5 border-l-2 border-primary/30 pl-2.5">
                          <p className="text-xs leading-relaxed text-text-gray">在无交通标志或信号灯的路口，让先到达的车辆先行。如果两辆车同时到达，让右侧车辆先行。</p>
                        </div>
                      </div>
                      {/* Knowledge point 2 — collapsed */}
                      <div className="mt-3 border-t border-border/50 pt-3">
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 inline-block rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold text-amber-700 leading-none">高频</span>
                          <p className="text-xs leading-relaxed text-text-dark">It is illegal to wear earplugs or a headset covering both ears while driving.</p>
                        </div>
                        <button className="ml-4 mt-1 text-[10px] font-medium text-primary/70">查看中文 ▼</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero card 2: 繁简对照 */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm transition-all hover:border-violet-300 hover:shadow-md md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-100/50 blur-2xl" />
                  <div className="relative flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700 uppercase tracking-wider">
                      <span>📝</span> 考试必备
                    </div>
                    <h3 className="text-xl font-bold text-text-dark md:text-2xl">
                      {t("landing.featureHantHans")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark/70 md:text-base">
                      {t("landing.featureHantHansDesc")}
                    </p>
                  </div>
                  {/* Visual — 繁體+简体 learning preview */}
                  <div className="mt-6 w-full flex-shrink-0 md:mt-0 md:w-80">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      <p className="text-xs font-medium text-violet-700">繁體 + 简体 学习预览</p>
                      <div className="mt-3">
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 inline-block rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold text-amber-700 leading-none">高频</span>
                          <p className="text-xs leading-relaxed text-text-dark">在不受管制的十字路口（無交通標誌或訊號燈），讓先到達的車輛先行。如果兩輛車同時到達，讓右側車輛先行。</p>
                        </div>
                        <div className="ml-4 mt-1.5 border-l-2 border-violet-300 pl-2.5">
                          <p className="text-xs leading-relaxed text-text-gray">在无交通标志或信号灯的路口，让先到达的车辆先行。如果两辆车同时到达，让右侧车辆先行。</p>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-border/50 pt-3">
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 inline-block rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold text-amber-700 leading-none">高频</span>
                          <p className="text-xs leading-relaxed text-text-dark">駕車或騎腳踏車時，佩戴覆蓋雙耳的耳塞或耳機是違法的。</p>
                        </div>
                        <div className="ml-4 mt-1.5 border-l-2 border-violet-300 pl-2.5">
                          <p className="text-xs leading-relaxed text-text-gray">驾车或骑自行车时，佩戴覆盖双耳的耳塞或耳机是违法的。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero card 2: Crash Course */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-100/50 blur-2xl" />
                  <div className="relative flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                      <span>⚡</span> {t("landing.mostPopular")}
                    </div>
                    <h3 className="text-xl font-bold text-text-dark md:text-2xl">
                      {t("landing.featureCrashCourseZh")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-dark/70 md:text-base">
                      {t("landing.featureCrashCourseZhDesc")}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-text-gray">
                      <span>⏰</span> {t("landing.studyModulesRecommend")}
                    </p>
                    <p className="mt-1 text-[10px] text-text-gray/60">{t("landing.crashCourseDisclaimer")}</p>
                  </div>
                  {/* Visual — 4 phases progress */}
                  <div className="mt-6 w-full flex-shrink-0 md:mt-0 md:w-64">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      <p className="text-xs font-medium text-amber-700">4 个冲刺阶段</p>
                      <div className="mt-3 space-y-2.5">
                        {["数字速记训练", "六大核心专题", "易混淆对比训练", "考前冲刺模拟"].map((phase, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{i + 1}</div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-text-dark">{phase}</p>
                              <div className="mt-0.5 h-1 rounded-full bg-gray-100">
                                <div className="h-1 rounded-full bg-amber-400" style={{ width: `${100 - i * 15}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small card 1: Structured */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">📖</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureStructured")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureStructuredDesc")}</p>
                </div>

                {/* Small card 2: Mock exams */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">📋</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureMock")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureMockDesc")}</p>
                </div>

                {/* Small card 3: Free */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">✨</div>
                  <h3 className="mt-4 text-lg font-bold text-text-dark">{t("landing.featureFreeZh")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-dark/70">{t("landing.featureFreeZhDesc")}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══ TESTIMONIALS — filtered by language ═══ */}
        <section className="border-t border-border bg-white py-12">
          <div className="mx-auto max-w-4xl px-4">
            <p className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-text-gray">
              {t("landing.trusted")}
            </p>
            <TestimonialCarousel filterLang={isEn ? "en" : "zh"} />
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section className="bg-gradient-to-r from-primary to-primary/80 py-16">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {t("landing.ctaBottom")}
            </h2>
            <p className="mt-3 text-base text-white/80">
              {t("landing.ctaBottomDesc")}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={signInWithGoogle}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 sm:w-auto"
              >
                {t("landing.getStarted")}
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => setShowAgeModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 sm:w-auto"
              >
                {t("landing.tryFree")}
              </button>
            </div>
            {/* Expansion hook */}
            <p className="mt-6 text-sm text-white/50">
              {t("landing.expansionHook")}{" "}
              <a
                href="https://forms.gle/RMg2FwF7zuNeEa1d6"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/70 underline decoration-white/30 hover:text-white hover:decoration-white/60 transition-colors"
              >
                {t("landing.expansionLink")} →
              </a>
            </p>
          </div>
        </section>

        <Footer />

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

      {/* Crash Course Banner */}
      <div className="mb-6">
        <CrashCourseBanner />
      </div>

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
                    {languageMode === "zhHant_zhHans" ? mod.titleZhHant : mod.titleEn}
                  </h3>
                  {languageMode !== "en_only" && <p className="text-xs text-text-gray">{mod.titleZh}</p>}
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

      <Footer />

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
