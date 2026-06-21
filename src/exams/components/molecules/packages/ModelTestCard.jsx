import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { useGetSubjectsNamesUnderMTQuery } from "@/features/packages/packagesApi";
import { useDispatch } from "react-redux";
import { clearMTExamInfo } from "@/features/packages/mtExamSlice";
import { Link } from "react-router-dom";
import { EncodeURL } from "../../atoms/urlHashCode/EncodeURL";
import { Clock, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

export const ModelTestCard = ({ singleMT, packageId, mtid }) => {
  const { data } = useGetSubjectsNamesUnderMTQuery(mtid);
  const dispatch = useDispatch();

  // useMemo ব্যবহার করে ক্যালকুলেশন অপ্টিমাইজ করা হয়েছে
  const {
    isExamEnded,
    isExamNotStarted,
    formattedStartTime,
    formattedEndTime,
    totalQuestions,
    banglaTimeLimit,
  } = useMemo(() => {
    const now = new Date();
    const startTimeStr = singleMT?.start_time?.replace(/\s/, "T") || "";
    const endTimeStr = singleMT?.end_time?.replace(/\s/, "T") || "";

    const startingDate = new Date(startTimeStr);
    const endingDate = new Date(endTimeStr);

    const isEnded = endingDate < now;
    const isNotStarted = now < startingDate;

    // সংখ্যা বাংলায় রূপান্তর
    const toBanglaNumber = (num) =>
      num?.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) || "০";

    // সময় ফরম্যাটিং (আপনার ২য় কোডের মতো)
    const formatTimeBN = (date) => {
      if (isNaN(date.getTime())) return "সময় পাওয়া যায়নি";

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const monthNames = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
      ];

      const period =
        hours >= 4 && hours < 12
          ? "সকাল"
          : hours >= 12 && hours < 16
            ? "দুপুর"
            : hours >= 16 && hours < 20
              ? "বিকেল"
              : hours >= 20 && hours < 24
                ? "রাত"
                : "ভোর";

      const convertedHour = hours % 12 || 12;
      return `${toBanglaNumber(day)} ${monthNames[date.getMonth()]} ${period} ${toBanglaNumber(convertedHour)}:${toBanglaNumber(minutes)}`;
    };

    // প্রশ্ন সংখ্যা গণনা
    const countQ = (exams) =>
      exams?.reduce(
        (total, exam) =>
          total +
          (exam.questions
            ? exam.questions.split(",").filter((q) => q.trim()).length
            : 0),
        0,
      ) || 0;

    const totalQ = countQ(data?.compulsoryExams) + countQ(data?.optionalExams);

    return {
      isExamEnded: isEnded,
      isExamNotStarted: isNotStarted,
      formattedStartTime: formatTimeBN(startingDate),
      formattedEndTime: formatTimeBN(endingDate),
      totalQuestions: toBanglaNumber(totalQ),
      banglaTimeLimit: toBanglaNumber(singleMT?.time_limit || 0),
    };
  }, [singleMT, data]);

  const packageIdEncoded = EncodeURL(packageId);
  const modelTestIdEncoded = EncodeURL(mtid);

  return (
    <div
      onClick={() => dispatch(clearMTExamInfo())}
      className="group relative overflow-hidden rounded-lg border-2 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:border-blue-800/40"
    >
      <Link
        to={`/package/${packageIdEncoded}/${modelTestIdEncoded}`}
        className="relative block p-3"
      >
        {/* Live Badge */}
        {!isExamNotStarted && !isExamEnded && (
          <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-md bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase animate-pulse">
            লাইভ
          </div>
        )}

        {/* Title - Compact & Safe */}
        <h3 className="mb-2.5 pr-10 text-start font-siliguri text-sm sm:text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-1 ">
          {parseHtmlContent(singleMT?.title)}
        </h3>

        {/* Main Row */}
        <div className="flex items-center justify-between gap-1">
          {/* Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-green-600" />
              <span className="text-sm font-semibold">
                {banglaTimeLimit} মি.
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText size={12} className="text-blue-600" />
              <span className="text-sm font-semibold">{totalQuestions}টি</span>
            </div>
          </div>

          {/* Status Area */}
          <div className="flex items-center">
            {isExamEnded ? (
              <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                <CheckCircle2 size={11} /> পরীক্ষা শেষ
              </span>
            ) : (
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-bold ${
                  isExamNotStarted
                    ? "bg-slate-50 dark:bg-slate-800 text-slate-600"
                    : "bg-red-50 dark:bg-red-950/30 text-red-600"
                }`}
              >
                <Calendar size={10} />
                <span className="whitespace-nowrap">
                  {isExamNotStarted ? formattedStartTime : formattedEndTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
