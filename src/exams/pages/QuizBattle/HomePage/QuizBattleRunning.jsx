import { useSelector } from "react-redux";
import BattleMcqExamCard from "./BattleMcqExamCard";
import ConfettiBurst from "../components/ConfettiBurst";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";
import { useQuizBattleMutation } from "@/features/exams/QuizBattleApi";
import { FaStar } from "react-icons/fa";
import { Volume2, VolumeX, Flag, Flame } from "lucide-react";
import {
  isSoundEnabled,
  toggleSound as toggleSoundPref,
  playStreakSound,
  playFinishSound,
} from "../../../components/utils/quizSound"; // adjust path if needed
import "../quizBattle.css";

const STREAK_MESSAGES = [
  { emoji: "🔥", text: "দারুণ চলছে! এভাবেই এগিয়ে যাও।" },
  { emoji: "🚀", text: "তুমি একদম উড়ছো! থামলে চলবে না।" },
  { emoji: "🌟", text: "অসাধারণ! আরও ১০টা প্রশ্ন কনফার্ম?" },
  { emoji: "💪", text: "তোমার প্রস্তুতি জোরদার হচ্ছে প্রতিটা প্রশ্নে।" },
  { emoji: "🏆", text: "চ্যাম্পিয়নদের মতো খেলছো!" },
];

function getTier(percentage) {
  if (percentage >= 90)
    return { label: "চ্যাম্পিয়ন", emoji: "🏆", color: "from-amber-400 to-yellow-500", confetti: true };
  if (percentage >= 70)
    return { label: "দুর্দান্ত পারফরম্যান্স", emoji: "🥈", color: "from-slate-300 to-slate-400", confetti: true };
  if (percentage >= 50)
    return { label: "ভালো চেষ্টা", emoji: "🥉", color: "from-orange-300 to-amber-500", confetti: false };
  return { label: "আরও অনুশীলন দরকার", emoji: "📘", color: "from-blue-300 to-indigo-400", confetti: false };
}

export default function QuizBattleRunning() {
  const { auth } = useSelector((state) => state);
  const exam = useSelector((state) => state.battleQuiz);
  const { categories } = exam;

  const navigate = useNavigate();
  const { data: allData, refetch } = useGetAllForNavbarQuery();
  const quizBattlePoint = allData?.data?.quizBattlePoint ?? 0;

  const [startExam, { isLoading: isExamStarting }] = useQuizBattleMutation();

  // Current question to show
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // Next question preloaded
  const [nextQuestion, setNextQuestion] = useState(null);
  // Keep track of question history for UX
  const [questionHistory, setQuestionHistory] = useState([]);

  // --- New: scoring, streak & UI feedback state ---
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [obtainedMarks, setObtainedMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [streakModal, setStreakModal] = useState(null); // { emoji, text, count } | null
  const [finishModal, setFinishModal] = useState(false);
  const milestoneRef = useRef(0);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.error("Prefetch next question failed", err);
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

  // Called by BattleMcqExamCard right after the student answers
  const handleAnswered = (isCorrect, mark) => {
    setAnsweredCount((n) => n + 1);
    setTotalMarks((m) => m + mark);

    if (isCorrect) {
      setObtainedMarks((m) => m + mark);
      setConfettiBurst((n) => n + 1);
      setCorrectCount((prev) => {
        const updated = prev + 1;
        if (updated > 0 && updated % 10 === 0 && milestoneRef.current !== updated) {
          milestoneRef.current = updated;
          const msg = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
          setTimeout(() => {
            playStreakSound();
            setStreakModal({ ...msg, count: updated });
          }, 550); // let the correct-answer highlight land first
        }
        return updated;
      });
    }
  };

  const handleToggleSound = () => {
    setSoundOn(toggleSoundPref());
  };

  const handleFinishQuiz = () => {
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const tier = getTier(percentage);
    if (tier.confetti) {
      setConfettiBurst((n) => n + 1);
    }
    playFinishSound();
    setFinishModal(true);
  };

  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  const tier = getTier(percentage);

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <p className="text-sm text-slate-500">প্রশ্ন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-100 via-slate-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">

      <ConfettiBurst trigger={confettiBurst} />

      {/* Top bar */}
      <div className="shrink-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-slate-200/70 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-3 py-2.5 flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 shrink-0 active:scale-90 transition-transform"
            aria-label={soundOn ? "সাউন্ড বন্ধ করো" : "সাউন্ড চালু করো"}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <div className="flex-1 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 px-2.5 py-1 text-xs font-bold">
              <Flame className="h-3.5 w-3.5" />
              {correctCount}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-2.5 py-1 text-xs font-bold">
              <FaStar className="text-yellow-500 dark:text-yellow-300 text-[11px]" />
              {quizBattlePoint || "0"} PP
            </div>
          </div>

          <button
            onClick={handleFinishQuiz}
            className="flex items-center gap-1.5 rounded-full bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 active:scale-95 transition-transform"
          >
            <Flag className="h-3.5 w-3.5" />
            Finish Quiz
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-3 pt-4 pb-4">
          <BattleMcqExamCard
            question={currentQuestion}
            key={currentQuestion.id}
            onAnswered={handleAnswered}
          />
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-96 lg:right-28 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-t border-slate-200/70 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-3 py-2.5">
          <Button
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-white shadow-lg shadow-blue-200/70 dark:shadow-none disabled:opacity-50 transition-all active:scale-[0.98]"
            onClick={handleNext}
            disabled={!nextQuestion}
          >
            {nextQuestion ? "পরের প্রশ্ন" : "লোড হচ্ছে..."}
          </Button>
        </div>
      </div>

      {/* Streak / milestone modal (Duolingo-style) */}
      {streakModal && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 qb-fade-in">
          <div className="w-full sm:max-w-sm bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl p-6 text-center qb-slide-up">
            <div className="text-6xl mb-3">{streakModal.emoji}</div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {streakModal.count}টি প্রশ্নে সঠিক উত্তর!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{streakModal.text}</p>
            <Button
              className="h-11 w-full mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white"
              onClick={() => setStreakModal(null)}
            >
              চালিয়ে যাও
            </Button>
          </div>
        </div>
      )}

      {/* Finish quiz modal */}
      {finishModal && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 qb-fade-in">
          <div className="w-full sm:max-w-sm bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl p-6 text-center qb-slide-up">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${tier.color} text-4xl shadow-lg qb-bounce-in`}
            >
              {tier.emoji}
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-4">
              {tier.label}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              তুমি {answeredCount}টি প্রশ্নের মধ্যে {correctCount}টির সঠিক উত্তর দিয়েছো
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>স্কোর</span>
                <span>{obtainedMarks} / {totalMarks} ({percentage}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${tier.color} transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="h-11 flex-1 rounded-2xl font-semibold"
                onClick={() => setFinishModal(false)}
              >
                চালিয়ে যাও
              </Button>
              <Button
                className="h-11 flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white"
                onClick={() => navigate("/QuizBattle")}
              >
                শেষ করো
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}