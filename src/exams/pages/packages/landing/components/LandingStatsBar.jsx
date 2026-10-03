import {
  ClipboardList,
  BookOpen,
  RotateCcw,
  FileCheck2,
  GraduationCap,
  Brain,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  parseDetailsContent,
  parseStructuredDetails,
} from "./landingUtils";

const statIcons = [
  BookOpen,
  RotateCcw,
  FileCheck2,
  ClipboardList,
  Brain,
  GraduationCap,
];

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.15 } },
};

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
};

const LandingStatsBar = ({ pkg }) => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
      setShowAll(false);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  if (!pkg) return null;

  const stats = parseDetailsContent(pkg.details);
  const { title, subtitle, intro, features, cta } = parseStructuredDetails(
    pkg.hero_subtitle
  );

  const hasHeader = Boolean(title || subtitle || intro);
  const hasExtraInfo = Boolean((features && features.length > 0) || cta);

  if (!stats.length && !hasHeader && !hasExtraInfo) return null;

  // 2 rows by default: 2 cols on mobile (2x2=4), 4 cols on desktop (4x2=8)
  const visibleLimit = isMobile ? 4 : 8;

  const hasMoreStats = stats.length > visibleLimit;

  // "More" is available whenever there are extra stat rows OR extra hero info to reveal
  const hasMore = hasMoreStats || hasExtraInfo;

  const visibleStats = showAll ? stats : stats.slice(0, visibleLimit);

  return (
    <section className="relative mt-3 overflow-hidden font-['Hind_Siliguri']">
      {/* Ambient animated blob */}
      <motion.div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#0B6E4F]/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative">
        {/* Header: title / subtitle / intro */}
        {hasHeader && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 mx-3"
          >
            {title && (
              <h2 className="font-siliguri text-2xl font-semibold leading-snug tracking-tight text-[#12241D]">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="font-dual mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0B6E4F]">
                {subtitle}
              </p>
            )}

            {intro && (
              <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-[#5B6E64]">
                {intro}
              </p>
            )}
          </motion.div>
        )}

        {/* Stats grid */}
        {stats.length > 0 && (
          <motion.div
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={gridVariants}
          >
            <AnimatePresence initial={false}>
              {visibleStats.map((stat, index) => {
                const Icon = statIcons[index % statIcons.length];

                return (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    exit="exit"
                    layout
                    whileHover={{ y: -3 }}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#E1E8E3] bg-white px-3.5 py-3.5 transition-colors duration-200 hover:border-[#0B6E4F]/25 hover:shadow-[0_6px_20px_rgba(11,110,79,0.08)]"
                  >
                    <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#0B6E4F]/[0.035] transition-transform duration-300 group-hover:scale-125" />

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B6E4F]/10"
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-5 w-5 text-[#0B6E4F]" />
                      </motion.div>

                      <div className="min-w-0">
                        <p className="text-base font-bold leading-tight tracking-tight text-[#12241D]">
                          {stat.value}
                        </p>

                        <p className="mt-0.5 text-[11px] leading-[1.4] text-[#5B6E64]">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Extra info (features / cta) — only visible when expanded */}
        <AnimatePresence initial={false}>
          {showAll && hasExtraInfo && (
            <motion.div
              key="hero-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden my-6"
            >
              <div className={stats.length > 0 ? "mt-4" : ""}>
                {features && features.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2.5 ">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B6E4F] to-[#0E8F65] shadow-sm shadow-[#0B6E4F]/25">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>

                      <div className="min-w-0">
                        <h3 className=" text-base font-semibold text-[#12241D]">
                          এছাড়াও ব্যাচে যা যা পাবে
                        </h3>

                        <p className="mt-0.5 truncate text-[11.5px] text-[#718078]">
                          তোমার প্রস্তুতিকে আরও গুছিয়ে এগিয়ে নিতে
                        </p>
                      </div>
                    </div>

                    <motion.div
                      className="mt-3 overflow-hidden rounded-2xl border border-[#E1E8E3] bg-white"
                      initial="hidden"
                      animate="show"
                      variants={listVariants}
                    >
                      <ul className="divide-y divide-[#EEF3EF]">
                        {features.map((feature, index) => (
                          <motion.li
                            key={`${feature}-${index}`}
                            variants={itemVariants}
                            className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#F6FBF8]"
                          >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF5EF]">
                              <Check className="h-3.5 w-3.5 text-[#0B6E4F]" />
                            </span>

                            <span className="min-w-0 text-[13px] leading-relaxed text-[#33443B]">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                )}

                {cta && (
                  <div
                    className={`${
                      features && features.length > 0 ? "mt-4" : ""
                    } rounded-2xl bg-gradient-to-br from-[#0B6E4F] to-[#0E8F65] px-4 py-4 shadow-md shadow-[#0B6E4F]/20 sm:px-5`}
                  >
                    <p className="text-[12.5px] leading-relaxed text-white/95">
                      {cta}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* More */}
        {!showAll && hasMore && (
          <div className="relative mt-[-48px] pt-12">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent" />

            <motion.button
              type="button"
              onClick={() => setShowAll(true)}
              whileTap={{ scale: 0.94 }}
              className="relative mx-auto flex items-center gap-1.5 rounded-full border border-[#DCE6E0] bg-white px-4 py-2 text-xs font-medium text-[#0B6E4F] shadow-sm transition-all hover:border-[#0B6E4F]/30 hover:bg-[#F7FBF9]"
            >
              আরও দেখো
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        )}

        {/* Collapse */}
        {showAll && hasMore && (
          <motion.button
            type="button"
            onClick={() => setShowAll(false)}
            whileTap={{ scale: 0.94 }}
            className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-medium text-[#5B6E64] transition-colors hover:text-[#0B6E4F]"
          >
            সংক্ষেপে দেখাও
            <ChevronDown className="h-3.5 w-3.5 rotate-180" />
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default LandingStatsBar;