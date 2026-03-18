"use client";

const testimonials = [
  {
    name: "Emily L.",
    initials: "EL",
    color: "bg-primary",
    stars: 5,
    quote: "Passed my DMV test on the first try! The bilingual explanations made everything so much clearer.",
  },
  {
    name: "David W.",
    initials: "DW",
    color: "bg-success",
    stars: 5,
    quote: "中英对照太方便了，比我之前用的任何备考资料都好，强烈推荐给需要考驾照的朋友！",
  },
  {
    name: "Sarah K.",
    initials: "SK",
    color: "bg-warning",
    stars: 5,
    quote: "The mock exams are incredibly realistic. I scored 34/36 on the real test after practicing here.",
  },
  {
    name: "Michael C.",
    initials: "MC",
    color: "bg-error",
    stars: 5,
    quote: "作为新移民，这个平台帮了大忙。繁体中文选项让我能用母语理解交通规则。",
  },
  {
    name: "Jessica T.",
    initials: "JT",
    color: "bg-primary",
    stars: 4,
    quote: "Love the high-frequency markers — I knew exactly which topics to focus on. Passed easily!",
  },
  {
    name: "Kevin H.",
    initials: "KH",
    color: "bg-success",
    stars: 5,
    quote: "The traffic sign images alongside each knowledge point really helped me memorize them quickly.",
  },
  {
    name: "Lisa Z.",
    initials: "LZ",
    color: "bg-warning",
    stars: 5,
    quote: "我妈妈英文不好，用繁体中文模式学习，一次就考过了！感谢这个平台。",
  },
  {
    name: "Ryan P.",
    initials: "RP",
    color: "bg-primary",
    stars: 5,
    quote: "Way better than reading the handbook cover to cover. The structured modules saved me hours.",
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

export function TestimonialCarousel() {
  // Duplicate items for seamless infinite scroll
  const items = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent" />

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
