"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";

export function GuestToast() {
  const sessionMode = useAppStore((s) => s.sessionMode);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const t = useT();

  useEffect(() => {
    if (sessionMode === "guest" && !dismissed) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [sessionMode, dismissed]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 animate-[slideDown_0.3s_ease-out]">
      <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning-light px-4 py-3 shadow-lg">
        <span className="text-lg">⚠️</span>
        <div className="text-sm">
          <p className="font-medium text-warning">
            {t("nav.guest")}
          </p>
          <p className="text-xs text-text-gray">
            {sessionMode === "guest" ? (
              <>Refreshing will reset your session</>
            ) : null}
          </p>
        </div>
        <button
          onClick={() => { setVisible(false); setDismissed(true); }}
          className="ml-2 text-text-gray hover:text-text-dark"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
