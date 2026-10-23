import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bot, Check, Copy, RotateCcw, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
// >>> apnar existing parseHtmlContent() er path ekhane din (ager moto) <<<
import { parseHtmlContent } from "./../../../../utils/parseHtmlContent";
import AuthImage from "./AuthImage";

/** ধীরে ধীরে লেখা (typewriter). Uttor ashar por client e animate hoy. */
function useTypewriter(text, enabled, onTick, onDone) {
  const [n, setN] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) { setN(text.length); return; }
    let raf, last = 0, cur = 0;
    const step = Math.max(4, Math.ceil(text.length / 80));
    const loop = (t) => {
      if (t - last >= 50) {
        last = t;
        cur = Math.min(text.length, cur + step);
        setN(cur);
        onTick?.();
      }
      if (cur < text.length) raf = requestAnimationFrame(loop);
      else onDone?.();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled]);

  return n;
}

const iconBtn =
  "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40";

function AssistantBody({ msg, onTick, onDone, onFeedback, onShare }) {
  const [copied, setCopied] = useState(false);
  const proseRef = useRef(null);
  const n = useTypewriter(msg.content, !!msg.fresh, onTick, onDone);
  const done = n >= msg.content.length;
  const fb = msg.feedback || null;
  const canAct = typeof msg.id === "number";

  useLayoutEffect(() => {
    const el = proseRef.current;
    if (el) el.style.setProperty("--ai-font", getComputedStyle(el).fontFamily);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-w-0 flex-1">
      <div ref={proseRef} >
        {parseHtmlContent(msg.content.slice(0, n))}
        {!done && <span className="ai-caret" />}
      </div>

      {done && (
        <div className="mt-2 flex flex-wrap items-center gap-0.5 text-gray-400">
          <button onClick={copy} aria-label="Copy" className={iconBtn}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>

          {onFeedback && canAct && (
            <>
              <button
                onClick={() => onFeedback(msg, fb === "like" ? null : "like")}
                aria-label="ভালো উত্তর" aria-pressed={fb === "like"} title="ভালো উত্তর"
                className={`${iconBtn} ${fb === "like" ? "!text-blue-600" : ""}`}
              >
                <ThumbsUp size={14} fill={fb === "like" ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => onFeedback(msg, fb === "dislike" ? null : "dislike")}
                aria-label="ভালো না" aria-pressed={fb === "dislike"} title="ভালো না"
                className={`${iconBtn} ${fb === "dislike" ? "!text-red-600" : ""}`}
              >
                <ThumbsDown size={14} fill={fb === "dislike" ? "currentColor" : "none"} />
              </button>
            </>
          )}

          {onShare && (
            <button onClick={onShare} aria-label="শেয়ার" title="চ্যাট শেয়ার করুন" className={iconBtn}>
              <Share2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AIMessage({ msg, onRetry, onImage, onTick, onDone, onFeedback, onShare }) {
  if (msg.role === "user") {
    return (
      <div className="ai-fade-up flex flex-col items-end gap-1.5">
        {msg.images?.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {msg.images.map((src) => (
              <AuthImage key={src} src={src} onClick={onImage} className="h-28 w-28 rounded-2xl" />
            ))}
          </div>
        )}
        {msg.content && (
          <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl rounded-br-lg bg-gray-100 px-4 py-2.5 text-[15px] leading-relaxed text-gray-900">
            {msg.content}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ai-fade-up ">
      <div className="mb-4 mt-1 flex items-center gap-2">
        {/* Logo */}
        <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-slate-900">
          <img
            src="/favicon.ico"
            alt="Pori AI"
            className="h-7 w-7 object-contain"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
        </div>

        {/* Name & Subtitle */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col  items-start justify-center gap-1">
            <h3 className="inline-flex items-center justify-center gap-0.5 rounded-md border border-blue-100 bg-gray-50 h-4 w-12 text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
              Pori AI
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
              তোমার স্মার্ট স্টাডি পার্টনার
            </p>
          </div>

        </div>
      </div>
      {msg.error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {msg.content}
          {onRetry && (
            <button onClick={onRetry} className="mt-2 flex items-center gap-1 font-medium underline">
              <RotateCcw size={14} /> আবার চেষ্টা করুন
            </button>
          )}
        </div>
      ) : (
        <AssistantBody msg={msg} onTick={onTick} onDone={onDone} onFeedback={onFeedback} onShare={onShare} />
      )}
    </div>
  );
}

export default memo(AIMessage);