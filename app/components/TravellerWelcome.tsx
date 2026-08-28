"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const NAME_KEY = "traveller-name";
const SKIP_KEY = "traveller-name-skipped";
const COLLAPSED_KEY = "traveller-bar-collapsed";

export function TravellerWelcome() {
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 初次載入：從 localStorage 讀回狀態；沒有稱呼也沒略過，就跳出詢問 modal
  useEffect(() => {
    let savedName: string | null = null;
    let savedSkip = false;
    let savedCollapsed = false;
    try {
      savedName = window.localStorage.getItem(NAME_KEY);
      savedSkip = window.localStorage.getItem(SKIP_KEY) === "1";
      savedCollapsed = window.localStorage.getItem(COLLAPSED_KEY) === "1";
    } catch {
      // 無痕視窗等情況：localStorage 不可用，維持預設
    }
    setName(savedName);
    setSkipped(savedSkip);
    setCollapsed(savedCollapsed);
    setPromptOpen(!savedName && !savedSkip);
    setHydrated(true);
  }, []);

  function write(key: string, value: string | null) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch {}
  }

  function collapseBar() {
    setCollapsed(true);
    write(COLLAPSED_KEY, "1");
  }

  function expandBar() {
    setCollapsed(false);
    write(COLLAPSED_KEY, null);
  }

  // 「先不用了」：編輯既有稱呼時只是取消；還沒取名時才記錄略過
  function skip() {
    if (name) {
      setPromptOpen(false);
      return;
    }
    write(SKIP_KEY, "1");
    setSkipped(true);
    setPromptOpen(false);
  }

  // 「清除稱呼」：刪除並儲存，之後不再主動跳問候
  function clearName() {
    write(NAME_KEY, null);
    write(SKIP_KEY, "1");
    write(COLLAPSED_KEY, null);
    setName(null);
    setSkipped(true);
    setCollapsed(false);
    setDraft("");
    setPromptOpen(false);
  }

  // modal 開啟時：鎖背景捲動、聚焦輸入框、Esc 關閉
  useEffect(() => {
    if (!promptOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [promptOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim().slice(0, 20);
    if (!trimmed) return;
    write(NAME_KEY, trimmed);
    write(SKIP_KEY, null);
    write(COLLAPSED_KEY, null);
    setName(trimmed);
    setSkipped(false);
    setCollapsed(false);
    setPromptOpen(false);
  }

  function openPrompt() {
    setDraft(name ?? "");
    setPromptOpen(true);
  }

  // 尚未讀取 localStorage 前不渲染，避免 SSR / CSR 內容不一致
  if (!hydrated) return null;

  const showBar = !promptOpen && (name !== null || skipped);

  return (
    <>
      {showBar && collapsed && (
        <div className="border-b border-bark/10 bg-paper/70">
          <div className="mx-auto flex w-full max-w-6xl justify-end px-5 py-1.5 sm:px-6">
            <button
              type="button"
              onClick={expandBar}
              className="text-xs font-semibold text-bark-soft/80 transition-colors hover:text-ember"
            >
              {name ? `旅人 · ${name}` : "旅人問候"} ⌄
            </button>
          </div>
        </div>
      )}

      {showBar && !collapsed && (
        <div className="border-b border-bark/10 bg-paper/70">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-2.5 text-sm sm:px-6">
            {name ? (
              <p className="flex-1 leading-6 text-bark-soft">
                <span className="font-semibold text-forest">{name}</span>
                ，歡迎上路。今天想往山裡走，還是往海邊？
              </p>
            ) : (
              <p className="flex-1 leading-6 text-bark-soft">
                路上還沒有你的名字——要不要留一個？
              </p>
            )}
            <button
              type="button"
              onClick={openPrompt}
              className="shrink-0 font-semibold text-ember hover:underline"
            >
              {name ? "換個稱呼" : "留下稱呼"}
            </button>
            <button
              type="button"
              aria-label="收起問候列"
              onClick={collapseBar}
              className="shrink-0 text-base leading-none text-bark-soft/70 transition-colors hover:text-bark"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {promptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={skip}
        >
          <div className="animate-overlay-in absolute inset-0 bg-bark/50 backdrop-blur-sm" />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-in relative w-full max-w-md overflow-hidden rounded-2xl border border-bark/10 bg-cream shadow-2xl"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-forest via-sage to-ember" />

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
                {name ? "換個名字上路" : "出發之前"}
              </p>
              <h2
                id="welcome-title"
                className="mt-3 font-display text-2xl font-semibold text-forest sm:text-3xl"
              >
                旅人，該怎麼稱呼你？
              </h2>
              <p className="mt-3 text-sm leading-7 text-bark-soft">
                {name
                  ? "想換個名字上路，隨時都可以。改完之後，我們會記得新的稱呼。"
                  : "路上總要有個名字。留一個，我們就從這裡開始——之後每次回來，都會記得你。"}
              </p>

              <label htmlFor="traveller-name-input" className="sr-only">
                你的稱呼
              </label>
              {/* text-base（16px）在手機上避免 iOS WebKit 聚焦輸入框時自動放大畫面 */}
              <input
                id="traveller-name-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={20}
                placeholder="例如：小綠、阿海、山風……"
                className="mt-5 h-12 w-full rounded-full border border-clay/60 bg-white px-5 text-base text-bark outline-none placeholder:text-clay focus:border-forest sm:text-sm"
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ember px-5 text-sm font-semibold text-cream transition-colors hover:bg-[#c96a32] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                >
                  {name ? "更新稱呼" : "出發"}
                </button>
                <button
                  type="button"
                  onClick={skip}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-forest/30 px-5 text-sm font-semibold text-forest transition-colors hover:bg-paper sm:w-auto"
                >
                  {name ? "取消" : "先不用了"}
                </button>
              </div>

              {name && (
                <button
                  type="button"
                  onClick={clearName}
                  className="mt-4 block w-full text-center text-xs font-semibold text-bark-soft/70 transition-colors hover:text-ember hover:underline"
                >
                  清除稱呼，重新當個路人
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
