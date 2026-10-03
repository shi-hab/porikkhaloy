import { motion } from 'framer-motion';
import { getTierIconStyle } from '@/features/GamificationLeaderboard/tierIconStyles';

export function TierProgress({ status }) {
  if (!status?.tier) return null;

  const { tier, period_xp } = status;
  const currentXp = Number(period_xp || 0);
  const minXp = Number(tier.min_xp || 0);
  const maxXp = Number(tier.max_xp || 0);
  const safeZoneXp = Number(tier.safe_zone_xp ?? minXp);
  const span = Math.max(maxXp - minXp, 1);

  const currentPct = Math.min(100, Math.max(0, ((currentXp - minXp) / span) * 100));
  const safeZonePct = Math.min(100, Math.max(0, ((safeZoneXp - minXp) / span) * 100));

  const { bar } = getTierIconStyle(tier.icon);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono text-gray-400">{minXp.toLocaleString()} XP</span>
        <span className="text-[10px] font-mono font-semibold text-gray-600 dark:text-gray-300">
          {maxXp.toLocaleString()} XP
        </span>
      </div>

      <div className="relative pt-7 pb-8">
        <motion.div
          className="absolute top-0 -translate-x-1/2"
          animate={{ left: `${safeZonePct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-semibold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
              Safe Zone
            </span>
            <span className="text-[9px] font-mono whitespace-nowrap text-gray-400">
              {safeZoneXp.toLocaleString()} XP
            </span>
          </div>
        </motion.div>

        <div className="relative h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-100 dark:bg-emerald-950/40"
            animate={{ width: `${safeZonePct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />

          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${bar}`}
            animate={{ width: `${currentPct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-emerald-500 shadow-sm z-10"
            style={{ marginLeft: -8 }}
            animate={{ left: `${safeZonePct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-[3px] border-violet-500 shadow-md z-20"
            style={{ marginLeft: -10 }}
            animate={{ left: `${currentPct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>

        <motion.div
          className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center"
          animate={{ left: `${currentPct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <span className="text-[10px] font-bold font-mono whitespace-nowrap text-gray-700 dark:text-gray-200">
            {currentXp.toLocaleString()} XP
          </span>
        </motion.div>
      </div>
    </div>
  );
}
