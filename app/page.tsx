import Image from "next/image";
import Link from "next/link";
// 滾動視差與進場動畫元件（client component）
import { Parallax, Reveal } from "./components/Parallax";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { SpotRoulette } from "./components/SpotRoulette";
import { TravellerWelcome } from "./components/TravellerWelcome";
import { NewsletterForm } from "./components/NewsletterForm";
import { navLinks } from "./lib/site";
import { articles } from "./lib/journal";

const routes = [
  {
    no: "01",
    region: "南投 · 山線",
    title: "清境高山草原散步",
    desc: "海拔一千七的青青草原，綿羊低頭吃草，午後常有雲從山谷慢慢漫上來。",
    time: "2 天 1 夜",
    tags: ["高山", "草原", "看雲海"],
    image: "/images/qingjing-farm.jpg",
  },
  {
    no: "02",
    region: "屏東 · 海線",
    title: "墾丁南岬的海風慢騎",
    desc: "沿著南部海岸線，珊瑚礁岩、燈塔與整片太平洋。傍晚在最南點看夕陽沉進海裡。",
    time: "1 日輕旅",
    tags: ["海岸", "單車", "燈塔"],
    image: "/images/kenting-coast.jpg",
  },
  {
    no: "03",
    region: "台東 · 縱谷",
    title: "池上伯朗大道的稻浪",
    desc: "一條沒有電線桿的田間小路，兩側是換季中的稻田，風一吹就像海浪。",
    time: "半日程",
    tags: ["稻田", "攝影", "單車"],
    image: "/images/chishang-brown-avenue.jpg",
  },
];

const spots = [
  {
    name: "牡丹車站",
    place: "新北 · 雙溪",
    note: "月台彎成一道弧線，鐵道迷心中的祕境小站。",
  },
  {
    name: "水漾森林",
    place: "南投 · 杉林溪",
    note: "地震造成的堰塞湖，枯木立在水面，像一幅靜物畫。",
  },
  {
    name: "神祕海岸",
    place: "新北 · 金山",
    note: "退潮時才會現身的岩石廊道，記得先查潮汐表。",
  },
  {
    name: "武界壩",
    place: "南投 · 仁愛",
    note: "清晨的濁水溪谷有薄霧與部落炊煙，被稱為雲的故鄉。",
  },
];

/**
 * 地形等高線背景：以確定性函數生成多組同心的不規則等高線，
 * 搭配一條虛線「步道」與山頂標記，營造旅行地圖 / 田野筆記的質感。
 * 所有座標皆為確定性計算（不使用亂數），避免 SSR / CSR 不一致。
 */
