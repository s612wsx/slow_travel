"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const GAME_SECONDS = 15;

type ItemKind = {
  key: string;
  label: string;
  emoji: string;
  points: number;
};

const ITEM_KINDS: ItemKind[] = [
  { key: "passport", label: "護照", emoji: "🛂", points: 3 },
  { key: "camera", label: "相機", emoji: "📷", points: 2 },
  { key: "powerbank", label: "行動電源", emoji: "🔋", points: 2 },
  { key: "umbrella", label: "雨傘", emoji: "☂️", points: 1 },
];

type FallingItem = ItemKind & {
  id: number;
  left: number; // %
  duration: number; // s
  size: number; // rem
};

type ScorePop = { id: number; left: number; top: number; points: number };

type Phase = "idle" | "playing" | "over";

function rankFor(score: number): { title: string; note: string } {
  if (score >= 42)
    return { title: "傳說中的環島達人", note: "行李箱早就是你身體的一部分。" };
  if (score >= 28)
    return { title: "行李三分鐘收好的老手", note: "說走就走，從不遲疑。" };
  if (score >= 16)
    return { title: "揹包客見習生", note: "你已經聞得到遠方的味道了。" };
  if (score >= 6)
    return { title: "週末小旅行新手", note: "先從近的地方開始，也很好。" };
  return { title: "還在猶豫要不要出門的沙發旅人", note: "沒關係，下次一定成行。" };
}

export function FallingItemsGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [pops, setPops] = useState<ScorePop[]>([]);

  const areaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const startGame = useCallback(() => {
    idRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setItems([]);
    setPops([]);
    setPhase("playing");
  }, []);

  // 生成物品 + 倒數計時
  useEffect(() => {
    if (phase !== "playing") return;

    const spawn = setInterval(() => {
      const kind = ITEM_KINDS[Math.floor(Math.random() * ITEM_KINDS.length)];
      idRef.current += 1;
      setItems((prev) => [
        ...prev,
        {
          ...kind,
          id: idRef.current,
          left: 6 + Math.random() * 84,
          duration: 2.4 + Math.random() * 1.7,
          size: 2 + Math.random() * 1.1,
        },
      ]);
    }, 520);

    const tick = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => {
      clearInterval(spawn);
      clearInterval(tick);
    };
  }, [phase]);

  // 時間到 → 結算
  useEffect(() => {
    if (phase === "playing" && timeLeft === 0) {
      setPhase("over");
      setItems([]);
      setPops([]);
    }
  }, [phase, timeLeft]);

  const catchItem = useCallback(
    (item: FallingItem, e: React.MouseEvent) => {
      if (phase !== "playing") return;
      const rect = areaRef.current?.getBoundingClientRect();
      const top = rect
        ? ((e.clientY - rect.top) / rect.height) * 100
        : 50;

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setScore((s) => s + item.points);
      setPops((prev) => [
        ...prev,
        { id: item.id, left: item.left, top, points: item.points },
      ]);
      window.setTimeout(
        () => setPops((prev) => prev.filter((p) => p.id !== item.id)),
        650,
      );
    },
    [phase],
  );

  const missItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const rank = rankFor(score);

  return (
    <div>
      <div
        ref={areaRef}
        className="relative w-full select-none overflow-hidden rounded-3xl border border-bark/10 bg-gradient-to-b from-[#eaf1e8] via-cream to-paper"
        style={{ height: "min(70vh, 560px)", touchAction: "manipulation" }}
      >
        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-forest px-4 py-1.5 text-sm font-semibold text-cream shadow">
              分數 {score}
            </span>
            <span className="rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-forest shadow">
              {timeLeft} 秒
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-bark/10">
            <div
              className="h-full rounded-full bg-ember transition-[width] duration-1000 ease-linear"
              style={{ width: `${(timeLeft / GAME_SECONDS) * 100}%` }}
            />
          </div>
        </div>

        {/* 掉落物 */}
        {phase === "playing" &&
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`接住${item.label}`}
              onClick={(e) => catchItem(item, e)}
              onAnimationEnd={() => missItem(item.id)}
              className="absolute -translate-x-1/2 leading-none drop-shadow-sm transition-transform active:scale-90"
              style={{
                left: `${item.left}%`,
                fontSize: `${item.size}rem`,
                animation: `game-fall ${item.duration}s linear forwards`,
              }}
            >
              <span aria-hidden="true">{item.emoji}</span>
            </button>
          ))}

        {/* 得分彈出 */}
        {pops.map((pop) => (
          <span
            key={pop.id}
            className="pointer-events-none absolute z-10 font-display text-lg font-bold text-ember"
            style={{
              left: `${pop.left}%`,
              top: `${pop.top}%`,
              animation: "game-pop 0.65s ease-out forwards",
            }}
          >
            +{pop.points}
          </span>
        ))}

        {/* 開始畫面 */}
        {phase === "idle" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-cream/80 px-6 text-center backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
              15 秒小遊戲
            </p>
            <h2 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
              快手打包！
            </h2>
            <p className="max-w-sm text-sm leading-7 text-bark-soft">
              旅行用品會從天上掉下來——護照 🛂、相機 📷、行動電源 🔋、雨傘 ☂️。
              在它們落地前點到就加分，護照最值錢。準備好了嗎？
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-ember px-8 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-[#c96a32]"
            >
              開始遊戲
            </button>
          </div>
        )}

        {/* 結算畫面 */}
        {phase === "over" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-cream/85 px-6 text-center backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
              時間到！
            </p>
            <p className="font-display text-5xl font-semibold text-forest">
              {score}
              <span className="ml-1 text-xl text-bark-soft">分</span>
            </p>
            <p className="rounded-full bg-forest px-4 py-1.5 text-sm font-semibold text-cream">
              旅行稱號 · {rank.title}
            </p>
            <p className="max-w-xs text-sm leading-7 text-bark-soft">{rank.note}</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startGame}
                className="inline-flex h-11 items-center justify-center rounded-full bg-ember px-6 text-sm font-semibold text-cream transition-colors hover:bg-[#c96a32]"
              >
                再玩一次
              </button>
              <Link
                href="/#routes"
                className="inline-flex h-11 items-center justify-center rounded-full border border-forest/30 px-6 text-sm font-semibold text-forest transition-colors hover:bg-paper"
              >
                去看真正的路線
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-clay">
        純娛樂用途 · 分數不會被記錄，重新整理就歸零。
      </p>
    </div>
  );
}
