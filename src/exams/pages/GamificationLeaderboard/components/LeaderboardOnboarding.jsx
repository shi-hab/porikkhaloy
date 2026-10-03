import { Sparkles } from 'lucide-react';

export function LeaderboardOnboarding() {
  return (
    <div
      className="
        flex flex-col items-center justify-center text-center
        rounded-2xl border border-dashed border-gray-200 dark:border-gray-800
        py-16 px-6 gap-4
      "
    >
      <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-violet-500" />
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          লিডারবোর্ড এখনো খোলেনি
        </p>
        <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
          একটা exam সম্পন্ন করো, তাহলেই তোমার Badge আর leaderboard আনলক হয়ে যাবে।
        </p>
      </div>
    </div>
  );
}
