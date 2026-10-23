import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toBanglaNumeral from "@/utils/Tobangla";

function Chip({ rowId, active, onClick, count, children }) {
  return (
    <button
      type="button"
      data-active={active}
      onClick={onClick}
      title={typeof children === "string" ? children : undefined}
      className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active ? "text-white" : "bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-200"
      }`}
    >
      {active && (
        <motion.span
          layoutId={`pill-${rowId}`}
          transition={{ type: "spring", stiffness: 500, damping: 36 }}
          className="absolute inset-0 rounded-full bg-blue-900"
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {/* সিলেক্ট করা চিপে পুরো নাম, বাকিগুলোতে শুরুর অংশ + "…" তারপর সংখ্যা */}
        <span className={active ? "whitespace-nowrap" : "block max-w-[9rem] truncate"}>{children}</span>
        {count != null && <span className="shrink-0 text-xs opacity-70">{toBanglaNumeral(count)}</span>}
      </span>
    </button>
  );
}

function Arrow({ side, onClick }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <div
      className={`pointer-events-none absolute top-0 z-10 flex h-full w-12 items-center ${
        side === "left"
          ? "left-0 justify-start bg-gradient-to-r from-white via-white/90 to-transparent dark:from-gray-900 dark:via-gray-900/90"
          : "right-0 justify-end bg-gradient-to-l from-white via-white/90 to-transparent dark:from-gray-900 dark:via-gray-900/90"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={side === "left" ? "বাঁয়ে সরাও" : "ডানে সরাও"}
        className="pointer-events-auto grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-blue-900 shadow-sm active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        <Icon size={16} />
      </button>
    </div>
  );
}

/** অনুভূমিক স্ক্রলযোগ্য চিপ লাইন। চিপ জায়গার বেশি হলেই বাঁ/ডান তীর আসে। */
export default function ChipRow({ id, items, value, onChange, allLabel = "সব", showAll = true, lead = null }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });
  const hasItems = !!items?.length;

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [hasItems, items, value, lead, update]);

  useEffect(() => {
    ref.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [value]);

  const scrollByDir = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  if (!hasItems) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto px-1 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {lead}
        {showAll && (
          <Chip rowId={id} active={value == null} onClick={() => onChange(null)}>
            {allLabel}
          </Chip>
        )}
        {items.map((it) => (
          <Chip key={it.id} rowId={id} active={value === it.id} count={it.count} onClick={() => onChange(it.id)}>
            {it.name}
          </Chip>
        ))}
      </div>

      {edge.left && <Arrow side="left" onClick={() => scrollByDir(-1)} />}
      {edge.right && <Arrow side="right" onClick={() => scrollByDir(1)} />}
    </div>
  );
}