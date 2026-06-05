import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  useGetExamByIdQuery,
  useRestartExamMutation,
} from "@/features/exams/examsApi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/atoms/Loading";
import ExamResultForMcq from "../components/organism/exams/ExamResultForMcq";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { GoCheckCircleFill } from "react-icons/go";
import { MdOutlineTimer } from "react-icons/md";
import { saveAnswers } from "@/features/exams/Answers";
import { useEffect } from "react";
import { Spin } from "antd";
import { CreativeExamForMT } from "../components/molecules/packages/mtexam/CreativeExamForMT";
import { NormalExamForMT } from "../components/molecules/packages/mtexam/NormalExamForMT";

const ExamResultPage = () => {
  const { id } = useParams();
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [restartExam, { isLoading: restartLoading }] = useRestartExamMutation();
  const { data: examData, isLoading: isExamResultLoading } =
    useGetExamByIdQuery(id);

  useEffect(() => {
    if (examData?.exam?.answers?.[0]?.mcq_answers) {
      dispatch(saveAnswers(examData?.exam?.answers[0]?.mcq_answers)); // ✅ No extra object wrapping
    }
  }, [examData]);

  const totalExamMarks =
    examData?.questions_list[0].mark * examData?.questions_list?.length;
  const mcq = examData?.exam?.answers[0]?.mcq_answers;

  const results = mcq?.reduce(
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

  if (isExamResultLoading) {
    return <Loading />;
  }

  const handleStartExam = async () => {
    if (!auth?.student) navigate("/");

    try {
      const response = await restartExam(id).unwrap();
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

    if (!hours && !minutes && !seconds) {
      return "00:00:00";
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full px-2 pb-20 pt-4">
      <Card className="p-4 text-center ">
        <div className="font-hind-siliguri">
          {/* Circular Score */}
          <div className="relative flex flex-col items-center w-32 h-32 p-5 px-6 mx-auto border-8 border-purple-600 rounded-full">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800 ">
                {results?.correct || 0 || 0}
              </p>
              <hr className="!border-b border-2 border-purple-600" />
              <p className="text-2xl text-gray-700">{totalExamMarks}</p>
            </div>
          </div>
          <p className="py-3 mt-2 text-lg font-semibold text-gray-800">
            তোমার স্কোর
          </p>

          {/* Score Details */}
          <div className="grid grid-cols-2 mx-auto font-semibold max-w-96">
            <div className="flex items-center justify-center gap-1 py-3 border-b border-r">
              <GoCheckCircleFill color="green" size={27} />
              <span className="flex flex-col items-start text-gray-700">
                <span>সঠিক উত্তর</span>
                <span className="font-bold">
                  {results?.correct || 0 || 0} টি
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 py-3 border-b">
              <span className="bg-red-500 p-[1px] text-[8px] px-[8px] text-white rounded-full">
                ⛌
              </span>
              <span className="flex flex-col items-start text-gray-700">
                <span>ভুল উত্তর</span>
                <span className="font-bold">
                  {results?.incorrect || 0 || 0} টি
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 py-3 border-b border-r">
              <span className="bg-yellow-500 p-0.5 px-2.5 text-sm text-white rounded-full">
                !
              </span>
              <span className="flex flex-col items-start text-gray-700">
                <span>স্কিপ করেছে</span>
                <span className="font-bold">
                  {results?.skipped
                    ? results?.skipped
                    : examData?.questions_list?.length}{" "}
                  টি
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 py-3 border-b">
              <span className="bg-red-700 w-fit text-[8px] py-[1px] px-[8px] rounded-full text-white">
                ━
              </span>
              <span className="flex flex-col items-start text-gray-700">
                <span>নেগ. স্কোর</span>
                <span className="font-bold">0</span>
              </span>
            </div>
            <div className="flex items-center justify-center col-span-2 gap-1 py-5">
              <span className="bg-red-500 p-1.5 text-white rounded-full">
                <MdOutlineTimer size={15} />
              </span>
              <span className="flex flex-col text-left text-gray-700">
                <span>সময় নিয়েছে</span>
                <span className="font-bold">
                  {getMiddleTime(
                    examtime?.exam_start_time,
                    examtime?.submission_time || examtime?.exam_start_time
                  )}{" "}
                  সে./প্রশ্ন
                </span>
              </span>
            </div>
            <button
              onClick={handleStartExam}
              disabled={restartLoading}
              className={`col-span-2 py-3 text-white bg-purple-400 rounded-md hover:bg-purple-500 ${
                restartLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {restartLoading ? <Spin size="small" /> : "Restart Exam"}
            </button>
          </div>
        </div>
      </Card>

      <div className="flex flex-col items-center justify-center gap-4 pb-6">
        <div className="flex gap-2"></div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            All({examData?.questions_list?.length})
          </Badge>
          <Badge variant="destructive" className="text-sm">
            Wrong({results?.incorrect || 0})
          </Badge>
          <Badge variant="green" className="text-sm">
            Correct({results?.correct || 0})
          </Badge>
          <Badge variant="yellow" className="text-sm">
            Skipped(
            {results?.skipped
              ? results?.skipped
              : examData?.questions_list?.length}
            )
          </Badge>
        </div>
      </div>

      <div className="text-center">
        {examData?.exam?.type === "mcq" && (
          <ExamResultForMcq
            answers={examData?.exam?.answers[0]?.mcq_answers}
            submittedQues={examData?.questions_list}
          />
        )}

        {/* {examData?.exam?.type === "creative" &&
          examData?.questions_list?.map((question, index) => (
            <CreativeExamForMT
              key={question?.id}
              queIndex={index}
              question={question}
            />
          ))}

        {examData?.exam?.type === "normal" &&
          examData?.questions_list?.map((question, index) => (
            <NormalExamForMT
              key={question?.id}
              queIndex={index}
              question={question}
            />
          ))} */}
      </div>
    </div>
  );
};

export default ExamResultPage;
