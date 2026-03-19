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
        {tri("About AceDriveGo", "\u95dc\u65bc AceDriveGo", "\u5173\u4e8e AceDriveGo", lang)}
      </h1>
      <p className="mt-1 text-sm text-text-gray">
        {tri("The story behind the platform", "\u9019\u500b\u5e73\u53f0\u80cc\u5f8c\u7684\u6545\u4e8b", "\u5e73\u53f0\u80cc\u540e\u7684\u6545\u4e8b", lang)}
      </p>

      {/* Section 1: Who I Am */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">👋</span>
          <h2 className="text-lg font-bold text-text-dark">
            {tri("Who I Am", "\u6211\u662f\u8ab0", "\u6211\u662f\u8c01", lang)}
          </h2>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-text-dark">
            {tri(
              "Hi, I\u2019m Judy \u2014 the solo developer and content creator behind AceDriveGo.",
              "\u4f60\u597d\uff0c\u6211\u662f Judy \u2014\u2014 AceDriveGo \u7684\u7368\u7acb\u958b\u767c\u8005\u517c\u5167\u5bb9\u5275\u4f5c\u8005\u3002",
              "\u4f60\u597d\uff0c\u6211\u662f Judy \u2014\u2014 AceDriveGo \u7684\u72ec\u7acb\u5f00\u53d1\u8005\u548c\u5185\u5bb9\u521b\u4f5c\u8005\u3002",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "I\u2019m currently studying at UCLA and will soon be heading to law school to pursue a JD. My background is in political science and data analysis, and I\u2019ve always been deeply curious about how systems work \u2014 especially the ones that shape people\u2019s everyday lives.",
              "\u6211\u73fe\u6642\u5c31\u8b80 UCLA\uff0c\u4e4b\u5f8c\u4ea6\u5c07\u6703\u5165\u8b80\u6cd5\u5b78\u9662\u653b\u8b80 JD\uff08\u6cd5\u5f8b\u535a\u58eb\uff09\u5b78\u4f4d\u3002\u6211\u7684\u5b78\u8853\u80cc\u666f\u662f\u653f\u6cbb\u5b78\u548c\u6578\u64da\u5206\u6790\uff0c\u800c\u6211\u4e00\u76f4\u90fd\u5c0d\u300c\u5236\u5ea6\u5982\u4f55\u904b\u4f5c\u300d\u9019\u4ef6\u4e8b\u7279\u5225\u611f\u8208\u8da3\uff0c\u5c24\u5176\u662f\u90a3\u4e9b\u771f\u5be6\u5f71\u97ff\u4eba\u5011\u65e5\u5e38\u751f\u6d3b\u7684\u898f\u5247\u8207\u7cfb\u7d71\u3002",
              "\u6211\u76ee\u524d\u5728 UCLA \u8bfb\u4e66\uff0c\u5373\u5c06\u524d\u5f80\u6cd5\u5b66\u9662\u653b\u8bfb JD\uff08\u6cd5\u5f8b\u535a\u58eb\uff09\u5b66\u4f4d\u3002\u6211\u7684\u5b66\u672f\u80cc\u666f\u662f\u653f\u6cbb\u5b66\u548c\u6570\u636e\u5206\u6790\uff0c\u800c\u6211\u4e00\u76f4\u5bf9\u201c\u7cfb\u7edf\u5982\u4f55\u8fd0\u4f5c\u201d\u8fd9\u4ef6\u4e8b\u5f88\u611f\u5174\u8da3\uff0c\u5c24\u5176\u662f\u90a3\u4e9b\u771f\u5b9e\u5f71\u54cd\u4eba\u4eec\u65e5\u5e38\u751f\u6d3b\u7684\u5236\u5ea6\u4e0e\u89c4\u5219\u3002",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "To me, law and code have something important in common: both are systems of logic designed to bring order to a complicated world through clear rules. AceDriveGo was built from that same belief.",
              "\u5728\u6211\u770b\u4f86\uff0c\u6cd5\u5f8b\u548c\u7a0b\u5f0f\u78bc\u6709\u4e00\u500b\u5f88\u91cd\u8981\u7684\u5171\u901a\u9ede\uff1a\u5b83\u5011\u672c\u8cea\u4e0a\u90fd\u662f\u4e00\u5957\u908f\u8f2f\u7cfb\u7d71\uff0c\u5617\u8a66\u900f\u904e\u6e05\u6670\u7684\u898f\u5247\uff0c\u70ba\u539f\u672c\u8907\u96dc\u7684\u4e16\u754c\u5efa\u7acb\u79e9\u5e8f\u3002AceDriveGo \u6b63\u662f\u5728\u9019\u6a23\u7684\u7406\u89e3\u4e4b\u4e0b\u8a95\u751f\u3002",
              "\u5728\u6211\u770b\u6765\uff0c\u6cd5\u5f8b\u4e0e\u4ee3\u7801\u6709\u4e00\u4e2a\u5f88\u91cd\u8981\u7684\u5171\u901a\u70b9\uff1a\u5b83\u4eec\u672c\u8d28\u4e0a\u90fd\u662f\u903b\u8f91\u7cfb\u7edf\uff0c\u90fd\u8bd5\u56fe\u901a\u8fc7\u6e05\u6670\u7684\u89c4\u5219\uff0c\u4e3a\u590d\u6742\u7684\u4e16\u754c\u5efa\u7acb\u79e9\u5e8f\u3002AceDriveGo \u5c31\u662f\u5728\u8fd9\u6837\u7684\u7406\u89e3\u4e0b\u8bde\u751f\u7684\u3002",
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
            {tri("Why I Built AceDriveGo", "\u70ba\u751a\u9ebc\u6703\u505a AceDriveGo", "\u4e3a\u4ec0\u4e48\u505a AceDriveGo", lang)}
          </h2>
        </div>

        {/* Quote */}
        <div className="mt-4 rounded-xl border-l-4 border-primary bg-primary-light/30 p-5">
          <p className="text-sm italic text-text-dark">
            {tri(
              "\u201cThis is my fourth year at UCLA, and I still hadn\u2019t gotten my driver\u2019s license.\u201d That was me.",
              "\u300c\u9019\u5df2\u7d93\u662f\u6211\u5728 UCLA \u7684\u7b2c\u56db\u5e74\uff0c\u4f46\u6211\u4e00\u76f4\u90fd\u9084\u6c92\u6709\u53bb\u8003\u8eca\u724c\u3002\u300d \u8aaa\u7684\u5176\u5be6\u5c31\u662f\u6211\u81ea\u5df1\u3002",
              "\u300c\u8fd9\u662f\u6211\u5728 UCLA \u7684\u7b2c\u56db\u5e74\uff0c\u6211\u5374\u8fd8\u6ca1\u6709\u53bb\u8003\u9a7e\u7167\u3002\u300d \u8fd9\u8bf4\u7684\u5c31\u662f\u6211\u81ea\u5df1\u3002",
              lang
            )}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-text-dark">
            {tri(
              "In California, getting a driver\u2019s license is one of the first practical challenges many new residents, international students, and workers face. By my fourth year at UCLA, I had started noticing the same pattern again and again: many of my Chinese-speaking friends felt overwhelmed, frustrated, and completely lost when trying to navigate the DMV system.",
              "\u5728\u52a0\u5dde\u751f\u6d3b\uff0c\u8003\u53d6\u99d5\u7167\u5e7e\u4e4e\u662f\u6bcf\u4e00\u4f4d\u65b0\u5c45\u6c11\u3001\u7559\u5b78\u751f\u548c\u5de5\u4f5c\u4eba\u58eb\u90fd\u8981\u9762\u5c0d\u7684\u7b2c\u4e00\u9053\u73fe\u5be6\u9580\u6abb\u3002\u4f46\u5230\u4e86\u6211\u5728 UCLA \u7684\u7b2c\u56db\u5e74\uff0c\u6211\u958b\u59cb\u53cd\u8986\u7559\u610f\u5230\u540c\u4e00\u500b\u73fe\u8c61\uff1a\u5f88\u591a\u8b1b\u4e2d\u6587\u7684\u670b\u53cb\uff0c\u4e00\u9047\u5230 DMV \u7cfb\u7d71\uff0c\u5c31\u5f88\u5bb9\u6613\u611f\u5230\u75b2\u618a\u3001\u632b\u6557\uff0c\u751a\u81f3\u4e0d\u77e5\u9053\u61c9\u8a72\u5f9e\u54ea\u88e1\u958b\u59cb\u3002",
              "\u5728\u52a0\u5dde\u751f\u6d3b\uff0c\u8003\u53d6\u9a7e\u7167\u51e0\u4e4e\u662f\u6bcf\u4e00\u4e2a\u65b0\u5c45\u6c11\u3001\u7559\u5b66\u751f\u548c\u5de5\u4f5c\u4eba\u58eb\u90fd\u4f1a\u9047\u5230\u7684\u7b2c\u4e00\u9053\u73b0\u5b9e\u95e8\u69db\u3002\u4f46\u5230\u4e86\u6211\u5728 UCLA \u7684\u7b2c\u56db\u5e74\uff0c\u6211\u5f00\u59cb\u53cd\u590d\u6ce8\u610f\u5230\u540c\u4e00\u4e2a\u73b0\u8c61\uff1a\u5f88\u591a\u8bf4\u4e2d\u6587\u7684\u670b\u53cb\u5728\u9762\u5bf9 DMV \u7cfb\u7edf\u65f6\uff0c\u5e38\u5e38\u4f1a\u611f\u5230\u75b2\u60eb\u3001\u632b\u8d25\uff0c\u751a\u81f3\u65e0\u4ece\u4e0b\u624b\u3002",
              lang
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-light">
            {tri(
              "This quarter, I also took a class on Asian American politics at UCLA, where one of our projects focused on language barriers. That experience made me think more deeply about how inaccessible essential systems can become when information is poorly translated, poorly organized, or simply not designed with immigrant communities in mind. It was one of the key moments that inspired this project.",
              "\u4eca\u500b\u5b78\u671f\uff0c\u6211\u4ea6\u4fee\u8b80\u4e86\u4e00\u9580\u95dc\u65bc\u4e9e\u88d4\u7f8e\u570b\u4eba\u653f\u6cbb\u7684\u8ab2\u7a0b\uff0c\u5176\u4e2d\u6709\u4e00\u500b\u9805\u76ee\u5c08\u9580\u8a0e\u8ad6\u8a9e\u8a00\u969c\u7919\u7684\u554f\u984c\u3002\u90a3\u6b21\u7d93\u6b77\u4ee4\u6211\u66f4\u8a8d\u771f\u5730\u601d\u8003\uff1a\u7576\u8cc7\u8a0a\u7ffb\u8b6f\u5f97\u4e0d\u5920\u6e96\u78ba\u3001\u6574\u7406\u5f97\u4e0d\u5920\u6e05\u6670\uff0c\u53c8\u6216\u8005\u6574\u500b\u7cfb\u7d71\u5728\u8a2d\u8a08\u4e4b\u521d\u6839\u672c\u6c92\u6709\u771f\u6b63\u8003\u616e\u79fb\u6c11\u793e\u7fa4\u7684\u4f7f\u7528\u9700\u8981\u6642\uff0c\u539f\u672c\u4eba\u4eba\u90fd\u61c9\u8a72\u80fd\u5920\u9806\u5229\u63a5\u89f8\u5230\u7684\u57fa\u672c\u5236\u5ea6\uff0c\u70ba\u751a\u9ebc\u6703\u8b8a\u5f97\u5982\u6b64\u96e3\u4ee5\u9032\u5165\u3002\u9019\u4e5f\u662f\u4fc3\u4f7f\u6211\u505a\u9019\u500b\u9805\u76ee\u7684\u5176\u4e2d\u4e00\u500b\u91cd\u8981\u539f\u56e0\u3002",
              "\u8fd9\u5b66\u671f\uff0c\u6211\u8fd8\u4e0a\u4e86\u4e00\u95e8\u5173\u4e8e\u4e9a\u88d4\u7f8e\u56fd\u4eba\u653f\u6cbb\u7684\u8bfe\u7a0b\uff0c\u5176\u4e2d\u6709\u4e00\u4e2a\u9879\u76ee\u4e13\u95e8\u8ba8\u8bba\u4e86\u8bed\u8a00\u58c1\u5792\u7684\u95ee\u9898\u3002\u90a3\u6b21\u7ecf\u5386\u8ba9\u6211\u66f4\u8ba4\u771f\u5730\u5f00\u59cb\u601d\u8003\uff1a\u5f53\u4fe1\u606f\u7ffb\u8bd1\u5f97\u4e0d\u591f\u51c6\u786e\u3001\u7ec4\u7ec7\u5f97\u4e0d\u591f\u6e05\u695a\uff0c\u6216\u8005\u7cfb\u7edf\u5728\u8bbe\u8ba1\u4e4b\u521d\u5c31\u6ca1\u6709\u771f\u6b63\u8003\u8651\u79fb\u6c11\u7fa4\u4f53\u7684\u4f7f\u7528\u9700\u6c42\u65f6\uff0c\u539f\u672c\u6bcf\u4e2a\u4eba\u90fd\u5e94\u8be5\u80fd\u987a\u5229\u63a5\u89e6\u5230\u7684\u57fa\u672c\u5236\u5ea6\uff0c\u4e3a\u4ec0\u4e48\u4f1a\u53d8\u5f97\u5982\u6b64\u96be\u4ee5\u8fdb\u5165\u3002\u90a3\u4e5f\u662f\u4fc3\u4f7f\u6211\u505a\u8fd9\u4e2a\u9879\u76ee\u7684\u91cd\u8981\u539f\u56e0\u4e4b\u4e00\u3002",
              lang
            )}
          </p>

          <div className="mt-4 space-y-3">
            {[
              {
                icon: "\ud83d\udd0d",
                title: tri("Scattered, outdated information", "\u8cc7\u8a0a\u96f6\u6563\uff0c\u800c\u4e14\u904e\u6642", "\u4fe1\u606f\u788e\u7247\u5316\u3001\u800c\u4e14\u8fc7\u65f6", lang),
                desc: tri(
                  "Most online guides are incomplete, outdated, or scattered across random websites and forums. It is surprisingly difficult to find reliable, up-to-date information that reflects the latest California DMV rules across different visa categories, whether you are on F-1, H-1B, a green card, or something else.",
                  "\u7db2\u4e0a\u95dc\u65bc\u52a0\u5dde\u99d5\u7167\u548c DMV \u7684\u4e2d\u6587\u653b\u7565\uff0c\u5f88\u591a\u4e0d\u662f\u5167\u5bb9\u96f6\u6563\uff0c\u5c31\u662f\u65e9\u5df2\u904e\u6642\u3002\u60f3\u627e\u5230\u4e00\u4efd\u771f\u6b63\u6e96\u78ba\u3001\u6db5\u84cb\u6700\u65b0\u898f\u5247\u3001\u540c\u6642\u53c8\u80fd\u5340\u5206\u4e0d\u540c\u8eab\u4efd\u60c5\u6cc1\u7684\u6307\u5357\uff0c\u5176\u5be6\u4e26\u4e0d\u5bb9\u6613\u3002\u7121\u8ad6\u4f60\u6301 F-1\u3001H-1B\u3001\u7da0\u5361\uff0c\u9084\u662f\u5176\u4ed6\u8eab\u4efd\uff0c\u9700\u8981\u6e96\u5099\u7684\u6587\u4ef6\u548c\u8fa6\u7406\u8def\u5f91\u90fd\u53ef\u80fd\u4e0d\u540c\u3002",
                  "\u7f51\u4e0a\u5173\u4e8e\u52a0\u5dde\u9a7e\u7167\u548c DMV \u7684\u4e2d\u6587\u653b\u7565\uff0c\u5f88\u591a\u8981\u4e48\u5185\u5bb9\u96f6\u6563\uff0c\u8981\u4e48\u65e9\u5c31\u8fc7\u65f6\u4e86\u3002\u60f3\u627e\u5230\u4e00\u4efd\u771f\u6b63\u51c6\u786e\u3001\u8986\u76d6\u6700\u65b0\u89c4\u5219\u3001\u8fd8\u80fd\u533a\u5206\u4e0d\u540c\u8eab\u4efd\u60c5\u51b5\u7684\u6307\u5357\uff0c\u5176\u5b9e\u5e76\u4e0d\u5bb9\u6613\u3002\u65e0\u8bba\u662f F-1\u3001H-1B\u3001\u7eff\u5361\uff0c\u8fd8\u662f\u5176\u4ed6\u8eab\u4efd\uff0c\u5927\u5bb6\u9762\u5bf9\u7684\u6750\u6599\u8981\u6c42\u548c\u529e\u7406\u8def\u5f84\u90fd\u53ef\u80fd\u4e0d\u4e00\u6837\u3002",
                  lang
                ),
              },
              {
                icon: "\ud83d\ude24",
                title: tri("A frustrating user experience", "\u5de5\u5177\u9ad4\u9a57\u4e0d\u7406\u60f3", "\u5de5\u5177\u4f53\u9a8c\u4e0d\u591f\u597d", lang),
                desc: tri(
                  "Many existing Chinese-language DMV prep sites feel stuck in the 2010s \u2014 overloaded with pop-up ads, cluttered interfaces, and no real learning system. There is usually no meaningful progress tracking, no smart error review, and no thoughtful study design.",
                  "\u73fe\u6642\u4e0d\u5c11\u4e2d\u6587\u99d5\u8003\u7db2\u7ad9\uff0c\u4ecd\u7136\u505c\u7559\u5728\u5f88\u591a\u5e74\u524d\u7684\u7522\u54c1\u601d\u7dad\uff1a\u7248\u9762\u6df7\u4e82\u3001\u5f48\u7a97\u5f88\u591a\u3001\u5ee3\u544a\u5f88\u591a\uff0c\u4e5f\u7f3a\u4e4f\u771f\u6b63\u5e6b\u52a9\u5b78\u7fd2\u7684\u8a2d\u8a08\u3002\u901a\u5e38\u65e2\u6c92\u6709\u5b8c\u6574\u7684\u9032\u5ea6\u8ffd\u8e64\uff0c\u4e5f\u6c92\u6709\u667a\u80fd\u932f\u984c\u7ba1\u7406\uff0c\u66f4\u8ac7\u4e0d\u4e0a\u6e05\u6670\u3001\u73fe\u4ee3\u7684\u5b78\u7fd2\u9ad4\u9a57\u3002",
                  "\u73b0\u6709\u4e0d\u5c11\u4e2d\u6587\u9a7e\u8003\u7f51\u7ad9\uff0c\u4ecd\u7136\u505c\u7559\u5728\u5f88\u591a\u5e74\u524d\u7684\u4ea7\u54c1\u601d\u8def\uff1a\u9875\u9762\u6742\u4e71\u3001\u5f39\u7a97\u5f88\u591a\u3001\u5e7f\u544a\u5f88\u591a\uff0c\u4e5f\u7f3a\u4e4f\u771f\u6b63\u5e2e\u52a9\u5b66\u4e60\u7684\u8bbe\u8ba1\u3002\u901a\u5e38\u6ca1\u6709\u6210\u4f53\u7cfb\u7684\u8fdb\u5ea6\u8ffd\u8e2a\u3001\u6ca1\u6709\u667a\u80fd\u9519\u9898\u7ba1\u7406\uff0c\u4e5f\u6ca1\u6709\u4e00\u4e2a\u8db3\u591f\u6e05\u6670\u3001\u73b0\u4ee3\u7684\u5b66\u4e60\u4f53\u9a8c\u3002",
                  lang
                ),
              },
              {
                icon: "\ud83c\udf10",
                title: tri("Language and legal barriers", "\u8a9e\u8a00\u8207\u898f\u5247\u7684\u96d9\u91cd\u9580\u6abb", "\u8bed\u8a00\u4e0e\u89c4\u5219\u7684\u53cc\u91cd\u95e8\u69db", lang),
                desc: tri(
                  "The California DMV test is not just about driving skills \u2014 it is also about understanding traffic law. Many direct Chinese translations are technically accurate, but still difficult to understand because they fail to explain the legal reasoning behind the rules.",
                  "\u52a0\u5dde DMV \u7b46\u8a66\u8003\u7684\u4e0d\u53ea\u662f\u99d5\u99db\u6280\u5de7\uff0c\u66f4\u662f\u5728\u8003\u4f60\u5c0d\u4ea4\u901a\u6cd5\u898f\u7684\u7406\u89e3\u3002\u5f88\u591a\u4e2d\u6587\u5167\u5bb9\u96d6\u7136\u5c6c\u65bc\u76f4\u8b6f\uff0c\u4f46\u4e26\u4e0d\u4ee3\u8868\u771f\u6b63\u5bb9\u6613\u660e\u767d\uff0c\u56e0\u70ba\u5b83\u5011\u6c92\u6709\u628a\u898f\u5247\u80cc\u5f8c\u7684\u6cd5\u5f8b\u908f\u8f2f\u89e3\u91cb\u6e05\u695a\u3002\u770b\u5f97\u5230\u4e2d\u6587\uff0c\u4e0d\u7b49\u65bc\u771f\u7684\u770b\u5f97\u660e\u3001\u5b78\u5f97\u61c2\u3002",
                  "\u52a0\u5dde DMV \u7b14\u8bd5\u8003\u7684\u4e0d\u53ea\u662f\u9a7e\u9a76\u6280\u5de7\uff0c\u66f4\u662f\u5728\u8003\u4f60\u5bf9\u4ea4\u901a\u6cd5\u89c4\u7684\u7406\u89e3\u3002\u5f88\u591a\u4e2d\u6587\u5185\u5bb9\u867d\u7136\u662f\u76f4\u8bd1\u7684\uff0c\u4f46\u5e76\u4e0d\u771f\u6b63\u6613\u61c2\uff0c\u56e0\u4e3a\u5b83\u4eec\u6ca1\u6709\u628a\u89c4\u5219\u80cc\u540e\u7684\u6cd5\u5f8b\u903b\u8f91\u8bb2\u6e05\u695a\u3002\u7528\u6237\u770b\u5230\u4e2d\u6587\u4e86\uff0c\u5374\u4e0d\u4ee3\u8868\u771f\u7684\u7406\u89e3\u4e86\u3002",
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
              "\u6b63\u56e0\u70ba\u4e00\u76f4\u6c92\u6709\u4e00\u500b\u9023\u6211\u81ea\u5df1\u90fd\u9858\u610f\u4f7f\u7528\u7684\u5de5\u5177\uff0c\u6211\u6c7a\u5b9a\u4e7e\u8106\u81ea\u5df1\u505a\u4e00\u500b\u3002AceDriveGo \u5c07\u6cd5\u898f\u62c6\u89e3\u3001\u884c\u653f\u6307\u5f15\uff0c\u4ee5\u53ca\u73fe\u4ee3\u5316\u7684\u5b78\u7fd2\u9ad4\u9a57\u6574\u5408\u5230\u540c\u4e00\u500b\u5e73\u53f0\u4e4b\u4e2d\u3002\u7d50\u5408\u6211\u5c0d\u5236\u5ea6\u8207\u898f\u5247\u7684\u8208\u8da3\uff0c\u4ee5\u53ca\u5168\u68e7\u958b\u767c\u7684\u80fd\u529b\uff0c\u6211\u7531\u96f6\u958b\u59cb\u5efa\u7acb\u4e86\u9019\u500b\u7db2\u7ad9\u3002",
              "\u6b63\u56e0\u4e3a\u4e00\u76f4\u6ca1\u6709\u4e00\u4e2a\u6211\u81ea\u5df1\u4e5f\u613f\u610f\u7528\u7684\u5de5\u5177\uff0c\u6211\u51b3\u5b9a\u5e72\u8106\u81ea\u5df1\u505a\u4e00\u4e2a\u3002AceDriveGo \u628a\u6cd5\u89c4\u62c6\u89e3\u3001\u884c\u653f\u6307\u5f15\u548c\u73b0\u4ee3\u5316\u5b66\u4e60\u4f53\u9a8c\u6574\u5408\u5230\u540c\u4e00\u4e2a\u5e73\u53f0\u91cc\u3002\u7ed3\u5408\u6211\u5bf9\u89c4\u5219\u7cfb\u7edf\u7684\u5174\u8da3\uff0c\u4ee5\u53ca\u5168\u6808\u5f00\u53d1\u7684\u80fd\u529b\uff0c\u6211\u4ece\u96f6\u5f00\u59cb\u642d\u5efa\u4e86\u8fd9\u4e2a\u7f51\u7ad9\u3002",
              lang
            )}
          </p>
          <p className="mt-3 text-sm font-medium text-primary">
            {tri(
              "I want AceDriveGo to be more than just a practice test website. I want it to be a practical guide to starting life in California.",
              "\u6211\u5e0c\u671b AceDriveGo \u4e0d\u53ea\u662f\u4e00\u500b\u300c\u5237\u984c\u7db2\u7ad9\u300d\uff0c\u800c\u662f\u4e00\u4efd\u5e6b\u52a9\u4f60\u5728\u52a0\u5dde\u66f4\u9806\u5229\u5c55\u958b\u751f\u6d3b\u7684\u5be6\u7528\u6307\u5357\u3002",
              "\u6211\u5e0c\u671b AceDriveGo \u4e0d\u53ea\u662f\u4e00\u4e2a\u201c\u5237\u9898\u7f51\u7ad9\u201d\uff0c\u800c\u662f\u4e00\u4e2a\u5e2e\u52a9\u4f60\u5728\u52a0\u5dde\u66f4\u987a\u5229\u5f00\u59cb\u751f\u6d3b\u7684\u5b9e\u7528\u6307\u5357\u3002",
              lang
            )}
          </p>
        </div>
      </div>

      {/* What You'll Get */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-text-dark">
          {tri("What You\u2019ll Get", "\u4f60\u53ef\u4ee5\u7372\u5f97\u751a\u9ebc", "\u4f60\u80fd\u4f53\u9a8c\u5230\u4ec0\u4e48", lang)}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "\ud83d\udcd6",
              title: tri("Clear, structured rule breakdowns", "\u6e05\u6670\u800c\u6709\u7d50\u69cb\u7684\u6cd5\u898f\u62c6\u89e3", "\u6e05\u6670\u3001\u7ed3\u6784\u5316\u7684\u6cd5\u89c4\u62c6\u89e3", lang),
              desc: tri(
                "The DMV handbook is broken into 12 core modules, carefully organized around the most important and test-relevant concepts.",
                "\u6211\u5c07 DMV \u624b\u518a\u91cd\u65b0\u6574\u7406\u6210 12 \u500b\u6838\u5fc3\u6a21\u7d44\uff0c\u570d\u7e5e\u6700\u91cd\u8981\u3001\u6700\u5e38\u8003\u3001\u4ea6\u6700\u5bb9\u6613\u6df7\u6dc6\u7684\u5167\u5bb9\u4f5c\u6709\u7cfb\u7d71\u7684\u68b3\u7406\u3002",
                "\u6211\u628a DMV \u624b\u518c\u91cd\u65b0\u6574\u7406\u4e3a 12 \u4e2a\u6838\u5fc3\u6a21\u5757\uff0c\u56f4\u7ed5\u6700\u91cd\u8981\u3001\u6700\u5bb9\u6613\u8003\u5230\u3001\u4e5f\u6700\u5bb9\u6613\u6df7\u6dc6\u7684\u5185\u5bb9\u8fdb\u884c\u7ed3\u6784\u5316\u68b3\u7406\u3002",
                lang
              ),
            },
            {
              icon: "\ud83d\udec2",
              title: tri("A complete visa-based application guide", "\u5b8c\u6574\u7684\u8eab\u4efd\u8207\u7533\u8acb\u6307\u5f15", "\u5b8c\u6574\u7684\u8eab\u4efd\u4e0e\u7533\u8bf7\u6307\u5357", lang),
              desc: tri(
                "No matter your immigration status, you can get a personalized REAL ID and driver\u2019s license document checklist in just one click.",
                "\u7121\u8ad6\u4f60\u6301\u6709\u751a\u9ebc\u8eab\u4efd\uff0c\u90fd\u53ef\u4ee5\u4e00\u9375\u53d6\u5f97\u9069\u5408\u81ea\u5df1\u7684 REAL ID \u8207\u99d5\u7167\u7533\u8acb\u6587\u4ef6\u6e05\u55ae\uff0c\u6e1b\u5c11\u4f86\u56de\u67e5\u627e\u548c\u53cd\u8986\u78ba\u8a8d\u7684\u6642\u9593\u6210\u672c\u3002",
                "\u65e0\u8bba\u4f60\u6301\u6709\u4ec0\u4e48\u8eab\u4efd\uff0c\u90fd\u53ef\u4ee5\u4e00\u952e\u83b7\u53d6\u9002\u5408\u81ea\u5df1\u7684 REAL ID \u4e0e\u9a7e\u7167\u7533\u8bf7\u6750\u6599\u6e05\u5355\uff0c\u51cf\u5c11\u6765\u56de\u67e5\u627e\u548c\u53cd\u590d\u786e\u8ba4\u7684\u6210\u672c\u3002",
                lang
              ),
            },
            {
              icon: "\u2728",
              title: tri("A modern study experience", "\u66f4\u73fe\u4ee3\u5316\u7684\u5b78\u7fd2\u9ad4\u9a57", "\u66f4\u73b0\u4ee3\u7684\u5b66\u4e60\u4f53\u9a8c", lang),
              desc: tri(
                "Switch seamlessly between English, Traditional Chinese, and Simplified Chinese, track your mistakes intelligently, and study with a clean, modern interface designed for real learning.",
                "\u5e73\u53f0\u652f\u63f4\u82f1\u6587\u3001\u7e41\u9ad4\u4e2d\u6587\u548c\u7c21\u9ad4\u4e2d\u6587\u7121\u7e2b\u5207\u63db\uff0c\u63d0\u4f9b\u667a\u80fd\u932f\u984c\u8ffd\u8e64\uff0c\u4e26\u4ee5\u66f4\u6e05\u723d\u3001\u73fe\u4ee3\u7684\u4ecb\u9762\u966a\u4f60\u5b8c\u6210\u5099\u8003\uff0c\u800c\u4e0d\u662f\u8b93\u4f60\u88ab\u5ee3\u544a\u548c\u96dc\u4e82\u8cc7\u8a0a\u62d6\u6162\u9032\u5ea6\u3002",
                "\u652f\u6301\u82f1\u6587\u3001\u7e41\u4f53\u4e2d\u6587\u3001\u7b80\u4f53\u4e2d\u6587\u65e0\u7f1d\u5207\u6362\uff0c\u63d0\u4f9b\u667a\u80fd\u9519\u9898\u8ffd\u8e2a\uff0c\u5e76\u7528\u66f4\u6e05\u723d\u3001\u73b0\u4ee3\u7684\u754c\u9762\u966a\u4f60\u5b8c\u6210\u5907\u8003\uff0c\u800c\u4e0d\u662f\u8ba9\u4f60\u88ab\u5e7f\u544a\u548c\u6df7\u4e71\u4fe1\u606f\u62d6\u57ae\u3002",
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
            "\u5c0d\u5f88\u591a\u525b\u4f86\u5230\u6d1b\u6749\u78ef\u7684\u4eba\u4f86\u8aaa\uff0c\u62ff\u5230\u99d5\u7167\uff0c\u5f80\u5f80\u662f\u9081\u5411\u81ea\u7531\u3001\u81ea\u4fe1\u548c\u7368\u7acb\u751f\u6d3b\u7684\u91cd\u8981\u4e00\u6b65\u3002\u6211\u505a AceDriveGo\uff0c\u5c31\u662f\u5e0c\u671b\u4ee4\u9019\u4e00\u6b65\u4e0d\u518d\u90a3\u9ebc\u6df7\u4e82\u2014\u2014\u5e6b\u4f60\u64a5\u958b\u898f\u5247\u8207\u8cc7\u8a0a\u7684\u8ff7\u9727\uff0c\u66f4\u6e05\u695a\u5730\u7406\u89e3\u6574\u500b\u7cfb\u7d71\uff0c\u4e5f\u66f4\u6709\u4fe1\u5fc3\u5730\u5750\u4e0a\u99d5\u99db\u5ea7\u3002",
            "\u5bf9\u4e8e\u5f88\u591a\u521a\u6765\u5230\u6d1b\u6749\u77f6\u7684\u4eba\u6765\u8bf4\uff0c\u62ff\u5230\u9a7e\u7167\uff0c\u5f80\u5f80\u662f\u8fc8\u5411\u81ea\u7531\u3001\u4fe1\u5fc3\u4e0e\u72ec\u7acb\u751f\u6d3b\u7684\u91cd\u8981\u4e00\u6b65\u3002\u6211\u505a AceDriveGo\uff0c\u5c31\u662f\u5e0c\u671b\u628a\u8fd9\u4e00\u6b65\u53d8\u5f97\u4e0d\u518d\u90a3\u4e48\u6df7\u4e71\u2014\u2014\u5e2e\u4f60\u62e8\u5f00\u89c4\u5219\u548c\u4fe1\u606f\u7684\u8ff7\u96fe\uff0c\u66f4\u6e05\u695a\u5730\u7406\u89e3\u7cfb\u7edf\uff0c\u4e5f\u66f4\u6709\u4fe1\u5fc3\u5730\u5750\u4e0a\u9a7e\u9a76\u5ea7\u3002",
            lang
          )}
        </p>
        <p className="mt-4 text-lg font-bold">
          Study. Drive. Go. 🚗
        </p>
        <p className="mt-1 text-sm text-white/80">
          {tri(
            "Your California journey starts here.",
            "\u4f60\u7684\u52a0\u5dde\u751f\u6d3b\uff0c\u5c31\u5f9e\u9019\u88e1\u958b\u59cb\u3002",
            "\u4f60\u7684\u52a0\u5dde\u751f\u6d3b\uff0c\u4ece\u8fd9\u91cc\u5f00\u59cb\u3002",
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
            "\u7531 Judy @ UCLA \u4ee5\u597d\u5947\u5fc3\u8207\u4ee3\u78bc\u6253\u9020",
            "\u7531 Judy @ UCLA \u4ee5\u597d\u5947\u5fc3\u4e0e\u4ee3\u7801\u6253\u9020",
            lang
          )}
        </p>
      </div>
    </div>
  );
}
