import { useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

// Bangla month names
const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
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
const banglaWeekDays = [
  "রবি",
  "সোম",
  "মঙ্গল",
  "বুধ",
  "বৃহঃ",
  "শুক্র",
  "শনি",
];

// English → Bangla digits
const toBanglaNumber = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => banglaDigits[d] || d)
    .join("");
};

function BanglaCalendar({ streakDates = []}) {
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

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

    const isToday = (date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };


  return (
    <div className="w-full font-siliguri bg-white sm:max-w-md md:max-w-md mx-auto border-2 rounded-md p-2 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mx-3 lg:mx-2">
        <button
          onClick={prevMonth}
          className="px-1 py-1 rounded-full hover:bg-gray-200"
        >
          <MdOutlineKeyboardArrowLeft size={28} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-extrabold">
          {banglaMonths[currentDate.getMonth()]}{" "}
          {toBanglaNumber(currentDate.getFullYear())}
        </h3>
        <button
          onClick={nextMonth}
          className="px-1 py-1 rounded-full hover:bg-gray-200"
        >
          <MdOutlineKeyboardArrowRight size={28} className="text-gray-600" />
        </button>
      </div>
      <div className="flex flex-col items-center">
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-extrabold mb-2 text-gray-600 w-full max-w-md">
          {banglaWeekDays.map((day, idx) => (
            <div key={idx} className="flex justify-center items-center">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-0.5 ml-6  font-extrabold text-center w-full max-w-md">
          {/* Empty spaces for first day */}
          {Array(firstDay.getDay())
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

          {daysArray.map((date) => (
            <div
              key={date.getDate()}
              className={`w-[30px] h-[30px] text-sm flex justify-center items-center rounded-full cursor-pointer
          ${isStreakDay(date) ? "bg-orange-500 border-1 border-orange-900 text-white" : isToday(date) ? "bg-gray-300 text-gray-700" : "text-gray-400"}`}
            >
              {toBanglaNumber(date.getDate())}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BanglaCalendar;
