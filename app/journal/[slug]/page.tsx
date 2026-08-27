import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { navLinks } from "../../lib/site";
import { articles, getArticle, themeChipClass } from "../../lib/journal";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "找不到文章｜今天去哪裡" };
  return {
    title: `${article.title}｜旅人筆記`,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({
  params,
}: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug);

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-cream">
      <SiteHeader navLinks={navLinks} />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 md:py-20">
          <Link
            href="/journal"
            className="text-sm font-semibold text-forest hover:text-ember"
          >
            ← 旅人筆記
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                themeChipClass[article.theme]
              }`}
            >
              {article.theme}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-clay">
              {article.kind} · {article.date} · {article.readingTime}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-forest sm:text-4xl md:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-bark-soft">
            {article.excerpt}
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-clay">
            {article.location}
          </p>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="mt-10 space-y-6">
            {article.body.map((para, i) => (
              <Fragment key={i}>
                <p className="text-lg leading-9 text-bark-soft">{para}</p>
                {i === 1 && (
                  <blockquote className="border-l-4 border-ember py-2 pl-5 font-display text-xl font-medium leading-relaxed text-forest sm:text-2xl">
                    {article.pullQuote}
                  </blockquote>
                )}
              </Fragment>
            ))}
          </div>
        </article>

        {/* 其他文章 */}
        <section className="border-t border-bark/10 bg-paper/60">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-16">
            <h2 className="font-display text-2xl font-semibold text-forest">
              繼續讀
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/journal/${other.slug}`}
                  className="group flex gap-4 rounded-2xl border border-bark/10 bg-cream p-4 transition-colors hover:border-ember/40"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={other.image}
                      alt={other.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                        themeChipClass[other.theme]
                      }`}
                    >
                      {other.theme}
                    </span>
                    <p className="mt-1.5 font-display text-base font-semibold leading-snug text-forest transition-colors group-hover:text-ember">
                      {other.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
