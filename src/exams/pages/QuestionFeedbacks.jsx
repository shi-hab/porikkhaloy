import { useState } from "react";
import { Pagination, Spin, Tag, DatePicker } from "antd";
import dayjs from "dayjs";
import { useGetQuestionFeedbackQuery } from "@/features/Feedbacks/Feedback";
import QuestionFeedBackMCQCard from "../components/molecules/questionList/QuestionFeedBackMCQCard";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";
import { ChevronDown, ChevronUp } from "lucide-react";


const QuestionFeedback = () => {
  const [visibleFeedbackId, setVisibleFeedbackId] = useState(null);


  const { data: maxFreeExamData, isLoading: loadingMaxFreeExam } =
    useGetMaxFreeExamQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data, isLoading } = useGetQuestionFeedbackQuery({
    page: currentPage,
    perPage: perPage,
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="grid w-full h-screen place-content-center">
        <Spin />
      </div>
    );
  }

  const feedbackList = data?.data?.data || [];

  // Filter feedbacks by selected date
  const filteredFeedbackList = selectedDate
    ? feedbackList.filter((item) =>
        dayjs(item.created_at).isSame(selectedDate, "day")
      )
    : feedbackList;

  return (
    <div className="px-2 py-10 md:ml-[60px] lg:ml-0 lg:mr-0">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Question Feedback</h2>

        <div className="flex items-center gap-2">
          <DatePicker
            onChange={(date) => setSelectedDate(date)}
            placeholder="Filter by Date"
            allowClear
          />
        </div>
      </div>

      {/* All Feedbacks as QuestionCard */}
      <div className="space-y-6">
        {filteredFeedbackList.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            কোন প্রশ্ন পাওয়া যায়নি!
          </div>
        ) : (
          filteredFeedbackList.map((feedback, index) => {
            const question = feedback?.question;
            if (!question) return null;

            return (
              <div
                key={feedback.id}
                className="border dark:border-gray-700 rounded-sm dark:bg-gray-900 bg-white shadow-md overflow-hidden transition-all duration-300"
              >
                {/* Question Card */}
                <QuestionFeedBackMCQCard
                  data={question}
                  index={index + 1 + (currentPage - 1) * perPage}
                  verified={maxFreeExamData}
                />

                {/* Toggle Button */}
                <div
                  onClick={() =>
                    setVisibleFeedbackId(
                      visibleFeedbackId === feedback.id ? null : feedback.id
                    )
                  }
                  className="flex justify-center items-center py-2 cursor-pointer transition hover:text-blue-600 text-gray-500"
                >
                  {visibleFeedbackId === feedback.id ? (
                    <>
                      <ChevronUp size={18} className="mr-1" />{" "}
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} className="mr-1" />{" "}
                      <Tag
                        color={
                          feedback.status === "pending" ? "yellow" : "green"
                        }
                      >
                        {feedback.status}
                      </Tag>
                    </>
                  )}
                </div>

                {/* Feedback Details */}
                {visibleFeedbackId === feedback.id && (
                  <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm transition-all duration-300">
                    <p className="font-solaiman-lipi mb-2 text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-500 dark:text-gray-400">
                        তোমার করা অভিযোগ :
                      </strong>{" "}
                      {feedback.note}
                    </p>
                    <p>
                      <strong className="text-gray-500 dark:text-gray-400">
                        Status:
                      </strong>{" "}
                      <Tag
                        color={
                          feedback.status === "pending" ? "yellow" : "green"
                        }
                      >
                        {feedback.status}
                      </Tag>
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {filteredFeedbackList.length > 0 && (
        <div className="w-full flex flex-col items-center mt-10 gap-2">
          {/* Page Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing page{" "}
            <span className="font-medium text-blue-600">{currentPage}</span> of{" "}
            <span className="font-medium">
              {Math.ceil((data?.data?.total || 0) / perPage)}
            </span>
          </div>

          {/* Pagination Controls */}
          <Pagination
            total={data?.data?.total || 0}
            pageSize={perPage}
            current={currentPage}
            showSizeChanger
            showQuickJumper={false}
            pageSizeOptions={["10", "20", "50"]}
            onShowSizeChange={(current, size) => {
              setPerPage(size);
              setCurrentPage(1);
            }}
            onChange={(page) => setCurrentPage(page)}
            className="custom-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionFeedback;
