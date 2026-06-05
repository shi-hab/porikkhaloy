import BanglaCalendar from "@/components/BanglaCalendar";

function PracticeStreak({ studentStreakDay }) {
  return (
    <div className=" bg-white rounded  p-4">
      {/* Title */}
      <h2 className="text-2xl ml-2 font-extrabold  mb-3 text-gray-800 dark:text-gray-100">
        ধারাবাহিকতার ক্যালেন্ডার
      </h2>
      {/* Calendar */}
      <div className="flex justify-center">
        <BanglaCalendar streakDates={studentStreakDay} />
      </div>
    </div>
  );
}

export default PracticeStreak;
