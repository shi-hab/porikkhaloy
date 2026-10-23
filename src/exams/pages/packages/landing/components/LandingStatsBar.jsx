import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { parseDetailsContent, parseStructuredDetails } from "./landingUtils";
import LandingSectionHeading from "./LandingSectionHeading";

const LandingStatsBar = ({ pkg }) => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setIsMobile(mq.matches);
      setShowAll(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!pkg) return null;

  const stats = parseDetailsContent(pkg.details);
  const { title, subtitle, intro, features, cta } = parseStructuredDetails(pkg.hero_subtitle);

  const hasHeader = Boolean(title || subtitle || intro);
  const hasExtra = Boolean(features?.length || cta);
  if (!stats.length && !hasHeader && !hasExtra) return null;

  const cols = isMobile ? 2 : 4;
  const limit = cols * 2;
  const hasMore = stats.length > limit || hasExtra;
  const visible = showAll ? stats : stats.slice(0, limit);
  const fillers = (cols - (visible.length % cols)) % cols;

  return (
    <section className="">
      {hasHeader && (
        <div className="mb-5">
          {title && (
            <h2 className=" text-[24px] font-bold leading-snug tracking-tight text-[#0C1B15] sm:text-[28px]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-[14px] font-semibold leading-snug text-[#0B6E4F]">{subtitle}</p>
          )}
          {intro && (
            <p className="mt-2.5 max-w-prose text-[13.5px] leading-[1.8] text-[#4F625A]">{intro}</p>
          )}
        </div>
      )}

      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#DCE6E0] bg-[#DCE6E0] sm:grid-cols-4">
          {visible.map((s, i) => (
            <div key={i} className="bg-white px-4 py-4">
              <p className=" text-[20px] font-bold leading-none text-[#0B6E4F]">{s.value}</p>
              <p className="mt-2 text-[12px] leading-snug text-[#4F625A]">{s.label}</p>
            </div>
          ))}
          {Array.from({ length: fillers }).map((_, i) => (
            <div key={`f${i}`} className="bg-white" />
          ))}
        </div>
      )}

      <AnimatePresence initial={false}>
        {showAll && hasExtra && (
          <motion.div
            key="extra"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-7">
              {features?.length > 0 && (
                <>
                  <LandingSectionHeading
                    title="এছাড়াও ব্যাচে যা যা পাবে"
                    subtitle="তোমার প্রস্তুতিকে আরও গুছিয়ে এগিয়ে নিতে"
                  />
                  <ul className="mt-4 divide-y divide-[#E8EFEA] overflow-hidden rounded-2xl border border-[#DCE6E0] bg-white">
                    {features.map((f, i) => (
                      <li key={`${f}-${i}`} className="flex items-start gap-3 px-4 py-3.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B6E4F]">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-[13.5px] leading-relaxed text-[#26382F]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {cta && (
                <div className={`${features?.length ? "mt-4" : ""} rounded-2xl bg-[#0C1B15] px-5 py-4`}>
                  <p className="text-[13.5px] leading-[1.75] text-white/90">{cta}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-[#CBD9D0] bg-white px-4 py-2 text-[12.5px] font-semibold text-[#0B6E4F] transition hover:bg-[#F4F9F6]"
        >
          {showAll ? "সংক্ষেপে দেখাও" : "আরও দেখো"}
          <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}
    </section>
  );
};

export default LandingStatsBar;