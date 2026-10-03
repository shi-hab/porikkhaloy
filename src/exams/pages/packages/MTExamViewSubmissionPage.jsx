import { Card } from "@/components/ui/card";
import { CreativeExamForMT } from "@/exams/components/molecules/packages/mtexam/CreativeExamForMT";
import ExamResultForMcq from "@/exams/components/organism/exams/ExamResultForMcq";
import { useGetMtExamStudentAnswersQuery } from "@/features/exams/examsApi";
import { useEffect, useMemo, useState } from "react";
import { GoCheckCircleFill, GoTrophy } from "react-icons/go";
import { MdOutlineTimer, MdRemoveCircle } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaMedal } from "react-icons/fa";
import { BsBarChartFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { Spin } from "antd";
import TimerForUI from "@/exams/components/atoms/timer/TimerForUI";
import { NormalQueForMT } from "./NormalQueForMT";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { BsTelegram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useSubmitReviewMutation } from "@/features/packages/mtExamsApi";
import { toast } from "sonner";
import RatingButton from "@/components/ui/ratingButton";
import { Textarea } from "@/components/ui/textarea";
import SocialIcon from "@/components/ui/SocialIcon ";
import { Loader } from "lucide-react";
import { isoDateFormatter } from "@/helpers/dateFormatter";

// ---------------------------------------------------------------------------
// Summary card — original stat-pill layout, modernized + fully responsive
// ---------------------------------------------------------------------------

const StatPill = ({ label, value, gradient, iconBg, icon }) => (
  <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
    <div
      className={`${gradient} text-white text-[10px] sm:text-xs font-semibold tracking-wide text-center py-1.5`}
    >
      {label}
    </div>
    <div className="bg-white py-2 sm:py-3 flex items-center justify-center gap-1.5">
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </span>
      <span className="font-bold text-slate-800 text-[13px] sm:text-sm truncate">
        {value}
      </span>
    </div>
  </div>
);

const ExamResultSummaryCard = ({
  modelTestName,
  lastSubmissionTime,
  aggregate,
  position,
  topScore,
  meritListLink,
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const filters = [
    { key: "all", label: `All ${counts.total}`, dot: null },
    { key: "correct", label: `Right ${counts.correct}`, dot: "bg-emerald-500" },
    { key: "skipped", label: `Skipped ${counts.skipped}`, dot: "bg-amber-400" },
    { key: "incorrect", label: `Wrong ${counts.incorrect}`, dot: "bg-rose-500" },
  ];

  return (
    <Card className="p-3 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow font-hind-siliguri">
      {/* Title */}
      <h2 className="text-center font-bold text-sm sm:text-lg leading-snug text-slate-800 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-1">
        <span>{modelTestName}</span>
      </h2>
      {lastSubmissionTime && (
        <p className="text-center text-gray-400 text-[11px] sm:text-sm mt-1">
          Exam Date: {isoDateFormatter(lastSubmissionTime)}
        </p>
      )}

      {/* Stat pills — 2 cols on mobile, 4 on larger screens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
        <StatPill
          label="MARKS"
          value={`${aggregate.obtainedMarks.toFixed(2)}/${aggregate.totalMarks}`}
          gradient="bg-gradient-to-r from-emerald-500 to-emerald-400"
          iconBg="#D1FAE5"
          icon={<GoCheckCircleFill className="text-emerald-500" size={12} />}
        />
        <StatPill
          label="ACCURACY"
          value={`${aggregate.accuracy}%`}
          gradient="bg-gradient-to-r from-sky-500 to-sky-400"
          iconBg="#DBEAFE"
          icon={<IoMdCheckmarkCircle className="text-sky-500" size={12} />}
        />
        <StatPill
          label="TIME"
          value={aggregate.timeLabel}
          gradient="bg-gradient-to-r from-sky-500 to-sky-400"
          iconBg="#DBEAFE"
          icon={<MdOutlineTimer className="text-sky-500" size={12} />}
        />
        <StatPill
          label="NEGATIVE"
          value={aggregate.negativeScore}
          gradient="bg-gradient-to-r from-rose-500 to-rose-400"
          iconBg="#FEE2E2"
          icon={<MdRemoveCircle className="text-rose-500" size={12} />}
        />
      </div>

      {/* Position / Leaderboard — stacks on mobile */}
      {(position || topScore || meritListLink) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0 mt-3 text-xs sm:text-sm text-gray-600">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {position && (
              <span className="flex items-center gap-1">
                <FaMedal className="text-amber-500" size={13} /> Pos:{" "}
                <span className="font-medium text-gray-700">{position}</span>
              </span>
            )}
            {position && topScore && (
              <span className="text-gray-300 hidden sm:inline">|</span>
            )}
            {topScore && (
              <span className="flex items-center gap-1">
                <GoTrophy className="text-amber-500" size={13} /> Top:{" "}
                <span className="font-medium text-gray-700">{topScore}</span>
              </span>
            )}
          </div>
          {meritListLink && (
            <Link
              to={meritListLink}
              className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
            >
              <BsBarChartFill className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              LEADERBOARD
            </Link>
          )}
        </div>
      )}

      {/* Filter pills — functional, wraps and shrinks nicely on mobile */}
      <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isActive ? (
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white inline-block flex-shrink-0" />
              ) : (
                <span
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block flex-shrink-0 ${f.dot}`}
                />
              )}
              <span className="truncate">{f.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const MTExamViewSubmissionPage = () => {
  const location = useLocation();

  const { modelTestId, studentId, attemptId } = useParams();
  const [isReview, setIsReview] = useState(location?.state?.drawerOpen || false);
  const [submitReview, { isLoading: reviewLoading }] = useSubmitReviewMutation();
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState();

  // active status filter for the mcq question list: all | correct | incorrect | skipped
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSubmitReview = async () => {
    try {
      await submitReview({
        model_test_id: modelTestId,
        student_id: studentId,
        rating: rating,
        review_text: reviewText,
      }).unwrap();

      setHasSubmittedReview(true);

      toast.success("Review succesfully submitted!");
      setIsReview(false);
      setReviewText("");
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error("Review submission failed!");
    }
  };

  // (avoids always rounding small durations down to "0m")
  const formatMinutesLabel = (totalSeconds) => {
    const total = Math.round(totalSeconds || 0);

    if (total < 60) {
      return `${total}s`;
    }

    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
  };

  const getTimeDifferenceInSeconds = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInSeconds = Math.floor((end - start) / 1000);
    return diffInSeconds < 0 || diffInSeconds > 10800 ? 0 : diffInSeconds;
  };

  // Given one mcq exam's answer + question list, work out the per-question
  // status (correct / incorrect / skipped). This is what powers both the
  // aggregate numbers AND the functional filter buttons.
  const getMcqQuestionStatus = (question, mcqAnswers, negativeMark) => {
    const ans = mcqAnswers.find(
      (a) => String(a.question_id) === String(question.id),
    );

    if (!ans || !ans.mcq_question_id) {
      return { status: "skipped", ans: ans || null };
    }

    // Prefer the flag already computed by the backend when present.
    if (typeof ans.is_submitted_correct === "boolean") {
      return {
        status: ans.is_submitted_correct ? "correct" : "incorrect",
        ans,
      };
    }

    // Fallback: work it out from the options list.
    const correctOptionId = question?.mcq_questions?.find(
      (opt) => opt.is_correct == 1 || opt.is_correct === "1" || opt.is_correct === true,
    )?.id;

    const isCorrect = String(ans.mcq_question_id) === String(correctOptionId);
    return { status: isCorrect ? "correct" : "incorrect", ans, negativeMark };
  };

  const {
    data: examData,
    isLoading: isExamResultLoading,
    refetch: refetchExam,
  } = useGetMtExamStudentAnswersQuery({
    modelTestId,
    studentId,
    attemptId,
  });
  

  const solve_sheet = examData?.canView_solve_sheet;
  const exam_end_time = examData?.exam_end_time;
  const has_review = examData?.hasReview;
  const modelTestName = examData?.modelTestName;

  const package_id = examData?.exams?.[0]?.package_id;

  useEffect(() => {
    if (location.state?.drawerOpen) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (modelTestId) refetchExam();
  }, [modelTestId]);

  // ---- Compute aggregate + per-exam per-question status list ----
  // (recomputed only when the fetched exam data changes)
const { aggregate, examStatusMap, lastSubmissionTime } = useMemo(() => {
  const agg = {
    totalQuestions: 0,
    totalMarks: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    negativeScore: 0,
    correctMarksSum: 0,
    totalTimeSec: 0,
  };

  const statusMap = {};
  let lastSubmissionTime = null;

  (examData?.exams || []).forEach((examItem) => {
    const exam = examItem.exam;
    const answer = examItem.answer;
    const questions_list = examItem.questions_list || [];

    if (!answer) return;

    // Last exam-এর submission time
    lastSubmissionTime = answer?.submission_time || null;

    agg.totalQuestions += Number(questions_list.length);

    agg.totalMarks += questions_list.reduce(
      (acc, q) => acc + Number(q.mark || 0),
      0,
    );

    if (exam.type === "mcq" && answer.mcq_answers) {
      const negativeMark = Number(exam.is_negative_mark_applicable || 0);
      const mcqAnswers = JSON.parse(answer.mcq_answers);

      const statuses = questions_list.map((question) => {
        const { status, ans } = getMcqQuestionStatus(
          question,
          mcqAnswers,
          negativeMark,
        );

        if (status === "correct") {
          agg.correct++;
          agg.correctMarksSum += Number(question.mark || 0);
        } else if (status === "incorrect") {
          agg.incorrect++;
          agg.negativeScore += negativeMark;
        } else {
          agg.skipped++;
        }

        return { question, status, ans };
      });

      statusMap[exam.id] = statuses;
    }

    const timeTakenInSec = getTimeDifferenceInSeconds(
      answer?.exam_start_time,
      answer?.submission_time,
    );

    agg.totalTimeSec += Number(timeTakenInSec || 0);
  });

  const attempted = agg.correct + agg.incorrect;

  agg.accuracy =
    attempted > 0
      ? Math.round((agg.correct / attempted) * 100)
      : 0;

  agg.obtainedMarks = agg.correctMarksSum - agg.negativeScore;
  agg.timeLabel = formatMinutesLabel(agg.totalTimeSec);

  return {
    aggregate: agg,
    examStatusMap: statusMap,
    lastSubmissionTime,
  };
}, [examData]);

  if (isExamResultLoading) {
    return (
      <div className="h-[70vh] grid place-content-center">
        <Spin />
      </div>
    );
  }

  if (!examData?.exams || examData.exams.length === 0)
    return (
      <p className="text-center mt-5">কোনো পরীক্ষার ডেটা পাওয়া যায়নি।</p>
    );

  // Title / date shown at the top of the summary card.
  // Falls back gracefully if the backend hasn't sent a friendly title yet.
  const examTitle =
    examData?.title ||
    examData?.model_test?.title ||
    examData?.exams?.[0]?.exam?.title ||
    "Model Test Result";

  const firstExamStart = examData?.exams?.[0]?.exam?.start_time;
  const examDateLabel = firstExamStart
    ? new Date(firstExamStart.replace(" ", "T")).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  // Position / top score aren't present in this endpoint's payload yet.
  // Wire these up once the API returns them (e.g. from the merit-list endpoint).
  const position = examData?.position ?? null;
  const topScore = examData?.topScore ?? null;

  const meritListLink =
    package_id && modelTestId
      ? `/package/${package_id}/model-test-merit-list/${modelTestId}`
      : null;

  return (
    <>
      <div className="pt-3 sm:pt-4 px-2 pb-20 space-y-8 sm:space-y-10">
        {/* Aggregate Summary Card — modernized, mobile-responsive, filters functional */}
        <ExamResultSummaryCard
          title={examTitle}
          examDate={examDateLabel}
          aggregate={aggregate}
          position={position}
          topScore={topScore}
          meritListLink={meritListLink}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          modelTestName={modelTestName}
          lastSubmissionTime={lastSubmissionTime}
          counts={{
            total: aggregate.totalQuestions,
            correct: aggregate.correct,
            incorrect: aggregate.incorrect,
            skipped: aggregate.skipped,
          }}
        />

        {/* Per Exam Questions Display */}
        {solve_sheet ? (
          <div className="text-center grid grid-cols-1 mt-4 sm:mt-5 gap-4 sm:gap-5">
            {examData.exams.map((examItem, examIndex) => {
              const exam = examItem.exam;
              const answer = examItem.answer;
              const questions_list = examItem.questions_list || [];

              // Apply the active filter only to mcq exams — that's the
              // only type we can auto-classify as right/wrong/skipped.
              let visibleQuestionsList = questions_list;
              if (exam.type === "mcq" && examStatusMap[exam.id]) {
                visibleQuestionsList =
                  activeFilter === "all"
                    ? questions_list
                    : examStatusMap[exam.id]
                        .filter((s) => s.status === activeFilter)
                        .map((s) => s.question);
              }

              return (
                <div key={exam.id} className="space-y-4 sm:space-y-5">
                  {answer && (
                    <>
                      <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                        {exam.title || `Exam ${examIndex + 1}`}
                      </h2>

                      {exam.type === "mcq" &&
                        (visibleQuestionsList.length > 0 ? (
                          <ExamResultForMcq
                            answers={JSON.parse(answer.mcq_answers)}
                            submittedQues={visibleQuestionsList}
                            data="mt"
                          />
                        ) : (
                          <p className="text-sm text-gray-400">
                            এই ফিল্টারে কোনো প্রশ্ন নেই।
                          </p>
                        ))}

                      {exam.type === "creative" &&
                        questions_list?.map((question, index) => (
                          <CreativeExamForMT
                            key={question?.id}
                            queIndex={index}
                            question={question}
                            data="mt"
                          />
                        ))}

                      {exam.type === "normal" &&
                        questions_list?.map((question, index) => (
                          <NormalQueForMT
                            key={question?.id}
                            queIndex={index}
                            question={question}
                            data="mt"
                          />
                        ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-md px-4 py-6 text-center w-full border border-gray-200">
            {/* Heading */}
            <h3 className="text-lg sm:text-xl font-bold font-siliguri text-gray-800 mb-3">
              ⏳ সল্ভ সীট দেখার কাউন্টডাউন চলছে
            </h3>

            {/* Sub text */}
            <p className="text-sm text-gray-600 mb-5">
              প্রতিযোগিতামূলক পরিবেশ বজায় রাখার জন্য লাইভ পরীক্ষার সময় সল্ভ সীট
              দেখতে পারবে না।
            </p>

            {/* Timer */}
            <TimerForUI
              targetDate={exam_end_time}
              onComplete={() => {
                refetchExam();
                window.location.reload();
              }}
            />

            {/* Footer message */}
            <p className="text-xs text-gray-500 mt-5">দয়া করে অপেক্ষা করো...</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Drawer open={isReview} onOpenChange={setIsReview}>
        <DrawerContent className="rounded-t-[32px] border-0 bg-white ">
          {/* Top Handle */}
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Success Section */}
          <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 text-center">

            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute w-24 h-24 rounded-full bg-green-200 blur-2xl opacity-40 animate-pulse" />
              <div className="absolute w-20 h-20 rounded-full border-4 border-green-200 animate-ping opacity-40" />

              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 font-siliguri">
              পরীক্ষাটি সফলভাবে সম্পন্ন হয়েছে
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {!has_review ? "ধন্যবাদ! তোমার ফিডব্যাক আমাদের জন্য গুরুত্বপূর্ণ" : "যেকোন সমস্যার সমাধান পেতে আমাদের ফেইসবুক গ্রুপে পোস্ট করো!"}
            </p>
          </div>

          {/* Review Card */}
          {!has_review ? (
            <div className="py-5 ">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">

                {/* Rating */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-gray-600 font-regular">তোমার রেটিং</p>
                  <RatingButton
                    value={rating}
                    onChange={setRating}
                    size={30}
                    defaultValue={3}
                  />
                </div>

                {/* Textarea */}
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="তোমার অভিজ্ঞতা লিখো..."
                  className="
                    w-full rounded-xl border border-gray-200
                    bg-white p-3 text-sm resize-none
                    outline-none focus:border-green-400
                  "
                />

                {/* Actions */}
                <div className="flex justify-center items-center gap-6 mt-4">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={hasSubmittedReview || reviewLoading}
                    className="
                    w-full h-11 rounded-xl text-base font-bold
                    bg-gradient-to-r from-green-500 to-green-600
                    text-white shadow-md hover:opacity-90 transition
                  "
                  >
                    {reviewLoading ? <Loader /> : "Submit Review"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="
            w-full h-11 rounded-xl text-base text-white font-regular bg-black 
            border-gray-300  hover:bg-gray-100
          "
                    >
                      Close
                    </Button>
                  </DrawerClose>

                </div>
              </div>

            </div>
          ) : (
            <div className="py-5">
              <p className="text-xs text-center text-gray-400 mb-3">
                Join our community
              </p>

              <div className="flex items-center justify-center gap-3">

                <SocialIcon href="https://t.me/porikkhaloyapp" color="#229ED9">
                  <BsTelegram />
                </SocialIcon>

                <SocialIcon href="https://www.facebook.com/share/g/1b3dPPWeEJ/" color="#1877F2">
                  <FaFacebook />
                </SocialIcon>

                <SocialIcon href="https://m.me/porikkhaloyapp" color="#0084FF">
                  <FaFacebookMessenger />
                </SocialIcon>

                <SocialIcon href="https://wa.me/8801706429945" color="#25D366">
                  <IoLogoWhatsapp />
                </SocialIcon>

              </div>
            </div>
          )}

        </DrawerContent>
      </Drawer >
    </>
  );
};

export default MTExamViewSubmissionPage;