import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCategoryData } from "@/features/hooks/useCategoryData";
import { Select, Skeleton } from 'antd';

function QuestionTypeWithYear() {
  const { data: years, isLoading } = useCategoryData({ type: "years", context: "test-paper" });

  const [questionType, setQuestionType] = useState("MCQ");
  const [selectedYear, setSelectedYear] = useState("");

  return (
    <>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Question Type */}

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">
              প্রশ্নের ধরন
            </p>

            <div className="flex gap-3">
              {["MCQ", "CQ", "SQ"].map((type) => (
                <Button
                  type="button"
                  key={type}
                  variant={questionType === type ? "green" : "outline"}
                  onClick={() => setQuestionType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Year */}

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">
              বছর নির্বাচন
            </p>

            <Select
            className="w-full"
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              options={years.map(year => ({
                value: year.id,
                label: year.title
              }))}
            />
          </div>

        </div>
      )}
    </>
  );
}

export default QuestionTypeWithYear;