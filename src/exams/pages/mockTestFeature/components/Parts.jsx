import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fromBn, toBn } from "./Utils";


const spring = { type: "spring", stiffness: 520, damping: 32 };
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8] focus-visible:ring-offset-1";

/** Round tick box. state: none | some | all */
export function Checkbox({ state = "none", disabled, onChange, label }) {
  const on = state !== "none";
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={state === "some" ? "mixed" : on}
      aria-label={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
        focusRing,
        on ? "border-[#3558E8] bg-[#3558E8] text-white" : "border-[#B8C3DA] bg-white",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <AnimatePresence initial={false}>
        {on && (
          <motion.span key={state} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
            {state === "all" ? <Check className="size-3" strokeWidth={4} /> : <Minus className="size-3" strokeWidth={4} />}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function PrimaryButton({ className, children, noArrow, ...props }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#3558E8] px-5 py-2.5 text-sm font-bold text-white",
        "shadow-[0_4px_12px_rgba(53,88,232,0.32)] transition-colors hover:bg-[#2A49CB]",
        "disabled:cursor-not-allowed disabled:bg-[#DCE3F0] disabled:text-[#8A96AD] disabled:shadow-none",
        focusRing,
        className
      )}
    >
      {children}
      {!noArrow && <ArrowRight className="size-4" strokeWidth={2.5} />}
    </motion.button>
  );
}

export function SecondaryButton({ className, children, ...props }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#3558E8] bg-white px-4 py-2.5 text-sm font-bold text-[#3558E8]",
        "transition-colors hover:bg-[#E6ECFF] disabled:cursor-not-allowed disabled:border-[#DCE3F0] disabled:text-[#8A96AD] disabled:hover:bg-white",
        focusRing,
        className
      )}
    >
      {children}
    </motion.button>
  );
}

/**
 * Bottom action bar (navbar style).
 * MockTestPage renders an empty `sticky bottom-0` host that is as wide as the page area
 * (so it starts right after your left sidebar). Every step teleports its bar into that host,
 * which gives a full-width bar flush with the bottom edge, with the content centred inside.
 */
export const DockContext = createContext(null);


export function BottomBar({ children }) {
  const host = useContext(DockContext);
  if (!host) return null;

  return createPortal(
    <motion.div
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
      className="lg:sticky fixed bottom-0 z-30 mt-4 w-full border-t border-[#DCE3F0] bg-white shadow-[0_-6px_20px_rgba(15,35,64,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex w-full  items-center gap-2 px-3 py-2.5 sm:px-5">{children}</div>
    </motion.div>,
    host
  );
}

export function Chip({ selected, disabled, onClick, children, count, className }) {
  return (
    <motion.button
      type="button"
      layout
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
        focusRing,
        selected ? "border-[#3558E8] bg-[#3558E8] text-white" : "border-[#DCE3F0] bg-white text-[#0F2340] hover:border-[#3558E8]/50",
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {selected && <Check className="size-3" strokeWidth={4} />}
      <span>{children}</span>
      {count != null && <span className={cn("text-[11px] tabular-nums", selected ? "text-white/80" : "text-[#62708A]")}>{toBn(count)}</span>}
    </motion.button>
  );
}