function ContourBackground({ className = "" }: { className?: string }) {
  const wobble = (a: number, seed: number) =>
    Math.sin(a * 3 + seed) * 0.055 +
    Math.sin(a * 5 - seed * 1.7) * 0.03 +
    Math.sin(a * 2 + seed * 0.6) * 0.045;

  const ring = (cx: number, cy: number, r: number, seed: number) => {
    const steps = 60;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const rr = r * (1 + wobble(a, seed));
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr * 0.8;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d + "Z";
  };

  const clusters = [
    { cx: 118, cy: 86, seed: 0.4, rings: 7, step: 15 },
    { cx: 486, cy: 292, seed: 2.3, rings: 9, step: 14 },
    { cx: 322, cy: 168, seed: 4.6, rings: 4, step: 19 },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {clusters.map((c, ci) => (
        <g key={ci}>
          <path
            d={ring(c.cx, c.cy, c.step * 0.7, c.seed)}
            fill="currentColor"
            fillOpacity="0.06"
            stroke="none"
          />
          {Array.from({ length: c.rings }).map((_, i) => (
            <path
              key={i}
              d={ring(c.cx, c.cy, (i + 1) * c.step, c.seed + i * 0.12)}
              strokeWidth={i % 4 === 0 ? 1.6 : 0.85}
              strokeOpacity={i % 4 === 0 ? 1 : 0.6}
            />
          ))}
          <circle
            cx={c.cx}
            cy={c.cy}
            r="2.2"
            fill="currentColor"
            stroke="none"
          />
        </g>
      ))}

      {/* 虛線步道 */}
      <path
        d="M-24 356 C 80 320, 132 236, 214 210 S 356 176, 402 104 S 512 30, 636 58"
        strokeWidth="1.5"
        strokeDasharray="0.5 8"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      {[
        [214, 210],
        [402, 104],
      ].map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="3.4"
          strokeWidth="1.4"
          fill="none"
        />
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-cream">
      {/* ---------- Header ---------- */}
      <SiteHeader navLinks={navLinks} />
      <TravellerWelcome />

      <main id="top" className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <Parallax
            speed={0.12}
            className="pointer-events-none absolute inset-x-0 -inset-y-28"
          >
            <ContourBackground className="h-full w-full text-forest/[0.14]" />
          </Parallax>
          <Parallax
            speed={0.28}
            className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-ember-soft/30 blur-3xl"
          >
            <span className="sr-only">裝飾光暈</span>
          </Parallax>
          <Parallax
            speed={-0.2}
            className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sage/25 blur-3xl"
          >
            <span className="sr-only">裝飾光暈</span>
          </Parallax>

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-clay/50 bg-paper px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bark-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                週末提案 · 2026 夏
              </span>

              <h1 className="mt-6 font-display text-[2rem] font-semibold leading-[1.15] tracking-tight text-forest sm:text-5xl sm:leading-[1.1] md:text-6xl">
                把日常放下，
                <br />
                今天，我們去哪裡？
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-bark-soft sm:text-lg">
                一本溫暖清新的旅行雜誌式指南。收集海線與山線的私房路線、
                藏在小鎮裡的風景，以及旅人一路寫下的筆記——
                翻開它，然後出發。
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#routes"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ember px-7 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-[#c96a32] sm:w-auto"
                >
                  開始探索路線
                </a>
                <a
                  href="#journal"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-forest/30 px-7 text-sm font-semibold text-forest transition-colors hover:bg-paper sm:w-auto"
                >
                  讀一篇旅人筆記
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <SpotRoulette />
                <span className="text-sm text-bark-soft">
                  一時想不到？讓它替你決定。
                </span>
              </div>

              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 sm:mt-12 sm:gap-10">
                {[
                  ["128", "條收錄路線"],
                  ["36", "個私房小站"],
                  ["每週三", "更新旅誌"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <dt className="font-display text-2xl font-semibold text-forest sm:text-3xl">
                      {num}
                    </dt>
                    <dd className="mt-1 text-sm text-bark-soft">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 照片拼貼（各層有不同視差速度） */}
            <div className="relative mx-auto h-[340px] w-full max-w-[20rem] sm:h-[400px] sm:max-w-sm md:h-[420px]">
              <Parallax
                speed={0.16}
                className="absolute left-0 top-4 w-40 sm:top-6 sm:w-48 md:w-52"
              >
                <figure className="-rotate-6 rounded-sm bg-white p-2.5 shadow-lg shadow-bark/15 sm:p-3">
                  <div className="relative h-32 w-full overflow-hidden rounded-sm sm:h-40">
                    <Image
                      src="/images/alishan-sea-of-clouds.jpg"
                      alt="阿里山日出雲海"
                      fill
                      sizes="(max-width: 768px) 55vw, 210px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="pt-2 text-center font-display text-sm text-bark-soft">
                    阿里山 · 雲海
                  </figcaption>
                </figure>
              </Parallax>

              <Parallax
                speed={0.34}
                className="absolute right-0 top-0 w-36 sm:w-44 md:w-48"
              >
                <figure className="rotate-6 rounded-sm bg-white p-2.5 shadow-lg shadow-bark/15 sm:p-3">
                  <div className="relative h-28 w-full overflow-hidden rounded-sm sm:h-36">
                    <Image
                      src="/images/gaomei-wetland.jpg"
                      alt="高美濕地夕陽"
                      fill
                      sizes="(max-width: 768px) 50vw, 190px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="pt-2 text-center font-display text-sm text-bark-soft">
                    高美濕地 · 夕陽
                  </figcaption>
                </figure>
              </Parallax>

              <Parallax
                speed={0.07}
                className="absolute bottom-0 left-4 w-44 sm:left-8 sm:w-52 md:w-56"
              >
                <figure className="rotate-3 rounded-sm bg-white p-2.5 shadow-xl shadow-bark/20 sm:p-3">
                  <div className="relative h-36 w-full overflow-hidden rounded-sm sm:h-44">
                    <Image
                      src="/images/taroko-gorge.jpg"
                      alt="太魯閣峽谷"
                      fill
                      sizes="(max-width: 768px) 60vw, 220px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="pt-2 text-center font-display text-sm text-bark-soft">
                    太魯閣 · 立霧溪
                  </figcaption>
                </figure>
              </Parallax>

              <Parallax
                speed={0.44}
                className="absolute right-0 bottom-10 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ember shadow sm:-right-4 sm:bottom-16"
              >
                ✦ 本週精選
              </Parallax>
            </div>
          </div>
        </section>

        {/* ---------- Featured routes ---------- */}
        <section id="routes" className="border-t border-bark/10 bg-paper/60">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
                  Featured Routes
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
                  本週精選路線
                </h2>
              </div>
              <a
                href="#routes"
                className="text-sm font-semibold text-ember hover:underline"
              >
                看全部 128 條 →
              </a>
            </div>

            <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((route, i) => (
                <Reveal key={route.no} delay={i * 90}>
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-bark/10 bg-cream transition-transform hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={route.image}
                      alt={route.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-forest-deep/10 to-transparent" />
                    <span className="absolute left-4 top-4 font-display text-3xl font-semibold text-cream drop-shadow">
                      {route.no}
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-forest">
                      {route.time}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-clay">
                      {route.region}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-forest">
                      {route.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-bark-soft">
                      {route.desc}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {route.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-clay/50 bg-paper px-3 py-1 text-xs text-bark-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Secret spots ---------- */}
        <section
          id="spots"
          className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 md:py-24"
        >
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
                Secret Spots
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
                藏在地圖角落的
                <br />
                私房景點
              </h2>
              <p className="mt-5 text-base leading-8 text-bark-soft">
                有些地方 Google 上找不到照片，卻值得你為它繞一段路。
                我們把這些名字寫下來，留給願意慢下來的人。
              </p>
              <a
                href="#newsletter"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
              >
                收藏私房清單
              </a>
            </div>

            <ul className="divide-y divide-bark/10 border-y border-bark/10">
              {spots.map((spot) => (
                <li
                  key={spot.name}
                  className="flex items-start gap-5 py-5 transition-colors hover:bg-paper/60"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-ember" />
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="font-display text-xl font-semibold text-forest">
                        {spot.name}
                      </h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-clay">
                        {spot.place}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-7 text-bark-soft">
                      {spot.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Manifesto band ---------- */}
        <section
          id="about"
          className="relative overflow-hidden bg-forest text-cream"
        >
          <Image
            src="/images/sun-moon-lake.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="pointer-events-none absolute inset-0 object-cover opacity-20"
          />
          <div className="pointer-events-none absolute inset-0 bg-forest/60" />
          <Parallax
            speed={-0.15}
            className="pointer-events-none absolute inset-x-0 -inset-y-24"
          >
            <ContourBackground className="h-full w-full text-cream/[0.16]" />
          </Parallax>
          <Parallax
            speed={0.08}
            className="relative mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-20 md:py-24"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-soft">
              Our Little Manifesto
            </p>
            <blockquote className="mt-6 font-display text-2xl font-medium leading-[1.4] sm:text-3xl md:text-4xl">
              「旅行不一定要走得遠。
              <br />
              只要願意用好奇的眼睛，重新看一次身邊的風景。」
            </blockquote>
            <p className="mt-8 text-sm text-cream/70">
              —— 今天去哪裡編輯室，寫於一個下著小雨的午後
            </p>
          </Parallax>
        </section>

        {/* ---------- Journal ---------- */}
        <section
          id="journal"
          className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 md:py-24"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
                Journal
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-forest sm:text-4xl">
                旅人筆記
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-sm font-semibold text-ember hover:underline"
            >
              翻閱更多 →
            </Link>
          </div>

          <div className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((post, i) => (
              <Reveal key={post.slug} delay={i * 90} className="flex">
              <article className="flex flex-col">
                <Link
                  href={`/journal/${post.slug}`}
                  className="group block h-40 overflow-hidden rounded-2xl"
                >
                  <Parallax
                    speed={0.05}
                    className="relative -mt-5 h-[calc(100%+2.5rem)] w-full"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Parallax>
                </Link>
                <div className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-clay">
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-clay" />
                  <span>{post.kind}</span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold leading-8 text-forest">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="transition-colors hover:text-ember"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-7 text-bark-soft">
                  {post.excerpt}
                </p>
                <Link
                  href={`/journal/${post.slug}`}
                  className="mt-4 text-sm font-semibold text-ember hover:underline"
                >
                  繼續讀 →
                </Link>
              </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Newsletter ---------- */}
        <section id="newsletter" className="border-t border-bark/10 bg-paper/60">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20 md:py-24">
            <h2 className="font-display text-3xl font-semibold text-forest sm:text-4xl">
              每週三，收一封來自路上的信
            </h2>
            <p className="mt-4 text-base leading-8 text-bark-soft">
              一條精選路線、一個私房小站、一段旅人筆記。
              沒有廣告，只有想與你分享的風景。
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <SiteFooter />
    </div>
  );
}
