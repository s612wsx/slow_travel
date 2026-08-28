"use client";

import { useId, useState, type FormEvent } from "react";

// 寬鬆但實用的 email 格式檢查（非完整 RFC）
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "error" | "done";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const msgId = useId();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      return;
    }
    if (!EMAIL_RE.test(value)) {
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
        <label htmlFor="newsletter-email" className="sr-only">
          電子信箱
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? msgId : undefined}
          placeholder="your@email.com"
          className={`h-14 flex-1 rounded-full border bg-cream px-5 text-base text-bark outline-none placeholder:text-clay focus:border-forest sm:h-12 sm:text-sm ${
            status === "error" ? "border-ember" : "border-clay/60"
          }`}
        />
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
