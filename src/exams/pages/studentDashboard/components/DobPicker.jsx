import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
const WEEK = ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"];
const BN = "০১২৩৪৫৬৭৮৯";
const toBn = (n) => String(n).replace(/\d/g, (d) => BN[d]);
const pad = (n) => String(n).padStart(2, "0");

const parse = (v) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || "");
  return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
};

const selectCls =
  "h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm font-semibold text-slate-800 " +
  "hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30";

const navBtn =
  "grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 " +
  "disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30";

/**
 * Date-of-birth picker. value / onChange use "YYYY-MM-DD" (same as <input type="date">).
 * Future dates and today are blocked (backend rule: before:today).
 */
export default function DobPicker({ value, onChange, error, placeholder = "জন্ম তারিখ বেছে নাও" }) {
  const now = new Date();
  const T = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  const selected = parse(value);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: T.y - 17, m: 0 }); // student der gore boyosh ~17
  const wrapRef = useRef(null);

  const openPicker = () => {
    setView(selected ? { y: selected.y, m: selected.m } : { y: T.y - 17, m: 0 });
    setOpen(true);
  };

  // outside click + Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const years = useMemo(() => Array.from({ length: 71 }, (_, i) => T.y - i), [T.y]);

  const isFuture = (y, m, d) => y > T.y || (y === T.y && (m > T.m || (m === T.m && d >= T.d)));
  const atMaxMonth = view.y === T.y && view.m === T.m;
  const atMinMonth = view.y === years[years.length - 1] && view.m === 0;

  const shift = (delta) =>
    setView(({ y, m }) => {
      const n = y * 12 + m + delta;
      return { y: Math.floor(n / 12), m: ((n % 12) + 12) % 12 };
    });

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const count = new Date(view.y, view.m + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [view]);

  const pick = (d) => {
    onChange(`${view.y}-${pad(view.m + 1)}-${pad(d)}`);
    setOpen(false);
  };

  const label = selected ? `${toBn(selected.d)} ${MONTHS[selected.m]} ${toBn(selected.y)}` : "";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center rounded-lg border bg-white pl-10 pr-10 text-left text-sm transition-shadow",
          "focus-visible:outline-none focus-visible:ring-2",
          error
            ? "border-red-400 focus-visible:ring-red-200"
            : open
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-slate-200 hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
        )}
      >
        <CalendarDays
          size={16}
          className={cn("pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-500" : open ? "text-blue-600" : "text-slate-400")}
        />
        <span className={cn("truncate", label ? "font-medium text-slate-900" : "text-slate-400")}>{label || placeholder}</span>
      </button>

      {selected && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="জন্ম তারিখ মুছে ফেলো"
          className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={14} />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="জন্ম তারিখ বেছে নাও"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-40 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-3 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200"
          >
            {/* Month / year controls */}
            <div className="mb-2 flex items-center gap-1.5">
              <button type="button" onClick={() => shift(-1)} disabled={atMinMonth} aria-label="আগের মাস" className={navBtn}>
                <ChevronLeft size={16} />
              </button>
              <select
                value={view.m}
                onChange={(e) => setView((s) => ({ ...s, m: +e.target.value }))}
                aria-label="মাস"
                className={cn(selectCls, "flex-1")}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i} disabled={view.y === T.y && i > T.m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={view.y}
                onChange={(e) => {
                  const y = +e.target.value;
                  setView((s) => ({ y, m: y === T.y && s.m > T.m ? T.m : s.m }));
                }}
                aria-label="বছর"
                className={selectCls}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {toBn(y)}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => shift(1)} disabled={atMaxMonth} aria-label="পরের মাস" className={navBtn}>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center">
              {WEEK.map((w) => (
                <span key={w} className="py-1 text-[11px] font-semibold text-slate-400">
                  {w}
                </span>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((d, i) =>
                d === null ? (
                  <span key={`e${i}`} />
                ) : (
                  <button
                    key={d}
                    type="button"
                    disabled={isFuture(view.y, view.m, d)}
                    onClick={() => pick(d)}
                    aria-label={`${toBn(d)} ${MONTHS[view.m]} ${toBn(view.y)}`}
                    aria-pressed={selected?.y === view.y && selected?.m === view.m && selected?.d === d}
                    className={cn(
                      "mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      selected?.y === view.y && selected?.m === view.m && selected?.d === d
                        ? "bg-blue-600 font-bold text-white shadow-sm shadow-blue-600/30"
                        : "font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 disabled:text-slate-300 disabled:hover:bg-transparent"
                    )}
                  >
                    {toBn(d)}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}