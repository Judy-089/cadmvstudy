"use client";

interface Testimonial {
  name: string;
  initials: string;
  color: string;
  stars: number;
  quote: string;
  lang: "en" | "zh";
}

const testimonials: Testimonial[] = [
  // ── English testimonials (for EN audience) ──
  {
    name: "Emily L.",
    initials: "EL",
    color: "bg-primary",
    stars: 5,
    quote: "Passed my DMV test on the first try! The structured modules saved me hours compared to reading the whole handbook.",
    lang: "en",
  },
  {
    name: "Sarah K.",
    initials: "SK",
    color: "bg-warning",
    stars: 5,
    quote: "The mock exams are incredibly realistic. I scored 34/36 on the real test after practicing here.",
    lang: "en",
  },
  {
    name: "Jessica T.",
    initials: "JT",
    color: "bg-primary",
    stars: 4,
    quote: "Love the high-frequency markers — I knew exactly which topics to focus on. Passed easily!",
    lang: "en",
  },
  {
    name: "Kevin H.",
    initials: "KH",
    color: "bg-success",
    stars: 5,
    quote: "The traffic sign images alongside each knowledge point really helped me memorize them quickly.",
    lang: "en",
  },
  {
    name: "Ryan P.",
    initials: "RP",
    color: "bg-primary",
    stars: 5,
    quote: "Way better than reading the handbook cover to cover. The crash course got me test-ready in one evening.",
    lang: "en",
  },
  {
    name: "Alex M.",
    initials: "AM",
    color: "bg-error",
    stars: 5,
    quote: "I was dreading the DMV test for months. This app made it so straightforward — 10/10 would recommend.",
    lang: "en",
  },
  {
    name: "Brianna C.",
    initials: "BC",
    color: "bg-warning",
    stars: 5,
    quote: "The explanations for each question are gold. I actually understand the rules now, not just memorizing answers.",
    lang: "en",
  },
  // ── Chinese testimonials (for ZH audience) ──
  {
    name: "David W.",
    initials: "DW",
    color: "bg-success",
    stars: 5,
    quote: "中英对照太方便了，比我之前用的任何备考资料都好，强烈推荐给需要考驾照的朋友！",
    lang: "zh",
  },
  {
    name: "Michael C.",
    initials: "MC",
    color: "bg-error",
    stars: 5,
    quote: "作为新移民，这个平台帮了大忙。繁体中文选项让我能用母语理解交通规则。",
    lang: "zh",
  },
  {
    name: "Lisa Z.",
    initials: "LZ",
    color: "bg-warning",
    stars: 5,
    quote: "我妈妈英文不好，用繁体中文模式学习，一次就考过了！感谢这个平台。",
    lang: "zh",
  },
  {
    name: "Jenny L.",
    initials: "JL",
    color: "bg-primary",
    stars: 5,
    quote: "終於有一個真正為華人設計的駕考平台了！介面很清爽，沒有煩人的廣告。",
    lang: "zh",
  },
  {
    name: "Tony H.",
    initials: "TH",
    color: "bg-success",
    stars: 5,
    quote: "模擬考試和真實考試非常接近，做完幾套模擬題之後上考場一點都不緊張。",
    lang: "zh",
  },
  {
    name: "Amy W.",
    initials: "AW",
    color: "bg-error",
    stars: 4,
    quote: "错题重做功能太实用了，帮我精准定位薄弱环节。考前最后一天集中复习错题，顺利通过！",
    lang: "zh",
  },
  {
    name: "Frank C.",
    initials: "FC",
    color: "bg-warning",
    stars: 5,
    quote: "在別的網站學了兩週沒把握，用這個平台速成課程兩小時就搞定了，第二天一次過！",
    lang: "zh",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "text-warning" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCarousel({ filterLang }: { filterLang?: "en" | "zh" }) {
  const filtered = filterLang
    ? testimonials.filter((t) => t.lang === filterLang)
    : testimonials;

  // Duplicate items for seamless infinite scroll
  const items = [...filtered, ...filtered];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex gap-4 hover:[animation-play-state:paused]"
        style={{
          animation: "scroll-testimonials 40s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="w-72 flex-shrink-0 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-text-dark">{t.name}</p>
                <Stars count={t.stars} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-light line-clamp-3">
              &ldquo;{t.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
