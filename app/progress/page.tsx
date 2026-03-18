"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { signInWithGoogle } from "@/lib/auth";
import { modules } from "@/data/modules";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { useT } from "@/lib/useT";
import { useRequireSession } from "@/lib/useRequireSession";
import { useProgressStore } from "@/store/useProgressStore";
import { useState } from "react";

type Tab = "study" | "tests";

export default function ProgressPage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const sessionMode = useAppStore((s) => s.sessionMode);
  const [activeTab, setActiveTab] = useState<Tab>("study");
  const t = useT();
  const redirecting = useRequireSession();
  const moduleProgress = useProgressStore((s) => s.moduleProgress);
  const overallPercent = useProgressStore((s) => s.getOverallPercent)();
  const testResults = useProgressStore((s) => s.testResults);

  if (redirecting) return null;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-text-gray">Loading...</p>
      </div>
    );
  }

  // ── Unauthenticated / Guest view ──
  if (!user || sessionMode === "guest") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-dark md:text-3xl">{t("progress.unlockTitle")}</h1>
          <p className="mt-2 text-text-gray">{t("progress.unlockDesc")}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-light px-4 py-1.5 text-sm font-medium text-success">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("progress.limitedFree")}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "📖", titleEn: "Bilingual Learning", titleZh: "双语学习", desc: "English-first content with collapsible Chinese explanations." },
            { icon: "📝", titleEn: "Mock Exams", titleZh: "全真模拟", desc: "10 full mock exams with 460+ questions." },
            { icon: "📊", titleEn: "Smart Progress", titleZh: "智能进度", desc: "Track learning progress and review mistakes." },
          ].map((f) => (
            <div key={f.titleEn} className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-2 text-base font-semibold text-text-dark">{f.titleEn}</h3>
              <p className="text-xs text-text-gray">{f.titleZh}</p>
              <p className="mt-2 text-xs text-text-light">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-center text-sm font-semibold text-text-dark">{t("progress.signInUnlock")}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["12 learning modules", "10 mock exams (460+ Q)", "繁體中文 / English", "Progress tracking", "Mistake review", "Official DMV images"].map((text) => (
              <div key={text} className="flex items-center gap-2 text-sm text-text-dark">
                <span>✅</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={signInWithGoogle} className="rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
            {t("progress.signInGoogle")}
          </button>
          <p className="mt-2 text-xs text-text-gray">{t("progress.freeLaunch")}</p>
        </div>

        <div className="mt-12">
          <p className="mb-4 text-center text-sm font-medium text-text-gray">{t("progress.whatUsersSay")}</p>
          <TestimonialCarousel />
        </div>
      </div>
    );
  }

  // ── Authenticated progress view ──
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">{t("progress.title")}</h1>

      <div className="mt-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        {(["study", "tests"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-card text-primary shadow-sm" : "text-text-gray hover:text-text-dark"
            }`}
          >
            {tab === "study" ? t("progress.studyTab") : t("progress.testsTab")}
          </button>
        ))}
      </div>

      {activeTab === "study" && (
        <div className="mt-6">
          <div className="mb-6 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary-light">
              <span className="text-2xl font-bold text-primary">{overallPercent}%</span>
            </div>
            <p className="mt-2 text-sm text-text-gray">{t("progress.overall")}</p>
          </div>
          <div className="space-y-3">
            {modules.map((mod) => {
              const mp = moduleProgress[mod.id];
              const completedCount = mp?.completedSections?.length ?? 0;
              const pct = mp ? Math.min(100, Math.round((completedCount / mod.sectionCount) * 100)) : 0;
              return (
                <div key={mod.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="text-xl">{mod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-dark truncate">{mod.titleEn}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-text-gray">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "tests" && (
        <div className="mt-6">
          {testResults.length > 0 ? (
            <div className="space-y-3">
              {testResults.map((tr, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-text-dark">{tr.examId}</p>
                    <p className="text-xs text-text-gray">
                      {tr.score}/{tr.totalQuestions} ({Math.round((tr.score / tr.totalQuestions) * 100)}%)
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    tr.passed ? "bg-success-light text-success" : "bg-error-light text-error"
                  }`}>
                    {tr.passed ? "PASS" : "FAIL"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-text-gray">{t("progress.noResults")}</p>
              <p className="mt-1 text-sm text-text-gray">{t("progress.completeExam")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
