import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FallingItemsGame } from "../components/FallingItemsGame";
import { navLinks } from "../lib/site";

export const metadata: Metadata = {
  title: "小遊戲 · 快手打包｜今天去哪裡",
  description:
    "一個 15 秒的旅行主題小遊戲：接住掉下來的護照、相機、雨傘和行動電源，時間結束看你的旅行稱號。純娛樂，不需登入。",
};

export default function GamePage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-cream">
      <SiteHeader navLinks={navLinks} />

      <main className="flex-1">
        <section className="border-b border-bark/10 bg-paper/60">
          <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
              Mini Game
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl md:text-5xl">
              小遊戲：快手打包
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-bark-soft sm:text-lg">
              出發前，先來場暖身。旅行用品會從天上掉下來，
              在它們落地前點到就加分——十五秒後，看看你是哪一種旅人。
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
          <FallingItemsGame />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
