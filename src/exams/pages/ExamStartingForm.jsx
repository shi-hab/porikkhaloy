import { useState, useEffect } from "react";
import { useCategoryData } from "../components/molecules/filterquesforexam/useCategoryData";

function ExamStartingForm({ setExamData }) {
  const [selectExamType, setSelectExamType] = useState([]);
  const [examSubType, setExamSubType] = useState([]);
  const [examPaper, setExamPaper] = useState([]);
  const [examFormat, setExamFormat] = useState("");
  const { categories: examTypes } = useCategoryData("exam-types");

  useEffect(() => {
    setExamData({
      examFormat,
      selectExamType,
      examSubType,
      examPaper,
    });
  }, [examFormat, selectExamType, examSubType, examPaper, setExamData]);
  return (
    <div className="w-full mx-auto text-center max-w-7xl bg-gray-100 rounded-sm pt-2 pb-4">
      <div className="hidden">
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <div
            onClick={() => setExamFormat(["mcq"])}
            className="bg-blue-900  text-white text-base font-medium w-fit shadow rounded-full duration-500 cursor-pointer px-4 py-2"
          >
            {" "}
            MCQ{" "}
          </div>
          {/* <div
            onClick={() => setExamFormat(["mcq"])}
            className={`bg-white text-gray-500 text-base font-medium w-fit shadow rounded-full duration-500 cursor-pointer px-4 py-2 ${
              examFormat.includes("mcq")
                ? "!bg-blue-900 text-white"
                : "bg-white text-black"
            }`}
          >
            MCQ
          </div> */}

          <div
            onClick={() => setExamFormat(["creative"])}
            className={`bg-white text-gray-500 text-base font-medium w-fit shadow rounded-full duration-500 cursor-pointer px-4 py-2 ${
              examFormat.includes("creative")
                ? "!bg-blue-900 text-white"
                : "bg-white text-black"
            }`}
          >
            Creative
          </div>
          <div
            onClick={() => setExamFormat(["normal"])}
            className={`bg-white text-gray-500 text-base font-medium w-fit shadow rounded-full duration-500 cursor-pointer px-4 py-2 ${
              examFormat.includes("normal")
                ? "!bg-blue-900 text-white"
                : "bg-white text-black"
            }`}
          >
            Short Question
          </div>
        </div>

        <p className="pb-5 mt-5 text-gray-500 border-b">
          {/* পরীক্ষার ফর্মেট নির্বাচন করুন */}
        </p>
      </div>
      <div>
        {examTypes && (
          <>
            <div className="flex flex-wrap rounded-sm items-center justify-center gap-2 mt-3">
              {examTypes
                .filter((examType) => Number(examType.status) !== 0) // Filter out exam types with status 0
                .map((examType) => (
                  <button
                    key={examType.id}
                    onClick={() =>
                      setSelectExamType((prev) =>
                        prev.includes(examType.id)
                          ? prev.filter((id) => id !== examType.id)
                          : [...prev, examType.id]
                      )
                    }
                    className={`bg-white border-2 border-blue-900 text-gray-500  font-medium w-fit text-sm shadow rounded-sm cursor-pointer p-1 ${
                      selectExamType.includes(examType.id)
                        ? "!bg-blue-900 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {examType.title}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>

      <div>
        {examTypes
          ?.filter(
            (type) =>
              selectExamType.includes(type.id) && Number(type.status) !== 0
          ) // Filter out status 0 examTypes
          .some(
            (filteredType) =>
              (filteredType.exam_sub_types || []).some(
                (subType) => Number(subType.status) !== 0
              ) // Filter out status 0 exam_sub_types
          ) && (
          <div>
            <div className="flex  rounded-sm flex-wrap items-center justify-center gap-2 mt-6">
              {examTypes
                ?.filter(
                  (type) =>
                    selectExamType.includes(type.id) &&
                    Number(type.status) !== 0
                ) // Filter out status 0 examTypes
                .flatMap(
                  (filteredType) =>
                    (filteredType.exam_sub_types || []).filter(
                      (subType) => Number(subType.status) !== 0
                    ) // Filter out status 0 exam_sub_types
                )
                .map((examType) => (
                  <div
                    key={examType.id}
                    onClick={() =>
                      setExamSubType((prev) =>
                        prev.includes(examType.id)
                          ? prev.filter((id) => id !== examType.id)
                          : [...prev, examType.id]
                      )
                    }
                    className={`bg-white border-2 border-blue-900 text-gray-500  font-medium w-fit text-sm shadow rounded-sm cursor-pointer p-1 ${
                      examSubType.includes(examType.id)
                        ? "!bg-blue-900 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {examType.title}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex  rounded-sm flex-wrap items-center justify-center gap-2 mt-6">
        {examTypes
          ?.filter(
            (type) =>
              selectExamType.includes(type.id) && Number(type.status) !== 0
          )
          .flatMap((type) =>
            (type.exam_sub_types || [])
              .filter(
                (subType) =>
                  examSubType.includes(subType.id) &&
                  Number(subType.status) !== 0
              )
              .flatMap((subType) =>
                (subType.exam_papers || []).filter(
                  (paper) => Number(paper.status) !== 0
                )
              )
          )
          .map((paper) => (
            <div
              key={paper.id}
              onClick={() =>
                setExamPaper((prev) =>
                  prev.includes(paper.id)
                    ? prev.filter((id) => id !== paper.id)
                    : [...prev, paper.id]
                )
              }
              className={`bg-white border-2 border-blue-900 text-gray-500  font-medium w-fit text-sm shadow rounded-sm cursor-pointer p-1 ${
                examPaper.includes(paper.id)
                  ? "!bg-blue-900 text-white"
                  : "bg-white text-black"
              }`}
            >
              {paper.title}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ExamStartingForm;
