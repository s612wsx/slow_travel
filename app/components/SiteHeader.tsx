"use client";

import { useEffect, useState } from "react";

type NavLink = { label: string; href: string };

/**
 * 響應式頁首：
 * - 桌機（md 以上）：完整水平選單
 * - 平板 / 手機：漢堡按鈕 + 下拉選單
 */
export function SiteHeader({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  // 視窗放大到桌機尺寸時，自動收起手機選單
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-bark/10 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
        <a
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-baseline gap-2"
        >
          <span className="font-display text-xl font-semibold tracking-tight text-forest sm:text-2xl">
            今天去哪裡
          </span>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-clay sm:inline">
            Field Notes
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bark-soft transition-colors hover:text-ember"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/#newsletter"
            className="hidden rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep sm:inline-flex"
          >
            訂閱旅誌
          </a>

          <button
            type="button"
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bark/15 text-forest transition-colors hover:bg-paper md:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 手機 / 平板下拉選單 */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-bark/10 bg-cream/95 backdrop-blur transition-[max-height] duration-300 ease-out md:hidden ${
          open ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-bark-soft transition-colors hover:bg-paper hover:text-ember"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#newsletter"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream sm:hidden"
          >
            訂閱旅誌
          </a>
        </nav>
      </div>
    </header>
  );
}