/** Subjects already added, shown as removable chips. items: [{ id, title, n }] */
export function AddedStrip({ items, onOpen, onRemove }) {
  if (!items.length) return null;
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-[#62708A]">যোগ করা:</span>
      <AnimatePresence initial={false}>
        {items.map((o) => (
          <motion.span
            key={o.id}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={spring}
            className="inline-flex items-center rounded-full bg-white py-0.5 pl-3 pr-0.5 text-xs ring-1 ring-[#DCE3F0]"
          >
            <button type="button" onClick={() => onOpen(o)} className={cn("rounded-full font-medium", focusRing)}>
              {o.title} <span className="text-[#62708A]">· {toBn(o.n)}টি নির্বাচন</span>
            </button>
            <button
              type="button"
              aria-label={`${o.title} বাদ দাও`}
              onClick={() => onRemove(o.id)}
              className={cn("ml-1 grid size-5 place-items-center rounded-full text-[#62708A] hover:bg-[#E9EEF8]", focusRing)}
            >
              <X className="size-3" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

const STEPS = [
  { n: 1, label: "টপিক" },
  { n: 2, label: "সেটআপ" },
];

/** Compact one-row header: back · title · 2-step indicator */
export function WizardHeader({ step, title, subtitle, onBack }) {
  return (
    <header className="mb-4 flex items-center gap-3">
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        aria-label="আগের ধাপে যাও"
        className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#0F2340] ring-1 ring-[#DCE3F0] hover:bg-[#E9EEF8]", focusRing)}
      >
        <ArrowLeft className="size-4" strokeWidth={2.5} />
      </motion.button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-bold leading-tight sm:text-base">{title}</h1>
        {subtitle && <p className="truncate text-xs text-[#62708A]">{subtitle}</p>}
      </div>

      <ol className="flex shrink-0 items-center" aria-label="ধাপসমূহ">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const cur = step === s.n;
          return (
            <li key={s.n} aria-current={cur ? "step" : undefined} className="flex items-center">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-[11px] font-bold transition-colors duration-200",
                  done && "bg-[#FFC93C] text-[#0F2340]",
                  cur && "bg-[#0F2340] text-white",
                  !done && !cur && "bg-white text-[#62708A] ring-1 ring-[#DCE3F0]"
                )}
              >
                {done ? <Check className="size-3" strokeWidth={4} /> : toBn(s.n)}
              </span>
              <span className={cn("ml-1.5 hidden text-xs font-semibold sm:inline", cur ? "text-[#0F2340]" : "text-[#62708A]")}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <span className="relative mx-2 h-0.5 w-6 overflow-hidden rounded-full bg-[#DCE3F0]">
                  <motion.span
                    className="absolute inset-0 origin-left bg-[#FFC93C]"
                    initial={false}
                    animate={{ scaleX: step > s.n ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </header>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-2xl bg-[#E4EAF5]", className)} />;
}

export function ErrorBox({ onRetry, text = "ডাটা লোড করা যায়নি।" }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
      {text}{" "}
      <button type="button" onClick={onRetry} className="font-bold underline">
        আবার চেষ্টা করো
      </button>
    </div>
  );
}

/** Bare number input: accepts Bangla digits and lets you clear the field while typing. */
export function NumberField({ value, onChange, min = 1, max = 999, label, className }) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => {
    if (Number(raw) !== value) setRaw(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      aria-label={label}
      inputMode="numeric"
      value={raw}
      onChange={(e) => {
        const v = fromBn(e.target.value).replace(/\D/g, "").slice(0, 3);
        setRaw(v);
        if (v !== "") onChange(Math.min(max, Math.max(min, Number(v))));
      }}
      onBlur={() => setRaw(String(value))}
      className={cn("w-14 bg-transparent text-center text-xl font-bold tabular-nums outline-none", className)}
    />
  );
}

/** − 25 + control */
export function Stepper({ value, onChange, min = 1, max = 999, step = 1, unit, label }) {
  const btn = cn(
    "grid size-9 place-items-center rounded-lg bg-white text-[#0F2340] shadow-sm ring-1 ring-[#DCE3F0] transition-colors hover:bg-[#E6ECFF] disabled:opacity-40",
    focusRing
  );
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#E9EEF8] p-1">
      <motion.button type="button" whileTap={{ scale: 0.88 }} aria-label={`${label} কমাও`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - step))} className={btn}>
        <Minus className="size-4" strokeWidth={2.5} />
      </motion.button>
      <div className="flex items-baseline gap-1">
        <NumberField label={label} value={value} min={min} max={max} onChange={onChange} />
        <span className="text-xs font-medium text-[#62708A]">{unit}</span>
      </div>
      <motion.button type="button" whileTap={{ scale: 0.88 }} aria-label={`${label} বাড়াও`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + step))} className={btn}>
        <Plus className="size-4" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors", focusRing, checked ? "justify-end bg-[#3558E8]" : "justify-start bg-[#B8C3DA]")}
    >
      <motion.span layout transition={spring} className="size-5 rounded-full bg-white shadow" />
    </button>
  );
}

/** Mobile bottom sheet (swipe down, tap outside or Esc to close). */
export function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose();

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-[#0F2340]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[78vh] flex-col rounded-t-3xl bg-white px-4 pt-2 pb-6 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
          >
            {/* Fixed Header */}
            <div className="shrink-0">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#DCE3F0]" />

              {title && (
                <h2 className="mb-3 text-base font-bold text-[#0F2340]">
                  {title}
                </h2>
              )}
            </div>

            {/* Only Content Scrolls */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>

            {/* Fixed Footer */}
            <div className="shrink-0 pt-4">
              <PrimaryButton
                noArrow
                className="w-full"
                onClick={onClose}
              >
                হয়েছে
              </PrimaryButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}