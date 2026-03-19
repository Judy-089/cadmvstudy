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
        {tri("The story behind the platform", "這個平台背後的故事", "平台背后的故事", lang)}
      </p>

      {/* Section 1: Who I Am */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">👋</span>
          <h2 className="text-lg font-bold text-text-dark">
            {tri("Who I Am", "我是誰", "我是谁", lang)}
          </h2>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-text-dark">
            {tri(
              "Hi, I\u2019m Judy \u2014 the solo developer and content creator behind AceDriveGo.",
              "你好，我是 Judy —— AceDriveGo 的獨立開發者兼內容創作者。",
              "你好，我是 Judy —— AceDriveGo 的独立开发者和内容创作者。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "I\u2019m currently studying at UCLA and will soon be heading to law school to pursue a JD. My background is in political science and data analysis, and I\u2019ve always been deeply curious about how systems work \u2014 especially the ones that shape people\u2019s everyday lives.",
              "我現時就讀 UCLA，之後亦將會入讀法學院攻讀 JD（法律博士）學位。我的學術背景是政治學和數據分析，而我一直都對「制度如何運作」這件事特別感興趣，尤其是那些真實影響人們日常生活的規則與系統。",
              "我目前在 UCLA 读书，即将前往法学院攻读 JD（法律博士）学位。我的学术背景是政治学和数据分析，而我一直对\u201c系统如何运作\u201d这件事很感兴趣，尤其是那些真实影响人们日常生活的制度与规则。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "To me, law and code have something important in common: both are systems of logic designed to bring order to a complicated world through clear rules. AceDriveGo was built from that same belief.",
              "在我看來，法律和程式碼有一個很重要的共通點：它們本質上都是一套邏輯系統，嘗試透過清晰的規則，為原本複雜的世界建立秩序。AceDriveGo 正是在這樣的理解之下誕生。",
              "在我看来，法律与代码有一个很重要的共通点：它们本质上都是逻辑系统，都试图通过清晰的规则，为复杂的世界建立秩序。AceDriveGo 就是在这样的理解下诞生的。",
              lang
            )}
          </p>
        </div>
      </div>

      {/* Section 2: Why I Built AceDriveGo */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h2 className="text-lg font-bold text-text-dark">
            {tri("Why I Built AceDriveGo", "為甚麼會做 AceDriveGo", "为什么做 AceDriveGo", lang)}
          </h2>
        </div>

        {/* Quote */}
        <div className="mt-4 rounded-xl border-l-4 border-primary bg-primary-light/30 p-5">
          <p className="text-sm italic text-text-dark">
            {tri(
              "\u201cThis is my fourth year at UCLA, and I still hadn\u2019t gotten my driver\u2019s license.\u201d That was me.",
              "「這已經是我在 UCLA 的第四年，但我一直都還沒有去考車牌。」 說的其實就是我自己。",
              "「这是我在 UCLA 的第四年，我却还没有去考驾照。」 这说的就是我自己。",
              lang
            )}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-text-dark">
            {tri(
              "In California, getting a driver\u2019s license is one of the first practical challenges many new residents, international students, and workers face. By my fourth year at UCLA, I had started noticing the same pattern again and again: many of my Chinese-speaking friends felt overwhelmed, frustrated, and completely lost when trying to navigate the DMV system.",
              "在加州生活，考取駕照幾乎是每一位新居民、留學生和工作人士都要面對的第一道現實門檻。但到了我在 UCLA 的第四年，我開始反覆留意到同一個現象：很多講中文的朋友，一遇到 DMV 系統，就很容易感到疲憊、挫敗，甚至不知道應該從哪裡開始。",
              "在加州生活，考取驾照几乎是每一个新居民、留学生和工作人士都会遇到的第一道现实门槛。但到了我在 UCLA 的第四年，我开始反复注意到同一个现象：很多说中文的朋友在面对 DMV 系统时，常常会感到疲惫、挫败，甚至无从下手。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "This quarter, I also took a class on Asian American politics at UCLA, where one of our projects focused on language barriers. That experience made me think more deeply about how inaccessible essential systems can become when information is poorly translated, poorly organized, or simply not designed with immigrant communities in mind. It was one of the key moments that inspired this project.",
              "今個學期，我亦修讀了一門關於亞裔美國人政治的課程，其中有一個項目專門討論語言障礙的問題。那次經歷令我更認真地思考：當資訊翻譯得不夠準確、整理得不夠清晰，又或者整個系統在設計之初根本沒有真正考慮移民社群的使用需要時，原本人人都應該能夠順利接觸到的基本制度，為甚麼會變得如此難以進入。這也是促使我做這個項目的其中一個重要原因。",
              "这学期，我还上了一门关于亚裔美国人政治的课程，其中有一个项目专门讨论了语言壁垒的问题。那次经历让我更认真地开始思考：当信息翻译得不够准确、组织得不够清楚，或者系统在设计之初就没有真正考虑移民群体的使用需求时，原本每个人都应该能顺利接触到的基本制度，为什么会变得如此难以进入。那也是促使我做这个项目的重要原因之一。",
              lang
            )}
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                icon: "\ud83d\udd0d",
                title: tri("Scattered, outdated information", "資訊零散，而且過時", "信息碎片化、而且过时", lang),
                desc: tri(
                  "Most online guides are incomplete, outdated, or scattered across random websites and forums. It is surprisingly difficult to find reliable, up-to-date information that reflects the latest California DMV rules across different visa categories, whether you are on F-1, H-1B, a green card, or something else.",
                  "網上關於加州駕照和 DMV 的中文攻略，很多不是內容零散，就是早已過時。想找到一份真正準確、涵蓋最新規則、同時又能區分不同身份情況的指南，其實並不容易。無論你持 F-1、H-1B、綠卡，還是其他身份，需要準備的文件和辦理路徑都可能不同。",
                  "网上关于加州驾照和 DMV 的中文攻略，很多要么内容零散，要么早就过时了。想找到一份真正准确、覆盖最新规则、还能区分不同身份情况的指南，其实并不容易。无论是 F-1、H-1B、绿卡，还是其他身份，大家面对的材料要求和办理路径都可能不一样。",
                  lang
                ),
              },
              {
                icon: "\ud83d\ude24",
                title: tri("A frustrating user experience", "工具體驗不理想", "工具体验不够好", lang),
                desc: tri(
                  "Many existing Chinese-language DMV prep sites feel stuck in the 2010s \u2014 overloaded with pop-up ads, cluttered interfaces, and no real learning system. There is usually no meaningful progress tracking, no smart error review, and no thoughtful study design.",
                  "現時不少中文駕考網站，仍然停留在很多年前的產品思維：版面混亂、彈窗很多、廣告很多，也缺乏真正幫助學習的設計。通常既沒有完整的進度追蹤，也沒有智能錯題管理，更談不上清晰、現代的學習體驗。",
                  "现有不少中文驾考网站，仍然停留在很多年前的产品思路：页面杂乱、弹窗很多、广告很多，也缺乏真正帮助学习的设计。通常没有成体系的进度追踪、没有智能错题管理，也没有一个足够清晰、现代的学习体验。",
                  lang
                ),
              },
              {
                icon: "\ud83c\udf10",
                title: tri("Language and legal barriers", "語言與規則的雙重門檻", "语言与规则的双重门槛", lang),
                desc: tri(
                  "The California DMV test is not just about driving skills \u2014 it is also about understanding traffic law. Many direct Chinese translations are technically accurate, but still difficult to understand because they fail to explain the legal reasoning behind the rules.",
                  "加州 DMV 筆試考的不只是駕駛技巧，更是在考你對交通法規的理解。很多中文內容雖然屬於直譯，但並不代表真正容易明白，因為它們沒有把規則背後的法律邏輯解釋清楚。看得到中文，不等於真的看得明、學得懂。",
                  "加州 DMV 笔试考的不只是驾驶技巧，更是在考你对交通法规的理解。很多中文内容虽然是直译的，但并不真正易懂，因为它们没有把规则背后的法律逻辑讲清楚。用户看到中文了，却不代表真的理解了。",
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
              "So when I realized there wasn\u2019t a tool I would actually want to use myself, I decided to build one. AceDriveGo brings together clear rule breakdowns, up-to-date administrative guidance, and a modern study experience in one place. Drawing on my interest in legal systems and my full-stack development skills, I built the platform from the ground up.",
              "正因為一直沒有一個連我自己都願意使用的工具，我決定乾脆自己做一個。AceDriveGo 將法規拆解、行政指引，以及現代化的學習體驗整合到同一個平台之中。結合我對制度與規則的興趣，以及全棧開發的能力，我由零開始建立了這個網站。",
              "正因为一直没有一个我自己也愿意用的工具，我决定干脆自己做一个。AceDriveGo 把法规拆解、行政指引和现代化学习体验整合到同一个平台里。结合我对规则系统的兴趣，以及全栈开发的能力，我从零开始搭建了这个网站。",
              lang
            )}
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            {tri(
              "I want AceDriveGo to be more than just a practice test website. I want it to be a practical guide to starting life in California.",
              "我希望 AceDriveGo 不只是一個「刷題網站」，而是一份幫助你在加州更順利展開生活的實用指南。",
              "我希望 AceDriveGo 不只是一个\u201c刷题网站\u201d，而是一个帮助你在加州更顺利开始生活的实用指南。",
              lang
            )}
          </p>
        </div>
      </div>

      {/* What You'll Get */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-text-dark">
          {tri("What You\u2019ll Get", "你可以獲得甚麼", "你能体验到什么", lang)}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "\ud83d\udcd6",
              title: tri("Clear, structured rule breakdowns", "清晰而有結構的法規拆解", "清晰、结构化的法规拆解", lang),
              desc: tri(
                "The DMV handbook is broken into 12 core modules, carefully organized around the most important and test-relevant concepts.",
                "我將 DMV 手冊重新整理成 12 個核心模組，圍繞最重要、最常考、亦最容易混淆的內容作有系統的梳理。",
                "我把 DMV 手册重新整理为 12 个核心模块，围绕最重要、最容易考到、也最容易混淆的内容进行结构化梳理。",
                lang
              ),
            },
            {
              icon: "\ud83d\udec2",
              title: tri("A complete visa-based application guide", "完整的身份與申請指引", "完整的身份与申请指南", lang),
              desc: tri(
                "No matter your immigration status, you can get a personalized REAL ID and driver\u2019s license document checklist in just one click.",
                "無論你持有甚麼身份，都可以一鍵取得適合自己的 REAL ID 與駕照申請文件清單，減少來回查找和反覆確認的時間成本。",
                "无论你持有什么身份，都可以一键获取适合自己的 REAL ID 与驾照申请材料清单，减少来回查找和反复确认的成本。",
                lang
              ),
            },
            {
              icon: "\u2728",
              title: tri("A modern study experience", "更現代化的學習體驗", "更现代的学习体验", lang),
              desc: tri(
                "Switch seamlessly between English, Traditional Chinese, and Simplified Chinese, track your mistakes intelligently, and study with a clean, modern interface designed for real learning.",
                "平台支援英文、繁體中文和簡體中文無縫切換，提供智能錯題追蹤，並以更清爽、現代的介面陪你完成備考，而不是讓你被廣告和雜亂資訊拖慢進度。",
                "支持英文、繁体中文、简体中文无缝切换，提供智能错题追踪，并用更清爽、现代的界面陪你完成备考，而不是让你被广告和混乱信息拖垮。",
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
            "For many people coming to Los Angeles, getting a driver\u2019s license is one of the first real steps toward freedom, confidence, and independence. I built AceDriveGo to make that step less confusing \u2014 to clear away the noise, simplify the rules, and help you get on the road with confidence.",
            "對很多剛來到洛杉磯的人來說，拿到駕照，往往是邁向自由、自信和獨立生活的重要一步。我做 AceDriveGo，就是希望令這一步不再那麼混亂——幫你撥開規則與資訊的迷霧，更清楚地理解整個系統，也更有信心地坐上駕駛座。",
            "对于很多刚来到洛杉矶的人来说，拿到驾照，往往是迈向自由、信心与独立生活的重要一步。我做 AceDriveGo，就是希望把这一步变得不再那么混乱——帮你拨开规则和信息的迷雾，更清楚地理解系统，也更有信心地坐上驾驶座。",
            lang
          )}
        </p>
        <p className="mt-4 text-lg font-bold">
          Study. Drive. Go. 🚗
        </p>
        <p className="mt-1 text-sm text-white/80">
          {tri(
            "Your California journey starts here.",
            "你的加州生活，就從這裡開始。",
            "你的加州生活，从这里开始。",
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
            "由 Judy @ UCLA 以好奇心與程式碼打造",
            "由 Judy @ UCLA 以好奇心与代码打造",
            lang
          )}
        </p>
      </div>
    </div>
  );
}
