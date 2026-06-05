import { useState } from "react";
import QuestionCard from "./QuestionCard";
import CardSkeleton from "./CardSkeleton";
import { Empty } from "antd";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";

export default function PaginationSCN({
  data,
  totalRecords,
  currentPage,
  perPage,
  onPageChange,
  onPerPageChange,
  refetch,
  loading,
}) {
  const [loadingPage, setLoadingPage] = useState(false);
  const totalPages = Math.ceil(totalRecords / perPage);

  const { data: maxFreeExamData, isLoading: loadingMaxFreeExam } =
    useGetMaxFreeExamQuery();

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      refetch().finally(() => setLoadingPage(false));
    }
  };

  return (
    <div className="space-y-5">
      {/* Display list of questions or loader */}
      <div className="grid items-center content-center justify-center w-full grid-cols-1 gap-5 place-content-center">
        {loadingPage || loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : data?.length > 0 ? (
          data.map((question, index) => (
            <QuestionCard
              key={question.id}
              data={question}
              index={index}
              verified={maxFreeExamData}
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full col-span-3">
            <Empty />
          </div>
        )}
      </div>

      {data?.length > 0 && (
        <div className="relative flex items-center justify-center">
          <div className="absolute right-0 text-gray-700 dark:text-gray-300 -top-4">
            <span>Total Records: {totalRecords}</span> |{" "}
            <span>Total Pages: {totalPages}</span>
          </div>

          {currentPage < totalPages && (
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-2 px-5 cursor-pointer bg-black p-2.5 rounded text-white"
            >
              <span>Load More Questions</span>
              <IoMdAddCircleOutline size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
