"use client";

import { signInWithGoogle } from "@/lib/auth";
import { useT } from "@/lib/useT";

interface LockedCardProps {
  children: React.ReactNode;
}

export function LockedCard({ children }: LockedCardProps) {
  const t = useT();
  return (
    <div className="group relative cursor-pointer" onClick={signInWithGoogle}>
      {/* Content with soft fade */}
      <div className="pointer-events-none opacity-50">{children}</div>
      {/* Gradient overlay from bottom */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white via-white/80 to-transparent" />
      {/* Lock prompt at bottom */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-b-xl pb-4 pt-8">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 shadow-sm transition-all group-hover:border-primary/40 group-hover:shadow-md">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs font-medium text-primary">{t("lock.signInToUnlock")}</span>
          <svg className="h-3 w-3 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function LockedPage({ title, titleZh }: { title: string; titleZh?: string }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h1 className="mt-6 text-xl font-bold text-text-dark">{title}</h1>
      {titleZh && <p className="mt-1 text-sm text-text-gray">{titleZh}</p>}
      <p className="mt-4 text-text-gray">{t("lock.signInDesc")}</p>
      <button
        onClick={signInWithGoogle}
        className="mt-6 rounded-xl bg-primary px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg"
      >
        {t("progress.signInGoogle")}
      </button>
      <p className="mt-3 text-xs text-text-gray">{t("lock.freeDuring")}</p>
    </div>
  );
}

export function FreeBadge() {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {t("lock.limitedFree")}
    </span>
  );
}
