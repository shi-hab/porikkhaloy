import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Spin } from "antd";
import { Button } from "@/components/ui/button";
import { RotateCcw, SquareCheck, CircleX } from "lucide-react";
import toBanglaNumeral from "@/utils/Tobangla";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";
import { useGetQbQuestionsQuery } from "@/features/questionBankFeature/questionBankApi";
import { FREE_QUESTION_LIMIT } from "@/features/questionBankFeature/qbConfig";
import { QuestionSkeleton } from "./QbSkeletons";
import { useNavigate } from "react-router-dom";

// ⚠️ এই ৩টা import আপনার প্রজেক্টের আসল পাথ অনুযায়ী মিলিয়ে নিন
import QuestionCard from "@/exams/components/molecules/questionList/QuestionCard";
import { CreativeExamForMT } from "@/exams/components/molecules/packages/mtexam/CreativeExamForMT";
import { NormalExamForMT } from "@/exams/components/molecules/packages/mtexam/NormalExamForMT";
/**
 * args বদলালে এই কম্পোনেন্ট key দিয়ে নতুন করে বসে, তাই page নিজে নিজে ১ এ ফেরে।
 */
export default function QuestionFeed({ args }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showPremium, setShowPremium] = useState(false);
  const [hideAns, setHideAns] = useState(false); // লাইভ কুইজ
  const [restart, setRestart] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const sentinel = useRef(null);

  const { data: maxFree } = useGetMaxFreeExamQuery();
  const locked = maxFree?.verified === "inactive";

  const { data, isFetching, isLoading } = useGetQbQuestionsQuery({ ...args, perPage: 20, page });
  const questions = data?.data ?? [];
  const hasMore = !!data?.next_page_url;

  // নিচে পৌঁছালেই পরের পেজ আনো (Load More বাটন লাগে না)
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || isFetching || showPremium) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (locked && questions.length >= FREE_QUESTION_LIMIT) setShowPremium(true);
        else setPage((p) => p + 1);
      },
      { rootMargin: "500px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isFetching, showPremium, locked, questions.length]);

  const onRestart = () => {
    setRestart(true);
    setTimeout(() => setRestart(false), 200);
    setHideAns(false);
    setCorrect(0);
    setWrong(0);
  };

  const onCount = ({ correct: c, wrong: w }) => {
    setCorrect((p) => p + c);
    setWrong((p) => p + w);
  };

  if (isLoading) return <QuestionSkeleton />;

  if (!questions.length)
    return (
      <p className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500 dark:bg-gray-800">
        এই সিলেকশনে কোনো প্রশ্ন নেই। উপরের ফিল্টার বদলে দেখো।
      </p>
    );

  return (
    <div>
      {/* লাইভ কুইজ কন্ট্রোল */}
      <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-gray-800">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-800 dark:text-gray-200">
          <input
            type="checkbox"
            checked={hideAns}
            onChange={(e) => setHideAns(e.target.checked)}
            className="h-4 w-4 accent-blue-900"
          />
          লাইভ কুইজ দাও
        </label>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white"
        >
          <RotateCcw size={15} /> রিস্টার্ট
        </button>
      </div>

      <div className="grid gap-2">
        {questions.map((q, index) => {
          const blurred = locked && index >= FREE_QUESTION_LIMIT;
          return (
            <div
              key={`${q.id}-${index}`}
              className={blurred ? "pointer-events-none select-none blur-md" : ""}
            >
              {q.type === "mcq" && (
                <QuestionCard
                  data={q}
                  index={index}
                  verified={maxFree}
                  hideAns={hideAns}
                  restart={restart}
                  onCountUpdate={onCount}
                />
              )}
              {q.type === "creative" && <CreativeExamForMT question={q} queIndex={index} verified={maxFree} />}
              {q.type === "normal" && <NormalExamForMT question={q} queIndex={index} verified={maxFree} />}
            </div>
          );
        })}
      </div>

      {hasMore && !showPremium && (
        <div ref={sentinel} className="flex h-16 items-center justify-center">
          {isFetching && <Spin size="small" />}
        </div>
      )}

      {showPremium && locked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-800 p-8 text-center text-white shadow-xl"
        >
          <h2 className="text-2xl font-bold">আরও হাজারো প্রশ্ন আনলক করো</h2>
          <p className="mt-2 text-gray-200">
            Premium নিয়ে সব প্রশ্ন, ব্যাখ্যা ও সমাধান দেখো এবং লাইভ কুইজ দাও।
          </p>
          <Button
            className="mt-5 bg-white px-8 py-5 font-bold text-blue-900 hover:bg-gray-100"
            onClick={() => navigate("/subscriptions")}
          >
            Premium কিনো
          </Button>
        </motion.div>
      )}

      {/* লাইভ কুইজের স্কোর বার */}
      {hideAns && (
        <div className="fixed bottom-0 left-0 z-50 w-full bg-blue-900 text-white shadow-2xl">
          <div className="mx-auto flex max-w-7xl justify-around py-3 text-sm font-bold">
            <span>মোট: {toBanglaNumeral(correct + wrong)}</span>
            <span className="flex items-center gap-1">
              <SquareCheck size={16} /> {toBanglaNumeral(correct)}
            </span>
            <span className="flex items-center gap-1">
              <CircleX size={16} /> {toBanglaNumeral(wrong)}
            </span>
            <span>মার্ক: {toBanglaNumeral(correct - wrong * 0.25)}</span>
          </div>
        </div>
      )}
    </div>
  );
}