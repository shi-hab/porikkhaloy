import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCategoryData } from "../../molecules/filterquesforexam/useCategoryData";

const Modal = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Exam Quota Limit Exceeded</h2>
        <p className="mb-4 text-sm">
          You have exceeded your free exam quota. Would you like to purchase
          additional exam quota?
        </p>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onRedirect}>Buy Quota</Button>
        </div>
      </div>
    </div>
  );
};

const ExamStartingForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectExamType, setSelectExamType] = useState([]);
  const [examSubType, setExamSubType] = useState([]);
  const [examFormat, setExamFormat] = useState(null);
  const { categories: examTypes } = useCategoryData("exam-types");

  const handleStartExam = async () => {
    const data = {
      examFormat,
      selectExamType,
      examSubType,
    };
    sessionStorage.setItem("data", JSON.stringify(data));
    navigate("/exam/start");
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onRedirect={() => navigate("/buy-quota")}
      />
      <div className="w-full text-center  pb-20">
        <div className="hidden">
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
            <div className="bg-blue-900 text-white text-base duration-500 font-medium w-fit shadow rounded-full px-4 py-2">
              MCQ
            </div>

            <div
              onClick={() => setExamFormat("creative")}
              className={`bg-white text-gray-500 text-base duration-500 font-medium w-fit shadow rounded-full cursor-pointer px-4 py-2 ${
                examFormat === "creative"
                  ? "!bg-blue-900 text-white"
                  : "bg-white text-black"
              }`}
            >
              Creative
            </div>

            <div
              onClick={() => setExamFormat("normal")}
              className={`bg-white text-gray-500 text-base duration-500 font-medium w-fit shadow rounded-full cursor-pointer px-4 py-2 ${
                examFormat === "normal"
                  ? "!bg-blue-900 text-white"
                  : "bg-white text-black"
              }`}
            >
              ShortQuestion
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-sm">
          <div>
            {examTypes && (
              <>
                <div className="overflow-hidden border-t  flex rounded-md py-6 flex-wrap items-center justify-center gap-2 mt-5">
                  {examTypes
                    ?.filter((examType) => Number(examType.status) !== 0) // Exclude items with status 0
                    .map((examType) => (
                      <div
                        key={examType.id}
                        onClick={() =>
                          setSelectExamType((prev) =>
                            prev.includes(examType.id)
                              ? prev.filter((id) => id !== examType.id)
                              : [...prev, examType.id]
                          )
                        }
                        className={`bg-white border-2 border-blue-900 text-gray-500 text-base duration-500 font-medium w-fit shadow rounded-md cursor-pointer px-2 py-2 ${
                          selectExamType.includes(examType.id)
                            ? "!bg-blue-900 text-white"
                            : " "
                        }`}
                      >
                        {examType.title}
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* <div>
            {examTypes
              ?.filter((exam_sub_type) =>
                selectExamType.includes(exam_sub_type.id)
              )
              .some(
                (filteredType) => (filteredType.exam_sub_types || []).length > 0
              ) && (
              <div>
                <div className=" overflow-hidden border-t  flex rounded-md py-6 flex-wrap items-center justify-center gap-2 ">
                  {examTypes
                    ?.filter((exam_sub_type) =>
                      selectExamType.includes(exam_sub_type.id)
                    )
                    .flatMap(
                      (filteredType) => filteredType.exam_sub_types || []
                    ) // Ensures sub_types exist
                    .filter((examType) => Number(examType.status) !== 0) // Exclude sub-types with status 0
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
                        className={`bg-white border-2 border-blue-900 text-gray-500 text-base duration-500 font-medium w-fit shadow rounded-md cursor-pointer px-2 py-2 ${
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
          </div> */}
        </div>
        <hr />

        {
          <Button
            onClick={handleStartExam}
            type="submit"
            className="px-5 mt-5 rounded w-full"
          >
            {" "}
            এগিয়ে যাও
          </Button>
        }
      </div>
    </>
  );
};

export default ExamStartingForm;
