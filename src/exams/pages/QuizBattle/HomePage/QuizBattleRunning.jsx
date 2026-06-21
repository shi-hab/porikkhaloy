import { useSelector } from "react-redux";
import BattleMcqExamCard from "./BattleMcqExamCard";
import { useState, useEffect } from "react";
import { Spin } from "antd";
import { Button } from "@/components/ui/button";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";
import { useQuizBattleMutation } from "@/features/exams/QuizBattleApi";
import { FaStar } from "react-icons/fa";

export default function QuizBattleRunning() {
  const { auth } = useSelector((state) => state);
  const exam = useSelector((state) => state.battleQuiz);
  const { categories } = exam;

  const { data: allData, refetch } = useGetAllForNavbarQuery();
    
  const quizBattlePoint = allData?.data?.quizBattlePoint ?? 0;

  const [startExam, { isLoading: isExamStarting }] = useQuizBattleMutation();

  // Current question to show
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // Next question preloaded
  const [nextQuestion, setNextQuestion] = useState(null);
  // Keep track of question history for UX
  const [questionHistory, setQuestionHistory] = useState([]);

  // Restore from sessionStorage on page reload
  useEffect(() => {
    const saved = sessionStorage.getItem("battleQuizData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.questions_list?.length > 0) {
        setCurrentQuestion(parsed.questions_list[0]);
        setQuestionHistory([parsed.questions_list[0]]);
        preloadNextQuestion(parsed.categories);
      }
    } else {
      // First load → fetch first question
      preloadNextQuestion(categories);
    }
  }, []);

  // Preload function: fetch next question in background
  const preloadNextQuestion = async (categoryData = categories) => {
    if (!categoryData) return;

    const payload = {
      title: "Battle Quiz",
      created_by: auth.student.id,
      created_by_role: "student",
      type: "mcq",
      lesson: categoryData.lesson,
      subject: categoryData.subject,
      limit: 1,
    };

    try {
      const response = await startExam(payload).unwrap();
      refetch();
      if (response.questions_list?.length > 0) {
        setNextQuestion(response.questions_list[0]);
      }
    } catch (err) {
       ("Prefetch next question failed", err);
    }
  };

  // Handle Next button click
  const handleNext = () => {
    if (!nextQuestion) return;

    setCurrentQuestion(nextQuestion);
    setQuestionHistory((prev) => [...prev, nextQuestion]);
    preloadNextQuestion(categories);
    setNextQuestion(null);
  };

  if (!currentQuestion) {
    return (
      <div className="flex justify-center mt-20">
        <Spin />
      </div>
    );
  }

  return (
    <div className="p-2 ">
      <div className="mb-4 flex items-center justify-end bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 font-bold rounded-md py-1.5 px-4 shadow-md w-max ml-auto">
        <FaStar className="text-yellow-500 mb-1 dark:text-yellow-300 text-lg mr-1.5" />
        <span className="text-lg">{quizBattlePoint || "0"} PP</span>
      </div>

      <BattleMcqExamCard question={currentQuestion} key={currentQuestion.id} />
      <div className="fixed bottom-0 left-0 w-full p-2 bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700">
        <Button
          className="bg-blue-700 font-bold w-full text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
          onClick={handleNext}
          disabled={!nextQuestion}
        >
          পরের প্রশ্ন
        </Button>
      </div>
    </div>
  );
}
