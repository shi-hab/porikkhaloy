import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  ListChecks,
  Sparkles,
  Lock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import {
  normalizeExam,
  formatExamDuration,
  formatExamDateTime,
} from "./landingUtils";

import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { clearMTExamInfo } from "@/features/packages/mtExamSlice";
import { EncodeURL } from "../../../../components/atoms/urlHashCode/EncodeURL";
// Adjust this path to wherever your auth hook actually lives
// (same hook PrivateRoutes.jsx uses).
import useAuth from "../../../../hooks/useAuth";
import { setPostAuthRedirect } from "../../../../components/utils/authRedirect";

const EXAM_LIST_MAX_HEIGHT = 500;

const ExamRow = ({ exam, index, packageId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAuth();

  const formattedDateTime = formatExamDateTime(exam.startAt);

  const [date, time] = formattedDateTime.includes(",")
    ? formattedDateTime.split(",").map((item) => item.trim())
    : [formattedDateTime, ""];

  const packageIdEncoded = EncodeURL(packageId);
  const examIdEncoded = EncodeURL(exam.id);
  const targetUrl = `/package/${packageIdEncoded}/${examIdEncoded}`;

  const handleClick = () => {
    // Locked (non-free) exams never navigate — they just tell the
    // student they need to enroll in the package first.
    if (!exam.isFree) {
      toast.info("পরীক্ষাটি দেওয়ার জন্য এনরোল করতে হবে।");
      return;
    }

    dispatch(clearMTExamInfo());

    navigate(targetUrl);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index, 10) * 0.03,
      }}
      className="group relative"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200 ${exam.isFree
          ? "border-emerald-200 bg-white shadow-sm shadow-emerald-900/5 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/10"
          : "border-white/5 bg-white/[0.02] hover:border-[#8B7FE8]/30 hover:bg-white/[0.05]"
          }`}
      >
        {/* Left Accent */}
        <span
          className={`absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-300 group-hover:h-2/3 ${exam.isFree
            ? "bg-gradient-to-b from-emerald-400 to-emerald-500"
            : "bg-gradient-to-b from-indigo-400 to-indigo-500"
            }`}
        />

        {/* Exam Content */}
        <div className="min-w-0 flex-1">
          {/* Exam Name */}
          <p
            className={`line-clamp-1 truncate text-[12px] font-semibold ${exam.isFree ? "text-slate-800" : "text-slate-700"
              }`}
          >
            {parseHtmlContent(exam.title)}
          </p>

          {/* Meta */}
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {/* Duration + Questions */}
            <div className="flex min-w-0 items-center gap-1.5">
              {/* Duration */}
              <span
                className={`inline-flex h-5 w-[48px] shrink-0 items-center justify-center gap-1 rounded-full px-1 text-[8px] lg:w-[58px] lg:text-[10px] ${exam.isFree
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                  }`}
              >
                <Clock3 className="h-2.5 w-2.5 shrink-0" />

                <span className="whitespace-nowrap">
                  {formatExamDuration(exam.durationMinutes)}
                </span>
              </span>

              {/* Questions */}
              <span
                className={`inline-flex h-5 w-[48px] shrink-0 items-center justify-center gap-1 rounded-full px-1 text-[8px] lg:w-[58px] lg:text-[10px] ${exam.isFree
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                  }`}
              >
                <ListChecks className="h-2.5 w-2.5 shrink-0" />

                <span className="whitespace-nowrap">
                  {exam.questionCount}টি
                </span>
              </span>
            </div>

            {/* Free badge OR Date + Time (locked) */}
            {exam.isFree ? (
              <span className="inline-flex h-5 w-28 shrink-0 items-center justify-center gap-1 rounded-full bg-emerald-500 text-[9.5px] font-bold text-white shadow-sm shadow-emerald-500/30">
                <Sparkles className="h-2.5 w-2.5 shrink-0" />
                <span className="leading-none">ফ্রি পরীক্ষা দাও</span>
              </span>
            ) : (
              <div className="flex shrink-0 items-center gap-1.5">
                <Lock className="h-3 w-3 shrink-0 text-slate-400" />

                <div className="text-right leading-none">
                  <div className="text-[10.5px] font-medium text-slate-600">
                    {date}
                  </div>

                  {time && (
                    <p className="mt-1 text-[9.5px] text-slate-400">
                      {time}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
};

const LandingExamListSection = ({
  mtUnderPkg,
  isLoading,
  pkg,
}) => {
  const routineUrl = pkg?.routine_pdf || pkg?.routine;
  const packageId = pkg?.id;

  const exams = useMemo(() => {
    const raw = mtUnderPkg?.data;

    if (!Array.isArray(raw)) return [];

    return raw
      .map(normalizeExam)
      .sort((a, b) => {
        // Free exams float to the top so students see them first
        if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
        if (!a.startAt) return 1;
        if (!b.startAt) return -1;

        return new Date(a.startAt) - new Date(b.startAt);
      });
  }, [mtUnderPkg]);

  /* =========================
     Loading State
  ========================= */
  if (isLoading) {
    return (
      <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 font-['Hind_Siliguri'] shadow-[0_16px_45px_rgba(15,23,42,0.07)] sm:p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />

          <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>

        {/* List Skeleton */}
        <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-white p-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

                <div>
                  <div className="h-3.5 w-32 animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="h-8 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* =========================
     Empty State
  ========================= */
  if (exams.length === 0) return null;

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 px-3 pt-5 pb-4 font-['Hind_Siliguri'] shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-40 rounded-full bg-indigo-100/60 blur-3xl" />

      {/* =========================
          Header
      ========================= */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-siliguri text-lg font-semibold text-slate-800">
            পরীক্ষার রুটিন
          </h2>

          <p className="mt-0.5 text-[12px] text-slate-500">
            রুটিন মডিউল অনুযায়ী সব পরীক্ষা ধারাবাহিকভাবে অনুষ্ঠিত হবে।
          </p>
        </div>

        {/* Routine PDF */}
        {routineUrl && (
          <a
            href={routineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex shrink-0 items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11.5px] font-medium text-indigo-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-100"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
              <CalendarDays className="h-3.5 w-3.5 text-indigo-600" />
            </span>

            <span className="hidden sm:block">
              রুটিন মডিউল
            </span>

            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>

      {/* =========================
          Scrollable Exam List
      ========================= */}
      <div className="relative mt-3">
        <ul
          className="space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-100/60 px-2 py-2.5 shadow-inner shadow-slate-200/50"
          style={{
            maxHeight: `${EXAM_LIST_MAX_HEIGHT}px`,
            scrollbarWidth: "thin",
            scrollbarColor:
              "rgba(100,116,139,0.28) transparent",
          }}
        >
          {exams.map((exam, index) => (
            <ExamRow
              key={exam.id}
              exam={exam}
              index={index}
              packageId={packageId}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LandingExamListSection;