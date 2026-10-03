import { Flame } from "lucide-react";
import BanglaCalendar from "@/components/BanglaCalendar";

function PracticeStreak({ studentStreakDay = [] }) {
  const totalPracticeDays = studentStreakDay?.length || 0;

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          ধারাবাহিকতার ক্যালেন্ডার
        </h2>
        {totalPracticeDays > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5">
            <Flame size={13} className="fill-orange-500 text-orange-500" />
            মোট {totalPracticeDays} দিন অনুশীলন
          </span>
        )}
      </div>

      <div className="flex justify-center">
        <BanglaCalendar streakDates={studentStreakDay} />
      </div>
    </div>
  );
}

export default PracticeStreak;