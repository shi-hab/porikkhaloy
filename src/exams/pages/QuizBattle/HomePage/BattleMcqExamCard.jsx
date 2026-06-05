import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { useSubmitAnswerMutation } from "@/features/exams/QuizBattleApi";
import { toast } from "sonner";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";


export default function BattleMcqExamCard({ question }) {
  const mcqAnswers = useSelector((state) => state.battleQuiz.mcqAnswers);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const [submitAnswer] = useSubmitAnswerMutation();
  

  const { id: question_id, title, mcq_questions, mark } = question || {};

  const { refetch } = useGetAllForNavbarQuery();

  useEffect(() => {
    const persistedAnswer = mcqAnswers?.find(
      (a) => a.question_id === question_id,
    );
    if (persistedAnswer) {
      setSelectedOptionsMap({
        [question_id]: persistedAnswer.submitted_mcq_option,
      });
    }
  }, [mcqAnswers, question_id]);

  const handleOptionClick = (optionId, optionSerial) => {
    if (selectedOptionsMap[question_id]) return; // prevent changing answer
    setSelectedOptionsMap({ [question_id]: optionSerial });

    try {
      submitAnswer({
        question_id,
        mcq_question_id: optionId,
        selected_option: optionSerial,
      }).unwrap();
      refetch();
    } catch (err) {
      toast.error(err.message || "Could not submit answer");
    }
  };

  
  const selectedOption = selectedOptionsMap[question_id];
  const correctOption = mcq_questions?.find((o) => o.is_correct == "1");
  return (
    <Card className="text-left p-4 rounded-md shadow-2xl">
      <p className=" text-center font-semibold">{parseHtmlContent(title)}</p>
      <div className="grid grid-cols-1 mt-4 gap-2 lg:grid-cols-2 cursor-pointer">
        {mcq_questions?.map((option, index) => {
          const isSelected = selectedOption === option.mcq_option_serial;
          const isCorrect = option.is_correct == "1";

          return (
            <div
              key={option.id}
              onClick={() =>
                handleOptionClick(option.id, option.mcq_option_serial)
              }
              className={`flex items-center border gap-2 p-2  rounded
                ${
                  selectedOption
                    ? isCorrect
                      ? "bg-green-200 border-green-500"
                      : isSelected
                        ? "bg-red-200 border-red-500"
                        : "bg-gray-100 "
                    : "bg-gray-50 "
                }
              `}
              style={{ pointerEvents: selectedOption ? "none" : "auto" }}
            >
              <div
                className={`shadow-lg  rounded-full h-6 w-6 flex items-center justify-center
                  ${
                    selectedOption
                      ? isCorrect
                        ? "bg-green-500 border-2 border-gray-600 text-white"
                        : isSelected
                          ? "bg-red-500 border-2 border-gray-500 text-white"
                          : "bg-gray-50 border-2 border-gray-500 text-black"
                      : "bg-gray-50 border-2 border-gray-500 text-black"
                  }
                `}
              >
                <span className="text-sm mt-[1px] mr-[1.5px] text-center leading-none">
                  {["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"][index]}
                </span>
              </div>

              <p>{parseHtmlContent(option.mcq_question_text)} </p>
            </div>
          );
        })}
      </div>

      {selectedOption && correctOption?.description && (
        <div className="mt-4 p-3 border  bg-gray-100 rounded">
          {parseHtmlContent(correctOption.description)}
        </div>
      )}
    </Card>
  );
}
