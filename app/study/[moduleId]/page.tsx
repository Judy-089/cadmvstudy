"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { modules } from "@/data/modules";
import { tagImages, sectionImages, ImageMapping } from "@/data/imageMap";
import { useAppStore } from "@/store/useAppStore";
import { getStudyText } from "@/lib/language";
import { LockedPage } from "@/components/LockedOverlay";
import { useT } from "@/lib/useT";
import { useRequireSession } from "@/lib/useRequireSession";
import { SectionQuiz } from "@/components/SectionQuiz";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import Link from "next/link";

interface KnowledgePoint {
  id: string;
  en: string;
  zh: string;
  zhHant?: string;
  isHighFreq: boolean;
  isNew?: boolean;
  tags: string[];
}

interface Section {
  id: string;
  titleEn: string;
  titleZh: string;
  titleZhHant?: string;
  knowledgePoints: KnowledgePoint[];
}

interface ModuleContent {
  moduleId: string;
  titleEn: string;
  titleZh: string;
  titleZhHant?: string;
  sections: Section[];
}

function getImagesForPoint(point: KnowledgePoint): ImageMapping[] {
  const images: ImageMapping[] = [];
  const seen = new Set<string>();
  for (const tag of point.tags) {
    const matches = tagImages[tag];
    if (matches) {
      for (const img of matches) {
        if (!seen.has(img.src)) {
          seen.add(img.src);
          images.push(img);
        }
      }
    }
  }
  return images;
}

