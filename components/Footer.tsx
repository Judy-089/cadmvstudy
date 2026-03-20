"use client";

import { useT } from "@/lib/useT";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-10 border-t border-border py-6 text-center text-xs text-text-gray space-y-2">
      <p className="font-medium">{t("footer.copyright")}</p>
      <p className="max-w-lg mx-auto leading-relaxed">{t("footer.ip")}</p>
      <p>{t("footer.disclaimer")}</p>
    </footer>
  );
}
