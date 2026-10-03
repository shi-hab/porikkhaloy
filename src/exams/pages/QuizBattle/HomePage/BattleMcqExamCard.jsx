import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { useSubmitAnswerMutation } from "@/features/exams/QuizBattleApi";
import { toast } from "sonner";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";
import { playCorrectSound, playWrongSound } from "../../../components/utils/quizSound";
// import QuestionMarkMenu  from "@/exams/pages/QuestionMark/QuestionMarkMenu";
import QuestionFeedback from "@/exams/components/molecules/questionList/QuestionFeedback"; // পাথ আপনার প্রজেক্ট অনুযায়ী adjust করুন

const OPTION_LABELS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"];

export default function BattleMcqExamCard({ question, onAnswered }) {
  const mcqAnswers = useSelector((state) => state.battleQuiz.mcqAnswers);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
  const [submitAnswer] = useSubmitAnswerMutation();

  const { id: question_id, title, mcq_questions, mark, bookmarks } = question || {};

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
    if (selectedOptionsMap[question_id]) return;
    setSelectedOptionsMap({ [question_id]: optionSerial });

    const chosen = mcq_questions?.find(
      (o) => o.mcq_option_serial === optionSerial,
    );
    const isCorrect = chosen?.is_correct == "1";

    if (isCorrect) playCorrectSound();
    else playWrongSound();

    onAnswered?.(isCorrect, Number(mark) || 0);

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
  const wasWrong =
    selectedOption &&
    !mcq_questions?.some(
      (o) => o.mcq_option_serial === selectedOption && o.is_correct == "1",
    );

    console.log(question)

  return (
    <Card
      className={`text-left p-4 sm:p-5 rounded-2xl border-0 shadow-lg shadow-slate-200/70 dark:shadow-none qb-bounce-in ${wasWrong ? "qb-shake" : ""}`}
    >
      {/* Top row: feedback + favorite icons */}
      <div className="flex items-center justify-end gap-2 mb-2">
        <QuestionFeedback questionId={question_id} />
       
      </div>

      <p className="text-center font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed">
        {parseHtmlContent(title)}
      </p>

      <div className="grid grid-cols-1 mt-5 gap-2.5 lg:grid-cols-2">
        {mcq_questions?.map((option, index) => {
          const isSelected = selectedOption === option.mcq_option_serial;
          const isCorrect = option.is_correct == "1";
          const revealed = Boolean(selectedOption);

          let stateClasses =
            "bg-slate-50 dark:bg-gray-800/60 border-slate-200 dark:border-gray-700";
          let badgeClasses =
            "bg-white dark:bg-gray-900 border-slate-300 dark:border-gray-600 text-slate-600 dark:text-slate-200";

          if (revealed) {
            if (isCorrect) {
              stateClasses =
                "bg-green-50 dark:bg-green-950/40 border-green-400 ring-1 ring-green-300";
              badgeClasses = "bg-green-500 border-green-500 text-white";
            } else if (isSelected) {
              stateClasses =
                "bg-red-50 dark:bg-red-950/40 border-red-400 ring-1 ring-red-300";
              badgeClasses = "bg-red-500 border-red-500 text-white";
            } else {
              stateClasses =
                "bg-slate-50 dark:bg-gray-800/40 border-slate-200 dark:border-gray-700 opacity-60";
            }
          }

          return (
            <div
              key={option.id}
              onClick={() =>
                handleOptionClick(option.id, option.mcq_option_serial)
              }
              className={`flex items-center gap-2.5 border p-3 rounded-xl transition-all duration-150 ${stateClasses} ${revealed ? "cursor-default" : "cursor-pointer hover:border-blue-300 hover:bg-blue-50/60 active:scale-[0.98]"
                }`}
              style={{ pointerEvents: revealed ? "none" : "auto" }}
            >
              <div
                className={`shrink-0 rounded-full h-7 w-7 flex items-center justify-center border-2 font-semibold transition-colors ${badgeClasses}`}
              >
                {revealed && isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : revealed && isSelected ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm leading-none">{OPTION_LABELS[index]}</span>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-100">
                {parseHtmlContent(option.mcq_question_text)}
              </p>
            </div>
          );
        })}
      </div>

      {selectedOption && correctOption?.description && (
        <div className="mt-4 p-3.5 border border-blue-100 dark:border-gray-700 bg-blue-50/60 dark:bg-gray-800/60 rounded-xl text-sm text-slate-700 dark:text-slate-200 qb-fade-in">
          {parseHtmlContent(correctOption.description)}
        </div>
      )}
    </Card>
  );
}