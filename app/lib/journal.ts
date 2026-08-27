export type JournalArticle = {
  slug: string;
  theme: "山" | "海" | "城市";
  themeEn: string;
  kind: string;
  date: string;
  readingTime: string;
  location: string;
  title: string;
  excerpt: string;
  image: string;
  pullQuote: string;
  body: string[];
};

export const articles: JournalArticle[] = [
  {
    slug: "mountain-slow-time",
    theme: "山",
    themeEn: "Mountain",
    kind: "慢旅筆記",
    date: "2026 · 08",
    readingTime: "約 6 分鐘",
    location: "嘉義 · 阿里山",
    title: "上山以後，時間會自己慢下來",
    excerpt:
      "海拔每上升一百公尺，氣溫掉半度，腳步也跟著慢半拍。山不趕人，你只要跟上它的呼吸就好。",
    image: "/images/alishan-sea-of-clouds.jpg",
    pullQuote: "在山上，最奢侈的行程就是坐著，看雲把整座山谷填滿，再慢慢退去。",
    body: [
      "接駁車在清晨四點半發動。車上大多是睡眠不足的旅人，額頭抵著冰涼的車窗，沒有人說話。海拔一路往上，窗外的溫度計從二十六度慢慢掉到十四度，我把外套拉鍊拉到最頂。",
      "下車後走進林道，世界忽然安靜下來。檜木的氣味很重，腳下是濕潤的木棧道，兩側的蕨類還掛著昨夜的水氣。我本來想快步趕到觀景台，走沒幾分鐘就放棄了——這裡的每一段路，都像在提醒你不必急。",
      "等日出，其實是在等雲。天光一點一點亮起來，山谷裡的雲海開始翻動，先漫過對面的稜線，再一路湧到腳邊，然後又在幾分鐘內散開。旁邊的阿姨小聲說，她來第三次才看到這個。我們都沒有再說話。",
      "回程在山腰的小店喝了一杯熱紅茶。老闆說他在這裡住了二十年，最喜歡的還是起霧的午後：「那時候整座山都是你的，因為別人都下山了。」他講得很淡，我卻記了很久。",
      "下山那天下午，我回到城市，站在捷運月台上，忽然發現自己還在用山上的節奏走路。那種慢不是懶散，比較像是終於願意把每一步都好好走完。",
    ],
  },
  {
    slug: "sea-no-itinerary",
    theme: "海",
    themeEn: "Sea",
    kind: "海線散策",
    date: "2026 · 07",
    readingTime: "約 5 分鐘",
    location: "屏東 · 恆春半島",
    title: "海邊沒有行程表，只有潮汐",
    excerpt:
      "問在地人幾點看海最好，他只說：退潮就來。海不看時鐘，它看月亮。",
    image: "/images/kenting-coast.jpg",
    pullQuote: "你不需要懂海。只要在岸邊待得夠久，海自然會告訴你，今天適不適合下水。",
    body: [
      "我在恆春租了一台舊機車，沿著海岸線往南騎。風是鹹的，安全帽裡灌滿海的味道，柏油路一路貼著太平洋，右手邊是整片藍到發亮的水。",
      "找了一段沒有名字的礁岩坐下來。浪一波一波打上來，節奏比想像中規律——七、八秒一次，像某種很有耐心的呼吸。我原本打算待十分鐘，結果坐了快一個小時。",
      "退潮之後，潮間帶露出來，石縫裡全是小生物。寄居蟹拖著借來的殼慢慢挪動，海葵縮成一團。蹲著看牠們的時候，完全忘記自己原本排了什麼行程。",
      "傍晚繞到漁港，剛好遇到船進港。一位曬得很黑的船長邊收網邊跟我聊，他說看海不用什麼技巧：「你站久一點就知道了，海會告訴你今天能不能出門。」說這句話的時候，他的眼睛一直看著水面。",
      "那天晚上回到民宿，我把手錶收進背包最底層。接下來三天，我唯一在意的時間，是漲潮和退潮。",
    ],
  },
  {
    slug: "slow-stranger-city",
    theme: "城市",
    themeEn: "City",
    kind: "城市慢走",
    date: "2026 · 06",
    readingTime: "約 5 分鐘",
    location: "台北 · 大稻埕",
    title: "在城市裡，當一個慢慢走的外地人",
    excerpt:
      "把導航關掉，讓巷子帶路。城市的細節，只對願意走路的人打開。",
    image: "/images/taipei-101-skyline.jpg",
    pullQuote: "觀光是把清單一項項打勾；旅行是願意為一扇好看的窗，停下來三分鐘。",
    body: [
      "這趟我決定不搭捷運，全程用走的。從大稻埕的迪化街開始，一路往南。台北的地圖在腳下攤開，比在手機裡看清楚得多。",
      "老街的立面很好看：洗石子、山牆、褪色的行號招牌。南北貨店門口堆著乾香菇和紅棗，氣味濃得像一面牆。我在一間街角咖啡停下來，只因為它的木窗框顏色剛好。",
      "廟埕前有幾位阿伯在下棋，旁邊圍著更多不下棋、只出意見的人。我買了一份報紙坐在石階上，假裝在看，其實在聽他們拌嘴。這種時刻，觀光客通常會直接走過去。",
      "黃昏往東走，爬上象山。天際線的燈一盞一盞亮起來，101 先亮，接著是整片盆地。旁邊全是喘著氣的人，卻沒有人急著下山，大家就站在那裡，看城市慢慢變成另一個樣子。",
      "回程的路上我在想，原來城市也可以很慢。慢的關鍵不在它，在你願不願意為了一扇窗、一盤棋、一片天光，停下來三分鐘。",
    ],
  },
];

export function getArticle(slug: string): JournalArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

// 主題對應的色票（沿用全站自然色調）
export const themeChipClass: Record<JournalArticle["theme"], string> = {
  山: "bg-forest text-cream",
  海: "bg-sage text-cream",
  城市: "bg-clay text-bark",
};
