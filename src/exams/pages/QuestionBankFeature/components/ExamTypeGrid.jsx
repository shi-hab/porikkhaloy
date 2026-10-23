import { motion } from "framer-motion";
import { examIcon } from "@/features/questionBankFeature/qbConfig";
import { GridSkeleton } from "./QbSkeletons";

export default function ExamTypeGrid({ items, loading, onPick }) {
  if (loading) return <GridSkeleton />;

  if (!items.length)
    return (
      <p className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500 dark:bg-gray-800">
        তোমার ক্লাসের জন্য এখনো কোনো প্রশ্ন যোগ হয়নি। কিছুদিন পর আবার দেখো।
      </p>
    );

  return (
    <div className="">
      {/* হেডার */}
      <header className="mb-3 rounded-2xl bg-blue-900 px-5 py-5 text-white">
        <h1 className="text-2xl font-bold md:text-3xl font-siliguri">ডিজিটাল প্রশ্নব্যাংক</h1>
        <p className="mt-1 text-sm text-blue-100">বেছে নাও, প্র্যাকটিস করো, সমাধান দেখো।</p>
      </header>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => {
        const Icon = examIcon(it.name);
        return (
          <motion.button
            key={it.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPick(it.id)}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-blue-900 dark:border-gray-700 dark:bg-gray-800"
          >
            {it.image ? (
              <img src={it.image} alt="" loading="lazy" className="h-11 w-11 rounded-xl object-cover" />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-900 text-white">
                <Icon size={22} />
              </span>
            )}
            <span>
              <span className="block text-lg font-bold text-slate-900 dark:text-white font-siliguri">{it.name}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
    </div>
  );
}