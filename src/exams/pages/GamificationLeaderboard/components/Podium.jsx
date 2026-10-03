import { RankBadge } from './RankBadge';

const PODIUM_STYLES = [
  {
    place: 1,
    ring: 'ring-yellow-300 dark:ring-yellow-700',
    badge: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    size: 'w-20 h-20',
    label: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    place: 2,
    ring: 'ring-gray-300 dark:ring-gray-700',
    badge: 'bg-gradient-to-br from-gray-300 to-gray-400',
    size: 'w-16 h-16',
    label: 'text-gray-500 dark:text-gray-400',
  },
  {
    place: 3,
    ring: 'ring-amber-300 dark:ring-amber-800',
    badge: 'bg-gradient-to-br from-amber-500 to-amber-700',
    size: 'w-16 h-16',
    label: 'text-amber-700 dark:text-amber-500',
  },
];

export function Podium({ entries }) {
  const top3 = entries.slice(0, 3);
  if (top3.length === 0) return null;

  // Visual order: 2nd - 1st - 3rd (মাঝে সবচেয়ে বড়টা)
  const order = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="flex items-end justify-center gap-8 mb-6 pt-4">
      {order.map((entry) => {
        // entry.rank_in_class অনুযায়ী সঠিক podium style খুঁজে বের করা
        const style = PODIUM_STYLES.find((s) => s.place === entry.rank_in_class) ?? PODIUM_STYLES[0];

        return (
          <div key={entry.student_id} className="flex flex-col items-center">
            <div className="mb-1">
              <RankBadge rank={entry.rank_in_class} />
            </div>

            <div
              className={`
                ${style.size} rounded-full flex items-center justify-center
                text-white font-bold text-lg ring-4 ${style.ring} ${style.badge}
                ${entry.is_me ? 'outline outline-2 outline-offset-2 outline-violet-500' : ''}
              `}
            >
              {entry.student_name?.charAt(0)?.toUpperCase() || '?'}
            </div>

            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mt-2 max-w-[80px] truncate text-center">
              {entry.student_name}
            </p>

            <p className={`text-[11px] font-mono tabular-nums font-semibold ${style.label}`}>
              {Number(entry.period_xp).toLocaleString()} XP
            </p>
          </div>
        );
      })}
    </div>
  );
}