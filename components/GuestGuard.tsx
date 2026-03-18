"use client";

import { useEffect } from "react";
import { useGuestRefreshGuard } from "@/lib/useGuestRefreshGuard";
import { GuestToast } from "@/components/GuestToast";
import { useUILanguageStore } from "@/store/useUILanguageStore";

export function GuestGuard() {
  useGuestRefreshGuard();

  // Hydrate UI language from localStorage after mount (prevents hydration mismatch)
  const hydrate = useUILanguageStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <GuestToast />;
}
