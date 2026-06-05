import { Card } from "@/components/ui/card";
import { updateMcqAnswer } from "@/features/exams/examSlice";
import DOMPurify from "dompurify";
// import { BookmarkPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export default function McqExamCard({ queIndex, question }) {
    const dispatch = useDispatch();
    const mcqAnswers = useSelector((state) => state.exam.mcqAnswers);

    const { id: question_id, title, mcq_questions, images } = question || {};

    const persistedAnswer = mcqAnswers?.find((answer) => answer?.question_id === question_id);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (persistedAnswer && persistedAnswer?.submitted_mcq_option) {
            setSelectedOption(persistedAnswer?.submitted_mcq_option);
        }
    }, [persistedAnswer]);

    const handleOptionClick = (optionId, optionSerial) => {
        if (!optionSerial) {
            return;
        }

        dispatch(updateMcqAnswer({
            question_id,
            mcq_question_id: optionId,
            submitted_mcq_option: optionSerial
        }));
    };
    function toBanglaNumeral(number) {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return number.toString().replace(/\d/g, digit => banglaDigits[digit]);
      }
    return (
      <Card className="text-left relative h-full p-2 overflow-hidden duration-500 rounded-md shadow-sm group hover:shadow-lg">
        {/* question title */}
        <p className="text-lg dark:text-white font-semibold">
          <span className="inline float-left h-fit mr-2">{queIndex + 1}.</span>
          <span className="inline">{parseHtmlContent(title)}</span>
        </p>

        {/* Render the image if available */}
        {images && (
          <div className="my-4">
            <img
              src={images}
              alt={`Image for question ${question_id}`}
              className="rounded-md shadow-md max-w-full"
            />
          </div>
        )}

        <div className="grid grid-cols-1 mt-4 gap-2 lg:grid-cols-2 cursor-pointer">
          {mcq_questions?.map((option, index) => {
            const isSelected = selectedOption === option?.mcq_option_serial;

            return (
              <div
                key={index}
                onClick={() =>
                  handleOptionClick(option?.id, option?.mcq_option_serial)
                }
                className={`flex items-center col-span-2 gap-3 p-1 border rounded-xl lg:col-span-1 
          ${isSelected ? "bg-blue-700 text-white " : "bg-gray-50"}`}
              >
                <div className="flex p-0 gap-2 items-center cursor-pointer">
                  <p
                    className={`border rounded-full h-6 w-6 p-2 flex items-center justify-center text-sm 
              ${isSelected ? "bg-white text-blue-700" : ""}`}
                  >
                    <span className="flex items-center justify-center h-6 border rounded-full min-w-6">
                      {["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"][
                        index
                      ] || "?"}
                    </span>
                  </p>
                  <h1 className="text-sm">
                    {parseHtmlContent(option?.mcq_question_text)}
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
}