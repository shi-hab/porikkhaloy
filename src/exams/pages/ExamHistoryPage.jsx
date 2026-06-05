import dayjs from "dayjs";
import {
  useGetAllExamsQuery,
  useRestartExamMutation,
} from "@/features/exams/examsApi";
import ExamHistoryCard from "../components/molecules/exams/ExamHistoryCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { DatePicker, Spin } from "antd";
import { useState } from "react";

const groupExamsByDate = (exams) => {
  const grouped = {
    today: [],
    yesterday: [],
    others: {},
  };

  exams?.forEach((exam) => {
    const examDate = dayjs(exam.created_at).startOf("day");
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");

    if (examDate.isSame(today)) {
      grouped.today.push(exam);
    } else if (examDate.isSame(yesterday)) {
      grouped.yesterday.push(exam);
    } else {
      const formattedDate = examDate.format("DD MMMM YYYY");
      if (!grouped.others[formattedDate]) {
        grouped.others[formattedDate] = [];
      }
      grouped.others[formattedDate].push(exam);
    }
  });

  return grouped;
};

const filterExamsByDate = (exams, date) => {
  return exams?.filter((exam) =>
    dayjs(exam.created_at).isSame(dayjs(date), "day")
  );
};

const ExamHistoryPage = () => {
  const { data: allExams, isLoading } = useGetAllExamsQuery();
  const [restartExam] = useRestartExamMutation();
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleStartExam = async (id) => {
    if (!auth?.student) return navigate("/");

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

  if (isLoading) {
    return (
      <div className="grid w-full h-screen place-content-center">
        <Spin />
      </div>
    );
  }

  const allExamList = allExams?.exams || [];
  const groupedExams = groupExamsByDate(allExamList);
  const filteredByDate = selectedDate
    ? filterExamsByDate(allExamList, selectedDate)
    : null;

  return (
    <div className="mx-auto pb-20 xl:p-10 md:ml-[50px] flex-grow xl:ml-0 space-y-6 pt-12 lg:pt-0 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between mb-6 w-[95%] md:w-[85%] mx-auto">
        <h1 className="font-semibold text-xl">
          মোট প্র্যাকটিস পরীক্ষা : {allExams?.exams?.length || 0}
        </h1>

        <DatePicker
          onChange={(date) => setSelectedDate(date)}
          placeholder="🔎 তারিখ সিলেক্ট করো"
          className="!w-[190px] font-solaiman-lipi"
          allowClear
        />
      </div>

      {filteredByDate && (
        <div>
          <div className="w-[95%] md:w-[85%] mx-auto">
            <h2 className="bg-green-200 dark:bg-green-700 py-2 rounded-sm border-2 border-b-4 border-green-400 dark:border-green-600 mb-3 text-center text-lg font-semibold text-gray-700 dark:text-white">
              📅 {dayjs(selectedDate).format("DD MMMM YYYY")} তারিখে প্র্যাকটিস
              করা এক্সাম
            </h2>
          </div>
          {filteredByDate.length > 0 ? (
            filteredByDate.map((exam) => (
              <ExamHistoryCard
                key={exam.id}
                exam={exam}
                handleStartExam={handleStartExam}
              />
            ))
          ) : (
            <p className="text-center mt-40 text-gray-500 dark:text-gray-300">
              ঐদিন কোনো এক্সাম পাওয়া যায়নি।
            </p>
          )}
        </div>
      )}

      {!selectedDate && (
        <>
          {groupedExams.today.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                ✅ আজকে প্র্যাকটিস করেছো
              </h2>
              {groupedExams.today.map((exam) => (
                <ExamHistoryCard
                  key={exam.id}
                  exam={exam}
                  handleStartExam={handleStartExam}
                />
              ))}
            </>
          )}

          {groupedExams.yesterday.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                🔄 গতকাল প্র্যাকটিস করেছো
              </h2>
              {groupedExams.yesterday.map((exam) => (
                <ExamHistoryCard
                  key={exam.id}
                  exam={exam}
                  handleStartExam={handleStartExam}
                />
              ))}
            </>
          )}

          {Object.keys(groupedExams.others).map((date) => (
            <div key={date} className="my-2">
              <div className="w-[95%] md:w-[85%] mx-auto">
                <h2 className="bg-green-200 dark:bg-green-700 py-2 rounded-sm border-2 border-b-4 border-green-400 dark:border-green-600 mb-3 text-center text-lg font-semibold text-gray-700 dark:text-white">
                  📅 {date}
                </h2>
              </div>
              {groupedExams.others[date].map((exam) => (
                <ExamHistoryCard
                  key={exam.id}
                  exam={exam}
                  handleStartExam={handleStartExam}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ExamHistoryPage;
