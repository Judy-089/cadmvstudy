"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Shows a browser confirmation dialog when a guest user tries to refresh or leave.
 * Only active when sessionMode === "guest".
 */
export function useGuestRefreshGuard() {
  const sessionMode = useAppStore((s) => s.sessionMode);

  useEffect(() => {
    if (sessionMode !== "guest") return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers show a generic message, but we set returnValue for compatibility
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [sessionMode]);
}
