export type NavLink = { label: string; href: string };

// 全站導覽。hash 連結一律加上 "/"，讓子頁面（如 /journal）也能正確跳回首頁對應區塊。
export const navLinks: NavLink[] = [
  { label: "精選路線", href: "/#routes" },
  { label: "私房景點", href: "/#spots" },
  { label: "旅人筆記", href: "/journal" },
  { label: "小遊戲", href: "/game" },
  { label: "關於我們", href: "/#about" },
];
