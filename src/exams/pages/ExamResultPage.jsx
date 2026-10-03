import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  useGetExamByIdQuery,
  useRestartExamMutation,
} from "@/features/exams/examsApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import ExamResultForMcq from "../components/organism/exams/ExamResultForMcq";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Spin } from "antd";
import { GoCheckCircleFill } from "react-icons/go";
import { MdOutlineTimer, MdOutlineDoNotDisturbOn, MdOutlineRefresh } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { BsBarChartLineFill } from "react-icons/bs";
import CreativeExamPage from "../components/organism/exams/CreativeExamPage";
import NormalExamPage from "../components/organism/exams/NormalExamPage";

const ExamResultPage = () => {
  const submittedExam = useSelector((state) => state.submittedExam);
  const { examination, mcq_answers } = submittedExam;
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const [restartExam, { isLoading: restartLoading }] = useRestartExamMutation();
  const [activeFilter, setActiveFilter] = useState("all");

  const results = mcq_answers.reduce(
    (acc, answer) => {
      if (answer.submitted_mcq_option === null) {
        acc.skipped++;
      } else if (answer.is_submitted_correct) {
        acc.correct++;
      } else {
        acc.incorrect++;
      }
      return acc;
    },
    { correct: 0, incorrect: 0, skipped: 0 }
  );

  if (examination?.id) {
    sessionStorage.setItem("examination_id", examination.id);
  }
  const examination_id = sessionStorage.getItem("examination_id");
  const { data: examData, isLoading: isExamResultLoading } =
    useGetExamByIdQuery(examination_id);
  const totalExamMarks =
    examData?.questions_list[0]?.mark * examData?.questions_list?.length;

  if (isExamResultLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  const handleStartExam = async () => {
    if (!auth?.student) navigate("/");
    try {
      const response = await restartExam(examination_id).unwrap();
      if (response.exam && response.questions_list) {
        navigate("/exam-on-going");
      }
    } catch (err) {
      if (
        err.data?.quota_info?.paid_quota_exceeded &&
        err.data?.quota_info?.free_quota_exceeded
      ) {
        toast.error(
          err?.data?.error || err?.data?.message || "An error occurred"
        );
      }
    }
  };

  const examtime = examData?.exam?.answers[0];

  const getElapsedSeconds = (start, end) => {
    if (!start || !end) return 0;
    return Math.max(0, Math.round((new Date(end) - new Date(start)) / 1000));
  };
  const elapsedSeconds = getElapsedSeconds(
    examtime?.exam_start_time,
    examtime?.submission_time
  );
  const formatElapsed = (secs) => {
    if (secs < 60) return `${secs}s`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const totalQuestions = examData?.questions_list?.length || 0;
  const isMcq = examData?.exam?.type === "mcq";
  const obtainedMarks = isMcq
    ? results.correct - results.incorrect * 0.25
    : totalExamMarks;
  const accuracy =
    totalQuestions > 0 ? Math.round((results.correct / totalQuestions) * 100) : 0;
  const negativeScore = results.incorrect * 0.25;

  const examDate = examtime?.exam_start_time
    ? new Date(examtime.exam_start_time).toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const statCards = [
    {
      label: "MARKS",
      value: `${obtainedMarks}/${totalExamMarks || 0}`,
      icon: <GoCheckCircleFill size={12} />,
      from: "from-emerald-500",
      to: "to-green-400",
      iconBg: "bg-emerald-500",
    },
    {
      label: "ACCURACY",
      value: `${accuracy}%`,
      icon: <TbTargetArrow size={13} />,
      from: "from-sky-400",
      to: "to-cyan-400",
      iconBg: "bg-sky-500",
    },
    {
      label: "TIME",
      value: formatElapsed(elapsedSeconds),
      icon: <MdOutlineTimer size={13} />,
      from: "from-sky-500",
      to: "to-blue-400",
      iconBg: "bg-sky-500",
    },
    {
      label: "NEGATIVE",
      value: negativeScore,
      icon: <MdOutlineDoNotDisturbOn size={13} />,
      from: "from-rose-500",
      to: "to-pink-400",
      iconBg: "bg-rose-500",
    },
  ];

  const allAnswers = examData?.exam?.answers[0]?.mcq_answers || [];
  const allQuestions = examData?.questions_list || [];

  const getAnswerStatus = (answer) => {
    if (answer.submitted_mcq_option === null) return "skipped";
    if (answer.is_submitted_correct) return "right";
    return "wrong";
  };

  const filteredIndexes = allAnswers.reduce((acc, answer, idx) => {
    const status = getAnswerStatus(answer);
    if (activeFilter === "all" || activeFilter === status) acc.push(idx);
    return acc;
  }, []);

  const filteredAnswers = filteredIndexes.map((i) => allAnswers[i]);
  const filteredQuestions = filteredIndexes.map((i) => allQuestions[i]);

  const filterPills = [
    { key: "all", label: "All", count: totalQuestions },
    { key: "right", label: "Right", count: results.correct, dot: "bg-green-500" },
    { key: "skipped", label: "Skipped", count: results.skipped, dot: "bg-yellow-500" },
    { key: "wrong", label: "Wrong", count: results.incorrect, dot: "bg-red-500" },
  ];

  return (
    <div className="w-full p-2 pb-20 dark:bg-gray-900 dark:text-gray-100 font-hind-siliguri">
      <Card className="p-5 text-center bg-white dark:bg-gray-800 dark:text-gray-100 shadow-md rounded-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {examData?.exam?.title || "Exam"}
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Exam Date: {examDate}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div
                className={`bg-gradient-to-r ${stat.from} ${stat.to} text-white text-[11px] font-semibold py-1.5 tracking-wide`}
              >
                {stat.label}
              </div>
              <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white dark:bg-gray-800">
                <span
                  className={`${stat.iconBg} text-white rounded-full p-1 flex items-center justify-center`}
                >
                  {stat.icon}
                </span>
                <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Restart (left) + Leaderboard (right) as matching link-style row */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleStartExam}
            disabled={restartLoading}
            className={`flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {restartLoading ? (
              <Spin size="small" />
            ) : (
              <>
                <MdOutlineRefresh size={15} />
                Retake Exam
              </>
            )}
          </button>

          {/* <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">
            <BsBarChartLineFill size={13} />
            LEADERBOARD
          </button> */}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {filterPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setActiveFilter(pill.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === pill.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {pill.dot && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeFilter === pill.key ? "bg-white" : pill.dot
                  }`}
                />
              )}
              {pill.label} {pill.count}
            </button>
          ))}
        </div>
      </Card>

      <div>
        {examData?.exam?.type === "mcq" && (
          <ExamResultForMcq
            answers={filteredAnswers}
            submittedQues={filteredQuestions}
          />
        )}
        {examData?.exam?.type === "creative" && (
          <CreativeExamPage filteredQues={filteredQuestions} />
        )}
        {examData?.exam?.type === "normal" && (
          <NormalExamPage questions_list={filteredQuestions} />
        )}
      </div>
    </div>
  );
};

export default ExamResultPage;