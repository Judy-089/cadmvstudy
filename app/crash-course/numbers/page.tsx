"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import { useRequireSession } from "@/lib/useRequireSession";
import numbersData from "@/data/crashcourse/numbers.json";

interface NumberRow {
  number: string;
  rule_en: string;
  rule_zh: string;
  rule_zhHant: string;
}

interface NumberTab {
  id: string;
  icon: string;
  title_en: string;
  title_zh: string;
  title_zhHant: string;
  mnemonic_en?: string;
  mnemonic_zh?: string;
  mnemonic_zhHant?: string;
  rows: NumberRow[];
}

const tabs = numbersData.tabs as NumberTab[];

export default function NumbersPage() {
  const languageMode = useAppStore((s) => s.languageMode);
  const t = useT();
  const redirecting = useRequireSession();

  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  // Determine which text fields to show based on languageMode
  const getMainRule = (row: NumberRow) => {
    if (languageMode === "en_only") return row.rule_en;
    if (languageMode === "en_zhHans") return row.rule_en;
    // zhHant_zhHans
    return row.rule_zhHant;
  };

  const getSecondaryRule = (row: NumberRow) => {
    if (languageMode === "en_only") return null;
    if (languageMode === "en_zhHans") return row.rule_zh;
    // zhHant_zhHans
    return row.rule_zh;
  };

  const getTabTitle = (tab: NumberTab) => {
    if (languageMode === "en_only") return tab.title_en;
    if (languageMode === "en_zhHans") return tab.title_en;
    return tab.title_zhHant;
  };

  const getMnemonic = (tab: NumberTab) => {
    if (languageMode === "en_only") return tab.mnemonic_en;
    if (languageMode === "en_zhHans") return tab.mnemonic_en;
    return tab.mnemonic_zhHant;
  };

  const getMnemonicSecondary = (tab: NumberTab) => {
    if (languageMode === "en_only") return null;
    return tab.mnemonic_zh;
  };

  // Search filtering
  const query = search.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!query) return null;
    const results: { tabIdx: number; tab: NumberTab; rows: NumberRow[] }[] = [];
    tabs.forEach((tab, idx) => {
      const matched = tab.rows.filter((row) => {
        const fields = [
          row.number,
          row.rule_en,
          row.rule_zh,
          row.rule_zhHant,
        ];
        return fields.some((f) => f.toLowerCase().includes(query));
      });
      if (matched.length > 0) {
        results.push({ tabIdx: idx, tab, rows: matched });
      }
    });
    return results;
  }, [query]);

  if (redirecting) return null;

  const currentTab = tabs[activeTab];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/crash-course"
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {t("cc.back")}
      </Link>

      {/* Title */}
      <h1 className="mt-4 text-xl font-bold text-text-dark md:text-2xl">
        📊 {t("cc.numbersTitle")}
      </h1>

      {/* Search box */}
      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("cc.search")}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text-dark placeholder:text-text-gray/60 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Tab buttons — horizontal scroll */}
      {!searchResults && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === idx
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-text-gray hover:bg-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="whitespace-nowrap">{getTabTitle(tab)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search results */}
      {searchResults ? (
        <div className="mt-4 space-y-6">
          {searchResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-gray">
              No results found.
            </p>
          ) : (
            searchResults.map(({ tabIdx, tab, rows }) => (
              <div key={tab.id}>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-text-dark">
                  <span>{tab.icon}</span>
                  {getTabTitle(tab)}
                </h2>
                <div className="mt-2 space-y-2">
                  {rows.map((row, rIdx) => (
                    <NumberRowCard
                      key={`${tab.id}-${rIdx}`}
                      row={row}
                      mainRule={getMainRule(row)}
                      secondaryRule={getSecondaryRule(row)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Active tab content */
        <div className="mt-4">
          <div className="space-y-2">
            {currentTab.rows.map((row, idx) => (
              <NumberRowCard
                key={`${currentTab.id}-${idx}`}
                row={row}
                mainRule={getMainRule(row)}
                secondaryRule={getSecondaryRule(row)}
              />
            ))}
          </div>

          {/* Mnemonic box */}
          {getMnemonic(currentTab) && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary-light/30 p-4">
              <p className="text-xs font-semibold text-primary">
                💡 {t("cc.mnemonic")}
              </p>
              <p className="mt-1 text-base font-medium text-text-dark">
                {getMnemonic(currentTab)}
              </p>
              {getMnemonicSecondary(currentTab) && (
                <p className="mt-0.5 text-base text-text-gray">
                  {getMnemonicSecondary(currentTab)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NumberRowCard({
  row,
  mainRule,
  secondaryRule,
}: {
  row: NumberRow;
  mainRule: string;
  secondaryRule: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex h-12 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light">
        <span className="text-sm font-bold text-primary">{row.number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base text-text-dark leading-relaxed">{mainRule}</p>
        {secondaryRule && (
          <p className="mt-0.5 text-base text-text-gray leading-relaxed">
            {secondaryRule}
          </p>
        )}
      </div>
    </div>
  );
}
