"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { signInWithGoogle } from "@/lib/auth";
import { useT } from "@/lib/useT";

export function CrashCourseBanner() {
  const sessionMode = useAppStore((s) => s.sessionMode);
  const t = useT();

  // Hide when no session at all (landing page)
  if (sessionMode === "none") return null;

  const isLocked = sessionMode === "guest";

  const banner = (
    <div className="flex items-center gap-3">
      <span className="text-2xl" role="img" aria-label="fire">
        🔥
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-white sm:text-base">
          {t("cc.bannerTitle")}
        </h3>
        <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
          {t("cc.bannerSubtitle")}
        </p>
      </div>
      {isLocked ? (
        <span className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t("lock.signInToUnlock")}
        </span>
      ) : (
        <span className="flex-shrink-0 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-white/30 sm:text-sm">
          {t("cc.bannerStart")}
        </span>
      )}
    </div>
  );

  if (isLocked) {
    return (
      <button
        onClick={signInWithGoogle}
        className="group block w-full rounded-xl bg-gradient-to-r from-amber-500/60 to-orange-500/60 p-4 shadow-md transition-all hover:from-amber-500/80 hover:to-orange-500/80 hover:shadow-lg text-left"
      >
        {banner}
      </button>
    );
  }

  return (
    <Link
      href="/crash-course"
      className="group block rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 shadow-md transition-all hover:shadow-lg hover:brightness-105"
    >
      {banner}
    </Link>
  );
}
