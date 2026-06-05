import { useGetAllMarksQuery } from "@/features/questionBookMark/questionMarkApi";
import MCQCardSkeleton from "../../components/atoms/skeletons/QuestionCard/MCQCardSkeleton";
import { CreativeExamForMT } from "../../components/molecules/packages/mtexam/CreativeExamForMT";
import { NormalExamForMT } from "../../components/molecules/packages/mtexam/NormalExamForMT";
import { useState } from "react";
import MCQBookMarkCard from "./MCQBookMarkCard";


function StudentBookMark() {
  const [currentPage] = useState(1);
  const perPage = 10;

  const { data, isLoading } = useGetAllMarksQuery({
    page: currentPage,
    perPage,
  });

  const bookMarkList = data?.data?.data || [];

  return (
    <div className="grid gap-2 mt-3 px-2">
      {/* Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <MCQCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-2 border border-dashed rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            <span>🔖</span> Saved Questions
          </h3>
        </div>
      )}

      {!isLoading &&
        bookMarkList.map((question, index) => {
          if (!question) return null;
          if (question?.question?.mcq_questions?.length > 0) {
            return (
              <MCQBookMarkCard
                key={question?.question.id}
                data={question?.question}
                index={index}
                type={question?.type}
              />
            );
          }

          // future proof (creative / normal)
          if (question.question_type === "creative") {
            return (
              <CreativeExamForMT
                key={question.id}
                data={question}
                queIndex={index}
              />
            );
          }

          if (question.question_type === "normal") {
            return (
              <NormalExamForMT
                key={question.id}
                data={question}
                queIndex={index}
              />
            );
          }

          return null;
        })}
    </div>
  );
}



export default StudentBookMark;
