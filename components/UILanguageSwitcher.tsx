"use client";

import { useUILanguageStore, type UILanguage } from "@/store/useUILanguageStore";

const options: { value: UILanguage; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "zhHant", label: "繁" },
  { value: "zhHans", label: "简" },
];

export function UILanguageSwitcher({ className }: { className?: string }) {
  const uiLang = useUILanguageStore((s) => s.uiLang);
  const setUILang = useUILanguageStore((s) => s.setUILang);

  return (
    <div className={`flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 ${className ?? ""}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setUILang(opt.value)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            uiLang === opt.value
              ? "bg-primary text-white"
              : "text-text-gray hover:text-text-dark"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
