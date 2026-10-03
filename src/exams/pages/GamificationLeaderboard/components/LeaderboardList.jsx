// ── Single row ────────────────────────────────────────────────────────────────
function LeaderboardRow({ entry, rank, isPinned, isLast }) {
  const isTopThree = rank <= 3;

  const rankStyle = {
    1: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white',
    2: 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
    3: 'bg-gradient-to-br from-amber-500 to-amber-700 text-white',
  }[rank];

  return (
    <div
      className={`
        group flex items-center gap-4 py-3 transition-colors cursor-pointer
        ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}
        ${entry.is_me ? 'bg-violet-50/60 dark:bg-violet-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-900/40'}
        ${isPinned
          ? 'sticky top-0 z-10 shadow-sm bg-violet-50 dark:bg-violet-950/40 border-b-2 border-violet-200 dark:border-violet-800'
          : ''}
      `}
    >
      {/* Rank */}
      <span
        className={`
          w-7 h-7 shrink-0 rounded-full flex items-center justify-center
          text-[11px] font-bold tabular-nums
          ${isTopThree
            ? `${rankStyle} shadow-sm`
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
        `}
      >
        #{rank ?? '-'}
      </span>

      {/* Avatar */}
      <div
        className={`
          w-9 h-9 rounded-full shrink-0 flex items-center justify-center
          text-xs font-semibold bg-gray-300 dark:bg-gray-800
          ${entry.is_me ? 'ring-2 ring-offset-2 ring-violet-500 dark:ring-offset-gray-950' : ''}
        `}
      >
        {entry.student_name?.charAt(0)?.toUpperCase() || '?'}
      </div>

      {/* Name */}
      <span className="flex-1 min-w-0 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
        {entry.student_name}
        {entry.is_me && (
          <span className="ml-1.5 text-[11px] font-semibold text-violet-500 bg-violet-100 dark:bg-violet-900/40 px-1.5 py-0.5 rounded-full align-middle">
            তুমি
          </span>
        )}
      </span>

      {/* XP */}
      <span className="text-xs font-mono tabular-nums font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2.5 py-1 rounded-full shrink-0">
        {Number(entry.period_xp).toLocaleString()} XP
      </span>
    </div>
  );
}


// ── List ─────────────────────────────────────────────────────────────────────
/**
 * @param entries    - current page student list from backend
 * @param myEntry    - logged-in student entry (always sent by backend)
 * @param skipFirstN - how many top entries to skip (podium top-3 on page 1)
 * @param page       - current page number
 * @param perPage    - items per page
 */
export function LeaderboardList({ entries, myEntry, skipFirstN = 0, page = 1, perPage = 20 }) {
  const rest = entries.slice(skipFirstN);

  // Rank to show: prefer rank_in_class from DB, fallback to position-based
  const rankOf = (entry, positionInFull) =>
    entry.rank_in_class ?? (page - 1) * perPage + positionInFull;

  // Pin "mine" at top only when NOT visible in the current page slice
  const isMyEntryInList = rest.some((e) => e.student_id === myEntry?.student_id);
  const pinnedMine = myEntry && !isMyEntryInList ? myEntry : null;

  if (rest.length === 0 && !pinnedMine) return null;

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Pinned "তুমি" row — sticky, only when NOT in current page */}
      {pinnedMine && (
        <LeaderboardRow
          entry={pinnedMine}
          rank={rankOf(pinnedMine, pinnedMine.rank_in_class ?? '-')}
          isPinned
          isLast={rest.length === 0}
        />
      )}

      {/* Normal rows */}
      {rest.map((entry, i) => {
        const posInFull = skipFirstN + i + 1;
        return (
          <LeaderboardRow
            key={entry.student_id}
            entry={entry}
            rank={rankOf(entry, posInFull)}
            isLast={i === rest.length - 1}
          />
        );
      })}
    </div>
  );
}
