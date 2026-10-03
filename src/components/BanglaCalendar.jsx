import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Bangla month names
const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "অগাস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

// Bangla weekdays
const banglaWeekDays = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

// English → Bangla digits
const toBanglaNumber = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => banglaDigits[d] || d)
    .join("");
};

function BanglaCalendar({ streakDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const streakDays = streakDates.map((dateStr) => new Date(dateStr));

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const daysArray = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    daysArray.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
    );
  }

  const isStreakDay = (date) =>
    streakDays.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate(),
    );

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  return (
    <div className="font-siliguri w-full sm:max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="আগের মাস"
          className="h-9 w-9 grid place-content-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-base font-bold text-slate-800">
          {banglaMonths[currentDate.getMonth()]}{" "}
          {toBanglaNumber(currentDate.getFullYear())}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="পরের মাস"
          className="h-9 w-9 grid place-content-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center mb-1">
        {banglaWeekDays.map((day) => (
          <div key={day} className="text-[11px] font-semibold text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-y-1 place-items-center">
        {Array(firstDay.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

        {daysArray.map((date) => {
          const streak = isStreakDay(date);
          const today = isToday(date);
          return (
            <div
              key={date.getDate()}
              className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-semibold transition-colors
                ${
                  streak
                    ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm shadow-orange-200"
                    : today
                      ? "text-indigo-600 ring-2 ring-indigo-500"
                      : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              {toBanglaNumber(date.getDate())}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-orange-400 to-amber-500" />
          <span className="text-[11px] font-medium text-slate-500">
            অনুশীলন করেছো
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full ring-2 ring-indigo-500" />
          <span className="text-[11px] font-medium text-slate-500">আজ</span>
        </div>
      </div>
    </div>
  );
}

export default BanglaCalendar;