"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Redirects to "/" if no session and no Firebase user.
 * Waits for auth loading to finish before deciding.
 * Returns true if the page should render nothing (loading or redirecting).
 */
export function useRequireSession(): boolean {
  const sessionMode = useAppStore((s) => s.sessionMode);
  const loading = useAuthStore((s) => s.loading);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) return; // signed-in user — auth mode will be set by AuthProvider
    if (sessionMode !== "none") return; // guest mode active
    router.replace("/");
  }, [loading, sessionMode, user, router]);

  // Still loading auth
  if (loading) return true;
  // User exists but session not yet set (AuthProvider still running)
  if (user && sessionMode === "none") return true;
  // No user, no session → redirecting
  if (!user && sessionMode === "none") return true;

  return false;
}
