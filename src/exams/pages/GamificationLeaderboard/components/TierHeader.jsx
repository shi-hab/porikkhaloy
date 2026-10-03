import { getTierIconStyle } from '@/features/GamificationLeaderboard/tierIconStyles';

export function TierHeader({ tier, studentCount, isMyTier }) {
  const { Icon, badge, ring, text } = getTierIconStyle(tier.icon);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ring-2 ${ring} ${badge}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <p className={`text-sm font-semibold ${text}`}>{tier.name}</p>
          <p className="text-[11px] text-gray-400">
            {Number(tier.min_xp).toLocaleString()}–{Number(tier.max_xp).toLocaleString()} XP
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isMyTier && (
          <span className="text-[11px] font-medium text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded-full">
            তোমার Tier
          </span>
        )}
        <span className="text-[11px] text-gray-400">{studentCount} জন</span>
      </div>
    </div>
  );
}
