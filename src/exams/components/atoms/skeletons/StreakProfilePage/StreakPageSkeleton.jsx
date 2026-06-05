import BanglaCalendarSkeleton from "./BanglaCalendarSkeleton";
import StreakPageHeadingSkeleton from "./StreakPageHeadingSkeleton";
import StreakSocietySkeleton from "./StreakSocietySkeleton";

function StreakPageSkeleton() {
  return (
    <div>
      <div className="bg-orange-100 px-2 py-8">
        <StreakPageHeadingSkeleton />
      </div>

      <div className="mt-6 px-2">
        <BanglaCalendarSkeleton />
      </div>

      <StreakSocietySkeleton />
    </div>
  );
}

export default StreakPageSkeleton;
