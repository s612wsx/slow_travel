import Link from "next/link";
import { navLinks } from "../lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-cream/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-display text-xl font-semibold text-cream">
            今天去哪裡
          </p>
          <p className="mt-3 text-sm leading-7">
            一本關於慢旅行的線上雜誌。
            <br />
            願你每一次出發，都帶著好奇回家。
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-soft">
            探索
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-soft">
            關注
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/#top" className="hover:text-cream">
                Instagram
              </a>
            </li>
            <li>
              <a href="/#top" className="hover:text-cream">
                Podcast · 路上有風
              </a>
            </li>
            <li>
              <a href="/#newsletter" className="hover:text-cream">
                電子報
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-soft">
            聯絡
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>hello@todaywhere.tw</li>
            <li>台北市 · 大稻埕</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 今天去哪裡 Field Notes. 版權所有。</p>
          <p>用溫柔的方式，記錄每一段路。</p>
        </div>
      </div>
    </footer>
  );
}