function ImageGallery({ images, hideZh }: { images: ImageMapping[]; hideZh?: boolean }) {
  if (images.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {images.map((img) => (
        <figure key={img.src} className="overflow-hidden rounded-lg border border-border bg-gray-50">
          <img src={img.src} alt={img.alt} className="max-h-40 w-auto object-contain p-2" loading="lazy" />
          {img.caption && (
            <figcaption className="border-t border-border bg-white px-3 py-1.5 text-center">
              <p className="text-xs font-medium text-text-dark">{img.caption}</p>
              {!hideZh && img.captionZh && <p className="text-xs text-text-gray">{img.captionZh}</p>}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function SectionHeaderImages({ sectionKey, hideZh }: { sectionKey: string; hideZh?: boolean }) {
  const images = sectionImages[sectionKey];
  if (!images || images.length === 0) return null;
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {images.map((img) => (
        <figure key={img.src} className="p-4">
          <img src={img.src} alt={img.alt} className="mx-auto max-h-64 w-auto object-contain" loading="lazy" />
          {img.caption && (
            <figcaption className="mt-2 text-center">
              <p className="text-sm font-medium text-text-dark">{img.caption}</p>
              {!hideZh && img.captionZh && <p className="text-xs text-text-gray">{img.captionZh}</p>}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export default function ModuleLearningPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const moduleMeta = modules.find((m) => m.id === moduleId);
  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  const nextModule = modules[moduleIndex + 1] ?? null;
  const isModuleUnlocked = useAppStore((s) => s.isModuleUnlocked);
  const languageMode = useAppStore((s) => s.languageMode);
  const sessionMode = useAppStore((s) => s.sessionMode);

  const t = useT();
  const redirecting = useRequireSession();
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showAllCollapsible, setShowAllCollapsible] = useState(false);
  const [expandedPoints, setExpandedPoints] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import(`@/data/content/${moduleId}.json`)
      .then((mod) => {
        setContent(mod.default || mod);
        if (mod.default?.sections?.[0] || mod.sections?.[0]) {
          setActiveSection((mod.default || mod).sections[0].id);
        }
      })
      .catch(() => setContent(null));
  }, [moduleId]);

  const scrollTabIntoView = useCallback((sectionId: string) => {
    if (!tabsRef.current) return;
    const tab = tabsRef.current.querySelector(`[data-section="${sectionId}"]`);
    if (tab) tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setShowQuiz(false);
    scrollTabIntoView(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollTabIntoView]);

  // When clicking "Next" at end of section, mark section complete + show quiz
  const handleNextSection = useCallback(() => {
    // Mark current section as complete for signed-in users
    const user = useAuthStore.getState().user;
    if (user && content) {
      useProgressStore.getState().completeSection(
        user.uid, moduleId, activeSection, content.sections.length
      );
    }
    setShowQuiz(true);
  }, [moduleId, activeSection, content]);

  const togglePoint = (id: string) => {
    setExpandedPoints((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentSectionIndex = content?.sections.findIndex((s) => s.id === activeSection) ?? 0;
  const prevSection = content?.sections[currentSectionIndex - 1];
  const nextSection = content?.sections[currentSectionIndex + 1];
  const currentSection = content?.sections[currentSectionIndex];
  const sectionKey = moduleId && activeSection ? `${moduleId}-${activeSection}` : "";
  const totalSections = content?.sections.length ?? 0;

  // Has collapsible content?
  const hasCollapsible = languageMode !== "en_only";

  // Toggle label
  const toggleLabel = languageMode === "zhHant_zhHans"
    ? (showAllCollapsible ? "简体 ✓" : "简体")
    : languageMode === "en_zhHans"
    ? (showAllCollapsible ? "中文 ✓" : "中文")
    : "";

  if (redirecting) return null;

  if (!moduleMeta) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-dark">Module not found</h1>
        <Link href="/study" className="mt-4 inline-block text-primary hover:underline">Back to Study Center</Link>
      </div>
    );
  }

  // Lock guard
  if (!isModuleUnlocked(moduleId)) {
    return <LockedPage title={moduleMeta.titleEn} titleZh={languageMode !== "en_only" ? moduleMeta.titleZh : undefined} />;
  }

  return (
    <div className="mx-auto max-w-7xl lg:flex">
      {/* ── Mobile: Sticky top bar ── */}
      <div className="sticky top-16 z-30 border-b border-border bg-card lg:hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <Link href="/study" className="flex-shrink-0 rounded-lg p-1.5 text-text-gray hover:bg-gray-100 hover:text-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-text-dark">
            {moduleMeta.icon} {languageMode === "zhHant_zhHans" ? moduleMeta.titleZhHant : moduleMeta.titleEn}
          </p>
          {hasCollapsible && (
            <button
              onClick={() => setShowAllCollapsible(!showAllCollapsible)}
              className={`flex-shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                showAllCollapsible ? "bg-primary text-white" : "bg-gray-100 text-text-gray"
              }`}
            >
              {toggleLabel}
            </button>
          )}
        </div>
        <div
          ref={tabsRef}
          className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {content?.sections.map((section, idx) => (
            <button
              key={section.id}
              data-section={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-text-gray hover:bg-gray-200"
              }`}
            >
              {idx + 1}. {languageMode === "zhHant_zhHans" ? (section.titleZhHant || section.titleZh) : section.titleEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop: Sidebar ── */}
      <aside className="hidden lg:relative lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-border lg:bg-card">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
          <Link href="/study" className="mb-4 flex items-center gap-2 text-sm text-text-gray hover:text-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("module.allModules")}
          </Link>
          <h2 className="text-sm font-semibold text-text-dark">{moduleMeta.icon} {languageMode === "zhHant_zhHans" ? moduleMeta.titleZhHant : moduleMeta.titleEn}</h2>
          {languageMode !== "en_only" && <p className="mb-4 text-xs text-text-gray">{moduleMeta.titleZh}</p>}
          {content?.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeSection === section.id
                  ? "bg-primary-light font-medium text-primary"
                  : "text-text-gray hover:bg-gray-50 hover:text-text-dark"
              }`}
            >
              <span className="font-mono text-xs">{section.id}</span> {languageMode === "zhHant_zhHans" ? (section.titleZhHant || section.titleZh) : section.titleEn}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 px-4 py-4 lg:px-8 lg:py-6">
        {/* Desktop header */}
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">{languageMode === "zhHant_zhHans" ? (currentSection?.titleZhHant || currentSection?.titleZh) : currentSection?.titleEn}</h1>
            {languageMode !== "en_only" && <p className="text-sm text-text-gray">{currentSection?.titleZh}</p>}
          </div>
          {hasCollapsible && (
            <button
              onClick={() => setShowAllCollapsible(!showAllCollapsible)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                showAllCollapsible ? "bg-primary text-white" : "bg-gray-100 text-text-gray hover:bg-gray-200"
              }`}
            >
              {showAllCollapsible
                ? (languageMode === "zhHant_zhHans" ? "Hide 简体" : "Hide Chinese")
                : (languageMode === "zhHant_zhHans" ? "Show All 简体" : "Show All 中文")}
            </button>
          )}
        </div>

        {/* Mobile section title */}
        <div className="mb-4 lg:hidden">
          <h1 className="text-lg font-bold text-text-dark">{languageMode === "zhHant_zhHans" ? (currentSection?.titleZhHant || currentSection?.titleZh) : currentSection?.titleEn}</h1>
          {languageMode !== "en_only" && <p className="text-xs text-text-gray">{currentSection?.titleZh}</p>}
        </div>

        <SectionHeaderImages sectionKey={sectionKey} hideZh={languageMode === "en_only"} />

        {/* Knowledge Points */}
        {!content ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-text-gray">Loading content...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentSection?.knowledgePoints.map((point) => {
              const { main, collapsible, collapsibleLabel } = getStudyText(point, languageMode);
              const isExpanded = showAllCollapsible || expandedPoints.has(point.id);
              const pointImages = getImagesForPoint(point);

              return (
                <div key={point.id} className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
                  <div className="flex items-start gap-3">
                    {point.isNew && (
                      <span className="mt-0.5 whitespace-nowrap rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">2026 NEW</span>
                    )}
                    {point.isHighFreq && (
                      <span className="badge-high-freq mt-0.5 whitespace-nowrap">🔥 {t("module.highFreq")}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed text-text-dark md:text-base">{main}</p>

                      <ImageGallery images={pointImages} hideZh={languageMode === "en_only"} />

                      {/* Collapsible secondary language */}
                      {collapsible && (
                        <>
                          {isExpanded ? (
                            <div className="mt-3 border-l-2 border-primary-light pl-3">
                              <p className="text-zh">{collapsible}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => togglePoint(point.id)}
                              className="mt-2 text-xs text-primary hover:underline"
                            >
                              {collapsibleLabel}
                            </button>
                          )}
                          {isExpanded && !showAllCollapsible && (
                            <button
                              onClick={() => togglePoint(point.id)}
                              className="mt-1 text-xs text-text-gray hover:text-primary"
                            >
                              Hide ▲
                            </button>
                          )}
                        </>
                      )}

                      {point.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {point.tags.map((tag) => (
                            <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-text-gray">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop bottom nav */}
        <div className="mt-8 hidden items-center justify-between border-t border-border pt-4 lg:flex">
          {prevSection ? (
            <button onClick={() => handleSectionChange(prevSection.id)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {languageMode === "zhHant_zhHans" ? (prevSection.titleZhHant || prevSection.titleZh) : prevSection.titleEn}
            </button>
          ) : <div />}
          {nextSection ? (
            <button onClick={handleNextSection} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              {languageMode === "zhHant_zhHans" ? (nextSection.titleZhHant || nextSection.titleZh) : nextSection.titleEn}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button onClick={handleNextSection} className="flex items-center gap-2 text-sm font-medium text-success hover:underline">{t("module.moduleComplete")} ✓</button>
          )}
        </div>

        <div className="h-16 lg:hidden" />
      </div>

      {/* ── Mobile: Sticky bottom section nav ── */}
      <div className="fixed bottom-14 left-0 right-0 z-30 border-t border-border bg-card px-4 py-2 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => prevSection && handleSectionChange(prevSection.id)}
            disabled={!prevSection}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-primary disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {t("module.prev")}
          </button>
          <span className="text-xs font-medium text-text-gray">{currentSectionIndex + 1} / {totalSections}</span>
          {nextSection ? (
            <button onClick={handleNextSection} className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
              {t("module.next")}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button onClick={handleNextSection} className="flex items-center gap-1 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white">{t("module.done")} ✓</button>
          )}
        </div>
      </div>

      {/* ── Section Quiz Modal ── */}
      {showQuiz && currentSection && (
        <SectionQuiz
          moduleId={moduleId}
          sectionId={activeSection}
          sectionTitle={currentSection.titleEn}
          onClose={() => {
            setShowQuiz(false);
            if (nextSection) {
              // Move to next section within this module
              handleSectionChange(nextSection.id);
            } else if (nextModule) {
              // Last section of module → go to next module
              router.push(`/study/${nextModule.id}`);
            } else {
              // Last module → go back to study center
              router.push("/study");
            }
          }}
        />
      )}
    </div>
  );
}
