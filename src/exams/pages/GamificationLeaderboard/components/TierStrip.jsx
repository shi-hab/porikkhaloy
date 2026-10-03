import { motion } from 'framer-motion';
import { getTierIconStyle } from '@/features/GamificationLeaderboard/tierIconStyles';
import { TierProgress } from './TierProgress';

export function TierStrip({ tiers, selectedTierId, myTierId, onSelect, status }) {
  const myTier = tiers.find((tier) => tier.id === myTierId);
  const selectedTier = tiers.find((tier) => tier.id === selectedTierId);

  const isSelectedLocked = !!(
    myTier && selectedTier && selectedTier.sort_order > myTier.sort_order
  );

  return (
    <div
      className="
        rounded-2xl mb-6
        bg-gradient-to-b from-amber-50 to-white
        dark:from-gray-900 dark:to-gray-900/40
        border border-gray-100 dark:border-gray-800
      "
    // NOTE: intentionally no `overflow-hidden` here — that was clipping
    // the horizontally-scrollable row below and killing touch scroll.
    >
      <div
        className="
          flex items-end gap-4 sm:gap-6
          overflow-x-auto px-5 pt-5 pb-4
          snap-x snap-proximity
          rounded-t-2xl
          [&::-webkit-scrollbar]:hidden
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
          touchAction: 'pan-x', // 👈 নতুন — horizontal swipe সাথে সাথে register হবে
        }}
      >
        {tiers.map((tier) => {
          const isSelected = tier.id === selectedTierId;
          const isLocked = myTier ? tier.sort_order > myTier.sort_order : false;
          const { Icon, badge, ring } = getTierIconStyle(tier.icon);
          const sizeClass = isSelected ? 'w-16 h-16' : 'w-11 h-11';
          const iconSizeClass = isSelected ? 'w-8 h-8' : 'w-5 h-5';

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className="flex flex-col items-center gap-1 shrink-0 snap-center"
              aria-pressed={isSelected}
              aria-label={tier.name}
            >
              {isSelected && (
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {tier.name}
                </p>
              )}

              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`
                ${sizeClass} rounded-2xl flex items-center justify-center
                text-white ${badge}
                ${isSelected ? `ring-4 ${ring}` : ''}
                ${isLocked ? 'grayscale opacity-50' : ''}
              `}
              >
                <Icon className={iconSizeClass} />
              </motion.div>
            </button>
          );
        })}
      </div>

      {selectedTier && (
        <div className="px-5 pb-5">
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            {selectedTier.id === myTierId && <TierProgress status={status} />}

            {isSelectedLocked && (
              <div className="mt-4 bg-gray-100 dark:bg-gray-800/60 text-center py-2.5 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  এই লীগ আনলক করতে আগের লীগগুলো সম্পন্ন করো
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
