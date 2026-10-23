import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, Clock3, ListChecks, Lock, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { normalizeExam } from "./landingUtils";
import { bn, formatBnDuration, getExamDateParts } from "./landingFormat";
import LandingSectionHeading from "./LandingSectionHeading";

import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { clearMTExamInfo } from "@/features/packages/mtExamSlice";
import { EncodeURL } from "../../../../components/atoms/urlHashCode/EncodeURL";

const LIST_MAX_HEIGHT = 540;

const ExamRow = ({ exam, packageId, highlight, reduceMotion }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const parts = getExamDateParts(exam.startAt);
  const marked = highlight && exam.isFree;
  const shake = marked && !reduceMotion;

  const handleClick = () => {
    if (!exam.isFree) {
      toast.info("পরীক্ষাটি দেওয়ার জন্য এনরোল করতে হবে।");
      return;
    }
    dispatch(clearMTExamInfo());
    navigate(`/package/${EncodeURL(packageId)}/${EncodeURL(exam.id)}`);
  };

  return (
    <li data-free={exam.isFree ? "true" : undefined}>
      <motion.div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        animate={shake ? { x: [0, -7, 7, -5, 5, -2, 0] } : { x: 0 }}
        transition={shake ? { duration: 0.6, delay: 0.55 } : { duration: 0.2 }}
        className={`flex cursor-pointer items-center gap-3 rounded-2xl p-2.5 pr-3.5 transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
          exam.isFree ? "bg-[#E7F6EE] ring-1 ring-emerald-300" : "bg-white"
        } ${marked ? "!ring-2 !ring-emerald-400 ring-offset-2 ring-offset-[#0C1B15]" : ""}`}
      >
        {/* Date tile */}
        <div
          className={`flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-xl ${
            exam.isFree ? "bg-[#0B6E4F] text-white" : "bg-[#EEF3F0] text-[#0C1B15]"
          }`}
        >
          {parts ? (
            <>
              <span className="font-serif text-[19px] font-bold leading-none">{parts.day}</span>
              <span className="mt-1 text-[10.5px] leading-none opacity-80">{parts.month}</span>
            </>
          ) : (
            <Clock3 className="h-5 w-5 opacity-70" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-[#0C1B15]">
            {parseHtmlContent(exam.title)}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[#5B6E64]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {parts ? parts.time : "সময় জানানো হবে"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {formatBnDuration(exam.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3 w-3" />
              {bn(exam.questionCount)}টি প্রশ্ন
            </span>
          </div>
        </div>

        {/* State */}
        {exam.isFree ? (
          <span className="flex h-8 shrink-0 items-center gap-0.5 rounded-full bg-[#0B6E4F] pl-3 pr-2 text-[12px] font-semibold text-white">
            ফ্রি
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-slate-400" aria-label="এনরোল করলে খুলবে" />
        )}
      </motion.div>
    </li>
  );
};

const LandingExamListSection = ({ mtUnderPkg, isLoading, pkg, highlightKey }) => {
  const packageId = pkg?.id;
  const reduceMotion = useReducedMotion();

  const [highlight, setHighlight] = useState(false);
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  // Real routine order (by date). Free exams are marked in place.
  const exams = useMemo(() => {
    const raw = mtUnderPkg?.data;
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeExam).sort((a, b) => {
      if (!a.startAt) return 1;
      if (!b.startAt) return -1;
      return new Date(a.startAt) - new Date(b.startAt);
    });
  }, [mtUnderPkg]);

  const freeCount = exams.filter((e) => e.isFree).length;

  // "ফ্রি এক্সাম দাও" pressed
  useEffect(() => {
    if (!highlightKey) return;

    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const list = listRef.current;
    const first = list?.querySelector('[data-free="true"]');
    if (list && first) {
      list.scrollTo({ top: Math.max(first.offsetTop - 8, 0), behavior: "smooth" });
    }

    setHighlight(true);
    const t = setTimeout(() => setHighlight(false), 3800);
    return () => clearTimeout(t);
  }, [highlightKey]);

  if (isLoading) {
    return (
      <section className="font-siliguri rounded-[28px] bg-[#0C1B15] p-5">
        <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>
      </section>
    );
  }

  if (exams.length === 0) return null;

  return (
    <section
      id="routine-section"
      ref={sectionRef}
      className="font-siliguri scroll-mt-4 rounded-[28px] bg-[#0C1B15] px-3 pb-3 pt-6 shadow-[0_24px_50px_-24px_rgba(12,27,21,0.8)] sm:px-5 sm:pb-5"
    >
      <LandingSectionHeading
        tone="dark"
        className="px-2"
        title="পরীক্ষার রুটিন"
        subtitle={`মোট ${bn(exams.length)}টি পরীক্ষা${freeCount ? `, এর মধ্যে ${bn(freeCount)}টি ফ্রি` : ""}`}
      />

      <AnimatePresence initial={false}>
        {highlight && freeCount > 0 && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-2 mt-3 overflow-hidden rounded-xl bg-emerald-400/15 px-3.5 py-2.5 text-[12.5px] leading-snug text-emerald-100"
          >
            সবুজ চিহ্নিত পরীক্ষাগুলো ফ্রি। এনরোল ছাড়াই এগুলো দিতে পারবে।
          </motion.p>
        )}
      </AnimatePresence>

      <ul
        ref={listRef}
        className="relative mt-4 space-y-2 overflow-y-auto p-1 pr-1.5"
        style={{
          maxHeight: LIST_MAX_HEIGHT,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.25) transparent",
        }}
      >
        {exams.map((exam) => (
          <ExamRow
            key={exam.id}
            exam={exam}
            packageId={packageId}
            highlight={highlight}
            reduceMotion={reduceMotion}
          />
        ))}
      </ul>
    </section>
  );
};

export default LandingExamListSection;