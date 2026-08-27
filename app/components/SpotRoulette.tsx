"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { spots, type Spot } from "../lib/spots";

const REVEAL_MS = 1500;

function pickSpot(previous: Spot | null): Spot {
  const pool = previous
    ? spots.filter((s) => s.name !== previous.name)
    : spots;
  return pool[Math.floor(Math.random() * pool.length)] ?? spots[0];
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SpotRoulette() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"drawing" | "result">("drawing");
  const [current, setCurrent] = useState<Spot | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 先抽好結果，但先播小動畫，時間到才揭曉
  const runDraw = useCallback((previous: Spot | null) => {
    setCurrent(pickSpot(previous));
    clearTimer();
    if (prefersReducedMotion()) {
      setPhase("result");
      return;
    }
    setPhase("drawing");
    timerRef.current = window.setTimeout(() => {
      setPhase("result");
      timerRef.current = null;
    }, REVEAL_MS);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    runDraw(current);
  };

  const drawAgain = () => runDraw(current);

  const handleClose = () => {
    clearTimer();
    setOpen(false);
  };

  // 開啟時：鎖捲動、Esc 關閉、Tab 焦點鎖在 modal 內、關閉後焦點還給按鈕
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      clearTimer();
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-forest-deep"
      >
        <span aria-hidden="true">🎲</span>
        我今天去哪裡
      </button>

      {open && current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="animate-overlay-in absolute inset-0 bg-bark/50 backdrop-blur-sm" />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="spot-roulette-name"
            aria-busy={phase === "drawing"}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-2xl border border-bark/10 bg-cream shadow-2xl outline-none"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-forest via-sage to-ember" />

            {phase === "drawing" ? (
              <div className="px-6 py-9 sm:px-8">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-clay">
                  <span className="roulette-dice mr-2" aria-hidden="true">
                    🎲
                  </span>
                  正在為你找路
                </p>

                <div className="relative mt-6 h-24 overflow-hidden rounded-xl border border-bark/10 bg-paper/60">
                  <div className="absolute inset-x-0 bottom-5 border-t-2 border-dashed border-clay/70" />
                  <div className="roulette-scenery absolute bottom-6 left-3 flex gap-9 text-2xl">
                    {["🌲", "⛰️", "🏖️", "🏙️", "🏝️", "🌾", "🌲", "⛰️", "🏖️", "🏙️"].map(
                      (s, i) => (
                        <span key={i} aria-hidden="true">
                          {s}
                        </span>
                      ),
                    )}
                  </div>
                  <div className="roulette-car-track absolute bottom-2 left-0">
                    <span
                      className="roulette-car-bob inline-flex items-end text-3xl"
                      aria-hidden="true"
                    >
                      <span className="mr-0.5 text-base opacity-70">💨</span>
                      {/* 🚗 emoji 預設朝左，水平翻轉讓車頭朝右（行進方向） */}
                      <span
                        className="inline-block"
                        style={{ transform: "scaleX(-1)" }}
                      >
                        🚗
                      </span>
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-bark-soft">
                  油門催下去，馬上就到⋯⋯
                </p>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
                  今天的提案
                </p>

                <div key={current.name} className="animate-spot-pop">
                  <h2
                    id="spot-roulette-name"
                    className="mt-3 font-display text-3xl font-semibold text-forest"
                  >
                    {current.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-cream">
                      {current.city}
                    </span>
                    <span className="rounded-full border border-clay/50 bg-paper px-3 py-1 text-xs font-semibold text-bark-soft">
                      {current.type}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-bark-soft">
                    {current.reason}
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={drawAgain}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ember px-5 text-sm font-semibold text-cream transition-colors hover:bg-[#c96a32] sm:flex-1"
                  >
                    <span aria-hidden="true">🎲</span>
                    再抽一次
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-forest/30 px-5 text-sm font-semibold text-forest transition-colors hover:bg-paper sm:w-auto"
                  >
                    關閉
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
