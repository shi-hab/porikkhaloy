import { useGetStreakDataQuery } from "@/features/studentDashboard/dashboardApi";
import PracticeStreak from "./PracticeStreak";
import StreakPageHeading from "./StreakPageHeading";
import { BiSolidLock } from "react-icons/bi";
import StreakPageSkeleton from './../../components/atoms/skeletons/StreakProfilePage/StreakPageSkeleton';

function StreakProfilePage() {
  const { data: streakData, isLoading } = useGetStreakDataQuery();

  const studentStreakDay = streakData?.studentStreakDay || [];
  const StudentStreak = streakData?.studentStreak || [];
  const quizBattlePoint = streakData?.quizBattlePoint || [];

  return (
    <div>
      {isLoading ? (
        <div>
          <StreakPageSkeleton />
        </div>
      ) : (
        <div>
          <div className="bg-orange-100  px-2 py-10 ">
            <StreakPageHeading
              StudentStreak={StudentStreak}
              quizBattlePoint={quizBattlePoint}
            />
          </div>

          <div>
            <PracticeStreak studentStreakDay={studentStreakDay} />
          </div>

          {/* Streak Society */}
          <div className="py-6 px-2 bg-orange-50">
            <h1 className="text-2xl ml-2 font-extrabold  mb-3 text-gray-800 dark:text-gray-100">
              স্ট্রিক সোসাইটি
            </h1>

            <div className="flex items-center justify-center gap-2 bg-white rounded-lg py-6 px-2 shadow border-2">
              <div>
                <BiSolidLock size={90} className="opacity-50" />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-green-900 text-md font-bold">
                  স্ট্রিক সোসাইটিতে যোগ দিতে হলে গড়ে তুলো টানা ১৫ দিনের
                  ধারাবাহিকতা এবং জিতে নাও টি-শার্টসহ আরো গিফট।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreakProfilePage;
