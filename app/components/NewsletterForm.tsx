"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

// 寬鬆但實用的 email 格式檢查（非完整 RFC）
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 常見信箱網域，供輸入 @ 之後自動補全
const DOMAINS = [
  "gmail.com",
  "yahoo.com.tw",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "msn.com",
  "me.com",
  "pchome.com.tw",
  "hinet.net",
];

const MAX_SUGGESTIONS = 6;

type Status = "idle" | "error" | "done";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const baseId = useId();
  const inputId = `${baseId}-input`;
  const msgId = `${baseId}-msg`;
  const listId = `${baseId}-list`;

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 依目前輸入計算網域建議
  const atIndex = email.indexOf("@");
  const hasSingleAt = atIndex !== -1 && email.indexOf("@", atIndex + 1) === -1;
  const localPart = hasSingleAt ? email.slice(0, atIndex) : "";
  const domainQuery = hasSingleAt ? email.slice(atIndex + 1).toLowerCase() : "";
  const suggestions =
    hasSingleAt && localPart
      ? DOMAINS.filter(
          (d) => d.startsWith(domainQuery) && d !== domainQuery,
        ).slice(0, MAX_SUGGESTIONS)
      : [];

  const showList = open && suggestions.length > 0;
  const safeIndex = Math.min(activeIndex, Math.max(0, suggestions.length - 1));

  // 點元件外面就收起建議清單
  useEffect(() => {
    if (!showList) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showList]);

  function applyEmail(next: string) {
    setEmail(next);
    if (status === "error") setStatus("idle");
  }

  function chooseDomain(domain: string) {
    applyEmail(`${localPart}@${domain}`);
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault(); // 選建議，不要送出表單
      chooseDomain(suggestions[safeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setOpen(false);
    const value = email.trim();

    if (!value || !EMAIL_RE.test(value)) {
      setStatus("error");
      return;
    }

    // 先不做任何儲存，只回覆「敬請期待」
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <div className="mx-auto mt-10 max-w-md sm:mt-8">
        <p
          role="status"
          className="rounded-2xl border border-forest/20 bg-cream px-6 py-5 text-sm leading-7 text-bark-soft"
        >
          <span className="font-display text-base font-semibold text-forest">
            訊號收到 ✦
          </span>
          <br />
          第一班「來自路上的信」還在打包，等它整理好，就會寄到你的信箱。
          在那之前，先把周末空下來吧——敬請期待。
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs font-semibold text-ember hover:underline sm:mt-3"
        >
          用另一個信箱再留一次
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:mt-8 sm:flex-row sm:gap-3"
      >
        <label htmlFor={inputId} className="sr-only">
          電子信箱
        </label>

        <div ref={wrapRef} className="relative flex-1">
          {/* text-base（16px）在手機上避免 iOS WebKit 聚焦輸入框時自動放大畫面 */}
          <input
            id={inputId}
            ref={inputRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              showList ? `${listId}-opt-${safeIndex}` : undefined
            }
            value={email}
            onChange={(e) => {
              applyEmail(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={(e) => {
              if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
                setOpen(false);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? msgId : undefined}
            placeholder="your@email.com"
            className={`h-14 w-full rounded-full border bg-cream px-5 text-base text-bark outline-none placeholder:text-clay focus:border-forest sm:h-12 sm:text-sm ${
              status === "error" ? "border-ember" : "border-clay/60"
            }`}
          />

          {showList && (
            <ul
              id={listId}
              role="listbox"
              className="absolute inset-x-0 z-20 mt-2 overflow-hidden rounded-2xl border border-bark/10 bg-cream py-1 text-left shadow-xl"
            >
              {suggestions.map((domain, i) => (
                <li
                  key={domain}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === safeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // 別讓 input 失焦
                    chooseDomain(domain);
                  }}
                  className={`cursor-pointer px-5 py-2.5 text-sm ${
                    i === safeIndex ? "bg-paper" : ""
                  }`}
                >
                  <span className="text-bark-soft/70">{localPart}@</span>
                  <span className="font-medium text-forest">{domain}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="h-14 rounded-full bg-ember px-7 text-base font-semibold text-cream transition-colors hover:bg-[#c96a32] sm:h-12 sm:text-sm"
        >
          訂閱
        </button>
      </form>

      {status === "error" ? (
        <p
          id={msgId}
          role="alert"
          className="mt-4 text-xs font-medium text-ember sm:mt-3"
        >
          這個信箱看起來還沒到站——再確認一下格式（像 name@example.com）好嗎？
        </p>
      ) : (
        <p className="mt-4 text-xs text-clay sm:mt-3">
          我們重視你的信箱，隨時可以取消訂閱。
        </p>
      )}
    </>
  );
}
