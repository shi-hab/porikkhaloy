import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  useGetExamByIdQuery,
  useRestartExamMutation,
  useStartExamMutation,
} from "@/features/exams/examsApi";
import { Circle } from "lucide-react";
import { useSelector } from "react-redux";
import Loading from "../components/atoms/Loading";
import ExamResultForMcq from "../components/organism/exams/ExamResultForMcq";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Flex, Progress, Spin } from "antd";
import { GoCheckCircleFill } from "react-icons/go";
import { MdOutlineTimer } from "react-icons/md";
import CreativeExamPage from "../components/organism/exams/CreativeExamPage";
import NormalExamPage from "../components/organism/exams/NormalExamPage";

const ExamResultPage = () => {
  const submittedExam = useSelector((state) => state.submittedExam);
  const { examination, mcq_answers, total_marks } = submittedExam;
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const [restartExam, { isLoading: restartLoading }] = useRestartExamMutation();
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
    examData?.questions_list[0].mark * examData?.questions_list?.length;

  // const subjectId = examData?.questions_list[0]?.attachable?.subject_id;
  // const { data: subjectData } = useGetCategoryByIdQuery({ category: "subjects", id: subjectId });
  // const subjectName = subjectData?.data?.title;

  if (isExamResultLoading) {
    return  (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin  />
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
  const getMiddleTime = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const timeDiff = (endTime - startTime) / 1000; // Convert milliseconds to seconds

    const hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="w-full p-2 pb-20 dark:bg-gray-900 dark:text-gray-100">
      <Card className="p-4 text-center bg-white dark:bg-gray-800 dark:text-gray-100 shadow-md">
        <div className="font-hind-siliguri">
          {/* Circular Score */}
          <div className="relative flex flex-col items-center w-32 h-32 p-5 px-6 mx-auto border-8 border-purple-600 rounded-full dark:border-purple-400">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {examData?.exam?.type === "creative" ||
                examData?.exam?.type === "normal"
                  ? totalExamMarks
                  : results.correct - results.incorrect * 0.25}
              </p>
              <hr className="!border-b border-2 border-purple-600 dark:border-purple-400" />
              <p className="text-2xl text-gray-700 dark:text-gray-300 font-bold">
                {totalExamMarks}
              </p>
            </div>
          </div>
          <p className="py-3 mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            তোমার স্কোর
          </p>

          {/* Score Details */}
          <div className="grid grid-cols-2 mx-auto font-semibold max-w-96">
            <div className="flex items-center justify-center gap-1 py-2 border-b border-r dark:border-gray-700">
              <GoCheckCircleFill color="green" size={27} />
              <span className="flex flex-col items-start gap-1 text-gray-700 dark:text-gray-300">
                <span>সঠিক উত্তর</span>
                <span className="font-bold">
                  {examData?.exam?.type === "creative" ||
                  examData?.exam?.type === "normal"
                    ? totalExamMarks
                    : results.correct}{" "}
                  টি
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 py-3 border-b dark:border-gray-700">
              <span className="bg-red-500 p-[1px] text-[8px] px-[8px] text-white rounded-full">
                ⛌
              </span>
              <span className="flex flex-col items-start gap-1 text-gray-700 dark:text-gray-300">
                <span>ভুল উত্তর</span>
                <span className="font-bold">{results.incorrect} টি</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 py-3 border-b border-r dark:border-gray-700">
              <span className="bg-yellow-500 p-0.5 px-2.5 text-sm text-white rounded-full">
                !
              </span>
              <span className="flex flex-col items-start gap-1 text-gray-700 dark:text-gray-300">
                <span>স্কিপ করেছে</span>
                <span className="font-bold">{results.skipped} টি</span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 py-3 border-b dark:border-gray-700">
              <span className="bg-red-700 w-fit text-[8px] py-[1px] px-[8px] rounded-full text-white">
                ━
              </span>
              <span className="flex flex-col items-start gap-1 text-gray-700 dark:text-gray-300">
                <span>নেগ. স্কোর</span>
                <span className="font-bold">{results.incorrect * 0.25}</span>
              </span>
            </div>
            <div className="flex items-center justify-center col-span-2 gap-1 py-5">
              <span className="bg-red-500 p-1.5 text-white rounded-full">
                <MdOutlineTimer size={15} />
              </span>
              <span className="flex flex-col text-start text-gray-700 dark:text-gray-300">
                <span>সময় নিয়েছে</span>
                <span className="font-bold">
                  {getMiddleTime(
                    examtime?.exam_start_time,
                    examtime?.submission_time
                  )}{" "}
                  সে./প্রশ্ন
                </span>
              </span>
            </div>
            <button
              onClick={handleStartExam}
              disabled={restartLoading}
              className={`col-span-2 py-2 text-white bg-blue-800 rounded-md hover:bg-blue-700 ${
                restartLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {restartLoading ? <Spin size="small" /> : "আবার পরিক্ষা দেও"}
            </button>
          </div>
        </div>
      </Card>

      {/* Badge Section */}
      <div className="flex flex-col mt-3 items-center justify-center gap-4 pb-6">
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            All({examData?.questions_list?.length})
          </Badge>
          <Badge variant="destructive" className="text-sm">
            Wrong({results.incorrect})
          </Badge>
          <Badge variant="green" className="text-sm">
            Correct({results.correct})
          </Badge>
          <Badge variant="yellow" className="text-sm">
            Skipped({results.skipped})
          </Badge>
        </div>
      </div>

      {/* Render Pages */}
      <div>
        {examData?.exam?.type === "mcq" && (
          <ExamResultForMcq
            answers={examData?.exam?.answers[0]?.mcq_answers}
            submittedQues={examData?.questions_list}
          />
        )}
        {examData?.exam?.type === "creative" && (
          <CreativeExamPage filteredQues={examData?.questions_list} />
        )}
        {examData?.exam?.type === "normal" && (
          <NormalExamPage questions_list={examData?.questions_list} />
        )}
      </div>
    </div>
  );
};

export default ExamResultPage;
