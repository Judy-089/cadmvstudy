"use client";

import Link from "next/link";
import { modules } from "@/data/modules";
import { useAppStore } from "@/store/useAppStore";
import { LockedCard } from "@/components/LockedOverlay";
import { QuizScoreCircles } from "@/components/QuizScoreCircles";
import { signInWithGoogle } from "@/lib/auth";
import { useT } from "@/lib/useT";
import { useRequireSession } from "@/lib/useRequireSession";
import { useProgressStore } from "@/store/useProgressStore";

export default function StudyPage() {
  const sessionMode = useAppStore((s) => s.sessionMode);
  const isModuleUnlocked = useAppStore((s) => s.isModuleUnlocked);
  const t = useT();
  const redirecting = useRequireSession();
  const moduleProgress = useProgressStore((s) => s.moduleProgress);

  if (redirecting) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">
        {t("study.title")}
      </h1>
      <p className="mt-2 text-text-gray">{t("study.subtitle")}</p>

      {sessionMode === "guest" && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning-light px-4 py-2 text-sm text-warning">
          <span>👋 {t("study.guestBanner")}</span>
          <button onClick={signInWithGoogle} className="font-semibold underline hover:no-underline">
            {t("study.signInUnlockAll")}
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {modules.map((mod) => {
          const unlocked = isModuleUnlocked(mod.id);
          const mp = moduleProgress[mod.id];
          const completedCount = mp?.completedSections?.length ?? 0;
          const pct = mp ? Math.min(100, Math.round((completedCount / 5) * 100)) : 0;
          const cardContent = (
            <div className={`group relative flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md ${
              mod.isNew ? "border-primary/40 hover:border-primary" : "border-border hover:border-primary/30"
            }`}>
              {/* NEW badge — floating outside */}
              {mod.isNew && (
                <div className="absolute -top-2.5 -right-2.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                  NEW
                </div>
              )}

              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-xl ${
                mod.isNew ? "bg-primary/10" : "bg-primary-light"
              }`}>
                {mod.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-primary">{mod.id}</span>
                  <h3 className="font-semibold text-text-dark group-hover:text-primary truncate">{mod.titleEn}</h3>
                </div>
                <p className="text-sm text-text-gray">{mod.titleZh}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-text-gray whitespace-nowrap">{pct > 0 ? `${pct}%` : `~${mod.estimatedMinutes} min`}</span>
                  </div>
                  <QuizScoreCircles moduleId={mod.id} />
                </div>
              </div>
            </div>
          );
          if (unlocked) return <Link key={mod.id} href={`/study/${mod.id}`}>{cardContent}</Link>;
          return <LockedCard key={mod.id}>{cardContent}</LockedCard>;
        })}
      </div>
    </div>
  );
}
