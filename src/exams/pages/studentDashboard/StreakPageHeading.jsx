import toBanglaNumeral from "@/utils/Tobangla";
import { PiFireBold } from "react-icons/pi";

function StreakPageHeading({ StudentStreak, quizBattlePoint }) {
  const { current_streak } = StudentStreak;

  return (
    <div className="flex relative  justify-between items-center mx-4">
      <div className="flex flex-col  items-start justify-center gap-1">
        <div>
          <span className="streak-stroke font-sans text-[80px] font-extrabold animate-bounce">
            {current_streak || "0"}
          </span>
        </div>

        <p className="text-2xl font-siliguri font-extrabold text-orange-400">
          দিনের ধারাবাহিকতা!
        </p>

        <p className="bg-white px-4 py-3 rounded-lg font-bold text-xl shadow-xl text-orange-600">
          PP : {toBanglaNumeral(quizBattlePoint || "০") || "০"}
        </p>
      </div>

      <PiFireBold
        size={130} // icon বড় হবে
        className="absolute right-4 rotate-[-20deg] opacity-10 pointer-events-none "
      />
    </div>
  );
}

export default StreakPageHeading;
