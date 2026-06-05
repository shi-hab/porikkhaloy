import { useState } from "react";
import { Card } from "@/components/ui/card";
import { isoDateFormatter } from "@/helpers/dateFormatter";
import { MdOutlineRestartAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { Spin } from "antd";

const ExamHistoryCard = ({ exam, handleStartExam }) => {
  const [loading, setLoading] = useState(false);

  if (!exam) return null;

  const formattedDate = isoDateFormatter(exam?.created_at);
  const numberArray = exam?.answers?.[0]?.mcq_answers;
  const totalQuestions = numberArray?.length || 0;
  const examTitle = exam?.title || "Unknown Exam";
  const examDescription = exam?.description;
  const totalMarks = exam?.answers?.[0]?.total_marks || 0;
  const maxMarks = totalQuestions;

  const calculateTimeDifference = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInSeconds = Math.floor((endDate - startDate) / 1000);
    const hours = Math.floor(diffInSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((diffInSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (diffInSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleRestartClick = async (examId) => {
    setLoading(true);
    try {
      await handleStartExam(examId);
    } catch (error) {
      console.error("Error restarting exam:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[95%] md:w-[85%] mx-auto px-4 py-2 my-3 bg-white text-gray-800 shadow-md dark:bg-gray-900 dark:text-gray-100">
      <Link
        to={
          exam?.type === "mcq"
            ? `/exam-history/${exam?.id}`
            : "/user/exam-history"
        }
      >
        <div className="flex items-center justify-between text-sm">
          <div>
            {totalQuestions > 0 && (
              <span className="font-medium text-purple-700 dark:text-purple-400">
                {totalMarks}/{maxMarks}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>

        <div>
          <div className="pt-2 font-bold text-lg">{examTitle}</div>
          <div className="pt-2 text-gray-600 dark:text-gray-300">
            {examDescription}
          </div>
          <p className="text-sm mt-1">
            <span className="font-semibold">Time Limit:</span> 00:
            {exam?.time_limit}m
          </p>
          {exam?.answers?.[0]?.submission_time && (
            <p className="text-sm">
              <span className="font-semibold">Duration:</span>{" "}
              {calculateTimeDifference(
                exam?.answers[0]?.exam_start_time,
                exam?.answers[0]?.submission_time
              )}{" "}
              m/s
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <div className="uppercase text-xs font-semibold bg-cyan-100 text-cyan-800 px-2 py-1 rounded-md dark:bg-cyan-900 dark:text-cyan-200">
            {exam?.type || "Unknown Type"}
          </div>

          <button
            onClick={() => handleRestartClick(exam?.id)}
            disabled={loading}
            className={`bg-purple-500 px-2 py-1 rounded-lg text-white flex items-center gap-1 mb-2 hover:bg-purple-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Spin size="small" /> : <MdOutlineRestartAlt />}
            {loading ? "Restarting..." : "Restart Exam"}
          </button>
        </div>
      </Link>
    </Card>
  );
};

export default ExamHistoryCard;
