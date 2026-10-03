import { Crown } from 'lucide-react';

export function RankBadge({ rank }) {
    const isFirst = rank === 1;

    const rankStyles = {
        1: {
            bg: 'bg-gradient-to-b from-yellow-300 to-amber-500',
            ring: 'ring-2 ring-yellow-200 dark:ring-yellow-900',
            text: 'text-amber-900',
        },
        2: {
            bg: 'bg-gradient-to-b from-gray-200 to-gray-400',
            ring: 'ring-2 ring-gray-100 dark:ring-gray-700',
            text: 'text-gray-700',
        },
        3: {
            bg: 'bg-gradient-to-b from-orange-300 to-orange-500',
            ring: 'ring-2 ring-orange-100 dark:ring-orange-900',
            text: 'text-orange-900',
        },
    };

    const s = rankStyles[rank] ?? {
        bg: 'bg-gradient-to-b from-violet-300 to-violet-500',
        ring: 'ring-2 ring-violet-100 dark:ring-violet-900',
        text: 'text-violet-900',
    };

    return (
        <div className="relative flex items-center justify-center">
            {isFirst && (
                <Crown
                    className="absolute -top-3.5 w-4 h-4 text-yellow-400 drop-shadow-sm"
                    fill="currentColor"
                />
            )}
            <div
                className={`
          ${s.bg} ${s.ring} ${s.text}
          w-6 h-6 rounded-full flex items-center justify-center
          text-[11px] font-bold shadow-sm
        `}
            >
                {rank}
            </div>
        </div>
    );
}