import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { navLinks } from "../lib/site";
import { articles, themeChipClass } from "../lib/journal";

export const metadata: Metadata = {
  title: "旅人筆記｜今天去哪裡",
  description:
    "三篇關於慢旅行的文章：一篇寫山、一篇寫海、一篇寫城市。放慢腳步，重新看一次身邊的風景。",
};

export default function JournalIndexPage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-cream">
      <SiteHeader navLinks={navLinks} />

      <main className="flex-1">
        {/* 標題帶 */}
        <section className="border-b border-bark/10 bg-paper/60">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20 md:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
              Journal
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl md:text-5xl">
              旅人筆記
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-bark-soft sm:text-lg">
              三篇關於「慢旅行」的文章——一篇寫山，一篇寫海，一篇寫城市。
              沒有攻略，只有把腳步放慢之後，重新看見的風景。
            </p>
          </div>
        </section>

        {/* 文章列表 */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20 md:py-24">
          <div className="space-y-12 sm:space-y-16">
            {articles.map((article, i) => (
              <article
                key={article.slug}
                className="group grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-10"
              >
                <Link
                  href={`/journal/${article.slug}`}
                  className={`block overflow-hidden rounded-2xl ${
                    i % 2 === 1 ? "sm:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 460px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        themeChipClass[article.theme]
                      }`}
                    >
                      {article.theme}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-clay">
                      {article.date} · {article.readingTime}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-forest sm:text-3xl">
                    <Link
                      href={`/journal/${article.slug}`}
                      className="transition-colors hover:text-ember"
                    >
                      {article.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-bark-soft sm:text-base sm:leading-8">
                    {article.excerpt}
                  </p>

                  <Link
                    href={`/journal/${article.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-ember hover:underline"
                  >
                    閱讀全文 →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-bark/10 pt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-forest hover:text-ember"
            >
              ← 回首頁
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
