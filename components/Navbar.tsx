"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { saveLanguagePreference } from "@/lib/firestore";
import { LANGUAGE_MODE_LABELS } from "@/lib/language";
import { useT } from "@/lib/useT";
import { UILanguageSwitcher } from "@/components/UILanguageSwitcher";
import { useState } from "react";
import type { LanguageMode } from "@/store/useAppStore";
import type { UIStringKey } from "@/lib/ui-strings";

const navItems: { href: string; labelKey: UIStringKey; iconHref: string }[] = [
  { href: "/", labelKey: "nav.home", iconHref: "/" },
  { href: "/study", labelKey: "nav.study", iconHref: "/study" },
  { href: "/mock-test", labelKey: "nav.mockTest", iconHref: "/mock-test" },
  { href: "/guide", labelKey: "nav.guide", iconHref: "/guide" },
  { href: "/progress", labelKey: "nav.progress", iconHref: "/progress" },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const sessionMode = useAppStore((s) => s.sessionMode);
  const languageMode = useAppStore((s) => s.languageMode);
  const setLanguageMode = useAppStore((s) => s.setLanguageMode);
  const exitSession = useAppStore((s) => s.exitSession);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useT();

  // Only hide navbar on landing page ("/") when no session
  if (sessionMode === "none" && !loading && pathname === "/") return null;

  const handleLanguageChange = async (mode: LanguageMode) => {
    setLanguageMode(mode);
    setLangOpen(false);
    if (user) {
      try {
        await saveLanguagePreference(user.uid, {
          languageMode: mode,
          examLanguage: useAppStore.getState().examLanguage,
        });
      } catch { /* ignore */ }
    }
  };

  const handleSignOut = () => {
    signOut();
    exitSession();
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">CA</div>
            <span className="hidden font-semibold text-text-dark sm:block">DMV Study</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-primary-light text-primary" : "text-text-gray hover:bg-gray-100 hover:text-text-dark"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* UI Language switcher */}
            <UILanguageSwitcher className="hidden sm:flex" />

            {/* Study language selector — for both guest and authenticated */}
            {(sessionMode === "authenticated" || sessionMode === "guest") && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => { setLangOpen(!langOpen); setMenuOpen(false); }}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-text-gray hover:bg-gray-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {LANGUAGE_MODE_LABELS[languageMode].en}
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-9 w-52 rounded-lg border border-border bg-card py-1 shadow-lg">
                    {(Object.keys(LANGUAGE_MODE_LABELS) as LanguageMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleLanguageChange(mode)}
                        className={`w-full px-3 py-2 text-left text-sm ${
                          mode === languageMode ? "bg-primary-light font-medium text-primary" : "text-text-gray hover:bg-gray-50"
                        }`}
                      >
                        {LANGUAGE_MODE_LABELS[mode].en}
                        <span className="ml-2 text-xs text-text-gray">{LANGUAGE_MODE_LABELS[mode].zh}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Auth / Guest */}
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            ) : user ? (
              <div className="relative">
                <button onClick={() => { setMenuOpen(!menuOpen); setLangOpen(false); }} className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {user.displayName?.[0] || "U"}
                    </div>
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 w-56 rounded-lg border border-border bg-card py-1 shadow-lg">
                    <p className="px-3 py-2 text-sm font-medium text-text-dark">{user.displayName}</p>

                    {/* Mobile: UI language */}
                    <div className="border-t border-border px-3 py-2 sm:hidden">
                      <p className="mb-1 text-xs font-medium text-text-gray">UI</p>
                      <UILanguageSwitcher />
                    </div>

                    {/* Mobile: Study language */}
                    <div className="border-t border-border px-3 py-2 md:hidden">
                      <p className="mb-1 text-xs font-medium text-text-gray">{t("nav.language")}</p>
                      {(Object.keys(LANGUAGE_MODE_LABELS) as LanguageMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleLanguageChange(mode)}
                          className={`w-full rounded px-2 py-1 text-left text-xs ${
                            mode === languageMode ? "bg-primary-light text-primary" : "text-text-gray"
                          }`}
                        >
                          {LANGUAGE_MODE_LABELS[mode].en}
                        </button>
                      ))}
                    </div>

                    <hr className="border-border" />
                    <button onClick={handleSignOut} className="w-full px-3 py-2 text-left text-sm text-text-gray hover:bg-gray-50">
                      {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : sessionMode === "guest" ? (
              <div className="flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-dark">
                  👋 {t("nav.guest")}
                </span>
                <button onClick={signInWithGoogle} className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary-light transition-colors">
                  🔓 {t("nav.signIn")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
                <span className="rounded-md px-2.5 py-1 text-xs font-medium text-text-gray">
                  👋 {t("nav.guest")}
                </span>
                <button onClick={signInWithGoogle} className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-white hover:bg-primary/90 transition-colors">
                  🔓 {t("nav.signIn")}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      {(sessionMode !== "none" || pathname !== "/") && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${active ? "text-primary" : "text-text-gray"}`}
                >
                  <NavIcon href={item.href} />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function NavIcon({ href }: { href: string }) {
  const cls = "h-5 w-5";
  switch (href) {
    case "/":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
    case "/study":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
    case "/mock-test":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>);
    case "/guide":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>);
    case "/progress":
      return (<svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
    default:
      return null;
  }
}
