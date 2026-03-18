"use client";

import { useRequireSession } from "@/lib/useRequireSession";
import { useUILanguageStore } from "@/store/useUILanguageStore";

type Lang = "en" | "zhHant" | "zhHans";
function tri(en: string, zhHant: string, zhHans: string, lang: Lang) {
  return lang === "zhHant" ? zhHant : lang === "zhHans" ? zhHans : en;
}

export default function AboutPage() {
  const redirecting = useRequireSession();
  const uiLang = useUILanguageStore((s) => s.uiLang);
  const lang = uiLang as Lang;

  if (redirecting) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">
        {tri("About AceDriveGo", "關於 AceDriveGo", "关于 AceDriveGo", lang)}
      </h1>
      <p className="mt-1 text-sm text-text-gray">
        {tri("The story behind the platform", "平台背後的故事", "平台背后的故事", lang)}
      </p>

      {/* Section 1: Who Am I */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">👋</span>
          <h2 className="text-lg font-bold text-text-dark">
            {tri("Who Am I", "我是誰", "我是谁", lang)}
          </h2>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-text-dark">
            {tri(
              "Hi, I'm Judy \u2014 the solo developer and content creator behind AceDriveGo.",
              "你好，我是 Judy \u2014 AceDriveGo 的獨立開發者與內容創作者。",
              "你好，我是 Judy \u2014 AceDriveGo 的独立开发者与内容创作者。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "I'm currently studying at UCLA and will soon be heading to law school for a JD degree, bringing a political science background with me. I'm endlessly curious about life and love building things that matter.",
              "我目前在UCLA讀書，即將帶著政治學背景前往攻讀JD（法律博士）學位。我對生活永遠充滿好奇心，喜歡做一些有意思的事情。",
              "我目前在UCLA读书，即将带着政治学背景前往攻读JD（法律博士）学位。我对生活永远充满好奇心，喜欢做一些有意思的事情。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "In my view, law and code share a fascinating similarity: they are both foundational logic systems that can bring order to a complex world through clear rules. AceDriveGo was born from this very philosophy.",
              "在我看來，法律與代碼有著迷人的共性：它們都是底層邏輯，都可以通過清晰的規則，讓原本複雜的世界變得井然有序。AceDriveGo 就是在這個理念下誕生的作品。",
              "在我看来，法律与代码有着迷人的共性：它们都是底层逻辑，都可以通过清晰的规则，让原本复杂的世界变得井然有序。AceDriveGo 就是在这个理念下诞生的作品。",
              lang
            )}
          </p>
        </div>
      </div>

      {/* Section 2: Why AceDriveGo */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h2 className="text-lg font-bold text-text-dark">
            {tri("Why AceDriveGo", "為什麼做這個網站", "为什么做这个网站", lang)}
          </h2>
        </div>

        {/* Quote */}
        <div className="mt-4 rounded-xl border-l-4 border-primary bg-primary-light/30 p-5">
          <p className="text-sm italic text-text-dark">
            {tri(
              "\"This is my fourth year at UCLA, and I still hadn't bothered to get a driver's license.\"",
              "「這是我在UCLA的第四年，我卻沒有興趣去考駕照。」",
              "「这是我在UCLA的第四年，我却没有兴趣去考驾照。」",
              lang
            )}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-text-dark">
            {tri(
              "Living in California, getting a driver's license is the first administrative hurdle every new resident, international student, and worker must clear. But in my fourth year here, I noticed that many Chinese-speaking friends felt exhausted and lost when facing the complex DMV regulations:",
              "在加州生活，考駕照是每個新居民、留學生和工作族必須跨越的第一道「行政門檻」。但我在這的第四年發現，面對繁瑣的DMV規定，很多華人朋友常常感到疲憊和迷茫：",
              "在加州生活，考驾照是每个新居民、留学生和工作族必须跨越的第一道「行政门槛」。但我在这的第四年发现，面对繁琐的DMV规定，很多华人朋友常常感到疲惫和迷茫：",
              lang
            )}
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                icon: "🔍",
                title: tri("Fragmented information", "信息碎片化", "信息碎片化", lang),
                desc: tri(
                  "Online guides are mostly outdated and scattered. It's hard to find accurate, up-to-date guidance covering the 2025 rules for different visa statuses (F-1, H-1B, Green Card, etc.).",
                  "網上的攻略大多陳舊且零散，很難找到涵蓋2025最新規則、針對不同身份（如F-1、H-1B、綠卡等）的精準指引。",
                  "网上的攻略大多陈旧且零散，很难找到涵盖2025最新规则、针对不同身份（如F-1、H-1B、绿卡等）的精准指引。",
                  lang
                ),
              },
              {
                icon: "😤",
                title: tri("Poor tool experience", "工具体验差", "工具体验差", lang),
                desc: tri(
                  "Existing Chinese DMV study sites are filled with pop-up ads, stuck in 2010s UI, and lack scientific progress tracking or mistake management.",
                  "現有的中文駕考網站往往充斥著彈窗廣告，界面停留在十年前，缺乏科學的進度追蹤和錯題管理功能。",
                  "现有的中文驾考网站往往充斥着弹窗广告，界面停留在十年前，缺乏科学的进度追踪和错题管理功能。",
                  lang
                ),
              },
              {
                icon: "🌐",
                title: tri("Language & rule barriers", "语言与规则壁垒", "语言与规则壁垒", lang),
                desc: tri(
                  "The DMV handbook tests traffic laws, not just driving skills. Many literal Chinese translations are confusing and don't break down the legal logic behind the rules.",
                  "DMV手冊不僅是在考駕駛技術，更是在考「交通法規」。很多直譯的中文題目晦澀難懂，沒有從法規邏輯上去做真正的拆解。",
                  "DMV手册不仅是在考驾驶技术，更是在考「交通法规」。很多直译的中文题目晦涩难懂，没有从法规逻辑上去做真正的拆解。",
                  lang
                ),
              },
            ].map((item) => (
              <div key={item.icon} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-text-dark">{item.title}</p>
                  <p className="mt-1 text-xs text-text-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-text-dark">
            {tri(
              "Since no good tool existed, I decided to build one myself. Combining my ability to break down administrative rules with full-stack development experience, I vibe-coded this platform.",
              "既然沒有好用的工具，那就自己動手做一個。於是，我結合了自己對行政規則的拆解能力和全棧開發經驗，vibe coding了這個平台。",
              "既然没有好用的工具，那就自己动手做一个。于是，我结合了自己对行政规则的拆解能力和全栈开发经验，vibe coding了这个平台。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            {tri(
              "I want AceDriveGo to be more than a \"practice test site\" \u2014 it should be a \"California life guide.\"",
              "我希望AceDriveGo不僅僅是一個「刷題網站」，更是一個「加州生活通關指南」。",
              "我希望AceDriveGo不仅仅是一个「刷题网站」，更是一个「加州生活通关指南」。",
              lang
            )}
          </p>
        </div>
      </div>

      {/* What you get */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-text-dark">
          {tri("What You Get", "你能體驗到", "你能体验到", lang)}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "📖",
              title: tri("Clearest rule breakdown", "最清晰的法規重構", "最清晰的法规重构", lang),
              desc: tri(
                "DMV handbook broken into 12 core modules, precisely aligned with the latest test points.",
                "將DMV手冊拆解為12個核心模組，精準對齊最新考點。",
                "将DMV手册拆解为12个核心模块，精准对齐最新考点。",
                lang
              ),
            },
            {
              icon: "🛂",
              title: tri("Complete visa guide", "無死角身份指南", "无死角身份指南", lang),
              desc: tri(
                "No matter your visa type, get your personalized REAL ID application checklist in one click.",
                "無論你持有哪種簽證，都能一鍵獲取屬於你的REAL ID申請清單。",
                "无论你持有哪种签证，都能一键获取属于你的REAL ID申请清单。",
                lang
              ),
            },
            {
              icon: "✨",
              title: tri("Modern study experience", "現代化學習體驗", "现代化学习体验", lang),
              desc: tri(
                "Seamless EN/Traditional/Simplified switching, smart mistake tracking, with the most modern UI.",
                "中英繁簡無縫切換，智能錯題追蹤，以最現代的UI界面陪伴你的備考旅程。",
                "中英繁简无缝切换，智能错题追踪，以最现代的UI界面陪伴你的备考旅程。",
                lang
              ),
            },
          ].map((item) => (
            <div key={item.icon} className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-2 text-sm font-semibold text-text-dark">{item.title}</h3>
              <p className="mt-2 text-xs text-text-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing */}
      <div className="mt-10 rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-md">
        <p className="text-sm leading-relaxed">
          {tri(
            "Coming to Los Angeles, getting your driver's license is your first step toward freedom and independence on this land. I hope AceDriveGo can clear the fog of regulations and help you confidently take the wheel.",
            "來到洛杉磯，考取駕照是你在這片土地上獲得自由與獨立的第一步。希望AceDriveGo能為你掃清規則的迷霧，幫你自信地握住方向盤。",
            "来到洛杉矶，考取驾照是你在这片土地上获得自由与独立的第一步。希望AceDriveGo能为你扫清规则的迷雾，帮你自信地握住方向盘。",
            lang
          )}
        </p>
        <p className="mt-4 text-lg font-bold">
          Study. Drive. Go. 🚗
        </p>
        <p className="mt-1 text-sm text-white/80">
          {tri(
            "Wishing you a perfect score!",
            "祝你滿分通過！",
            "祝你满分通过！",
            lang
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-text-gray">
        <p>AceDriveGo &middot; acedrivego.com</p>
        <p className="mt-1">
          {tri(
            "Built with curiosity and code by Judy @ UCLA",
            "由 Judy @ UCLA 以好奇心與代碼打造",
            "由 Judy @ UCLA 以好奇心与代码打造",
            lang
          )}
        </p>
      </div>
    </div>
  );
}
