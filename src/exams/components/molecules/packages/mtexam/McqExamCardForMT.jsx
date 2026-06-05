import { Card } from "@/components/ui/card";
import { updateMTMcqAnswer } from "@/features/packages/mtExamSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseHtmlContent } from "../../../../../utils/parseHtmlContent";

export function McqExamCardForMT({ queIndex, question, examId }) {
  const { id: question_id, title, mcq_questions, images } = question || {};

  const dispatch = useDispatch();
  const { mcqAnswers } = useSelector((state) => state.mtExam.activeExam);

  const persistedAnswer =
    mcqAnswers &&
    mcqAnswers?.find((answer) => answer?.question_id == question_id);
  const [selectedOption, setSelectedOption] = useState(
    persistedAnswer?.submitted_mcq_option || null
  );

  const handleOptionClick = (optionId, optionSerial) => {
    if (!optionSerial) {
      console.error("mcq_option_serial is missing for option ID:", optionId);
      return;
    }

    dispatch(
      updateMTMcqAnswer({
        examId,
        question_id,
        mcq_question_id: optionId,
        submitted_mcq_option: optionSerial,
      })
    );

    setSelectedOption(optionSerial);
  };
  function toBanglaNumeral(number) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  }

  return (
    <Card className="relative text-start p-2 my-2 duration-500 shadow-md group hover:shadow-lg">
      {/* Question title */}
      <div className=" text-lg dark:text-white font-semibold">
        <span className="text-base inline float-left h-fit mr-2">
          {queIndex + 1}.{" "}
        </span>
        <span className="text-left text-base inline">
          {parseHtmlContent(title)}
        </span>
      </div>

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

      <div className="text-start grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 cursor-pointer">
        {mcq_questions?.map((option, index) => (
          <div
            key={option?.id}
            onClick={() =>
              handleOptionClick(option?.id, option?.mcq_option_serial)
            }
            className="flex items-center col-span-2 gap-3 p-1 border rounded-xl lg:col-span-1"
          >
            <div className="flex gap-2 ">
              <p
                className={`border ${
                  selectedOption == option?.mcq_option_serial &&
                  "bg-gray-800 text-gray-200"
                } rounded-full h-6 w-6 p-2 flex items-center justify-center text-sm`}
              >
                {toBanglaNumeral(index + 1)}
              </p>
              <h1 className="text-sm ">
                {parseHtmlContent(option?.mcq_question_text)}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}