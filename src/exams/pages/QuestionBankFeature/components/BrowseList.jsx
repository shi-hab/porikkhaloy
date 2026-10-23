import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import toBanglaNumeral from "@/utils/Tobangla";
import { ListSkeleton } from "./QbSkeletons";

export default function BrowseList({ title, items, loading, onPick }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
      {loading ? (
        <ListSkeleton />
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2">
          {items.map((it) => (
            <motion.button
              key={it.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(it.id)}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:border-blue-900 dark:border-gray-700 dark:bg-gray-800"
            >
              {it.image && (
                <img src={it.image} alt="" loading="lazy" className="mr-3 h-12 w-12 shrink-0 rounded-lg object-cover" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-slate-900 dark:text-white">{it.name}</span>
                <span className="text-sm text-slate-500 dark:text-gray-400">
                  {toBanglaNumeral(it.count)} টি প্রশ্ন
                </span>
              </span>
              <ChevronRight className="text-slate-400" size={20} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}