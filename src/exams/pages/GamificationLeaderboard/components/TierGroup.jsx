import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Podium } from './Podium';
import { LeaderboardList } from './LeaderboardList';
import { Pagination } from './Pagination';

export function TierGroup({
  tier,
  students,
  myEntry,
  studentCount,
  isMyTier,
  page,
  lastPage,
  perPage = 20,
  onPageChange,
}) {

  // page বদলালে page-এর একদম top-এ scroll করো
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // On page 1 the podium shows top-3, so skip them in the list.
  const skipFirstN = page === 1 ? 3 : 0;

  // ── Podium-এর জন্য XP/rank অনুযায়ী আসল top-3 sort করো ──────────────────
  // Backend `students` array-এ `mine` প্রথমে থাকে (pinned) তাই
  // rank_in_class (তারপর period_xp) দিয়ে আলাদা sort করতে হবে।
  const podiumEntries = [...students].sort((a, b) => {
    if (a.rank_in_class != null && b.rank_in_class != null) {
      return a.rank_in_class - b.rank_in_class;
    }
    return b.period_xp - a.period_xp;
  });

  return (
    <motion.div
      key={tier.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      layout
      className={`
        rounded-2xl border p-5 mb-6
        ${isMyTier
          ? 'border-violet-300 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/10'
          : 'border-gray-100 dark:border-gray-800'}
      `}
    >
      {studentCount !== 0 && (
        <>
          {/* Podium — only page 1, actual top 3 by rank */}
          {page === 1 && <Podium entries={podiumEntries} />}

          <LeaderboardList
            entries={students}
            myEntry={myEntry}
            skipFirstN={skipFirstN}
            page={page}
            perPage={perPage}
          />

          <Pagination page={page} lastPage={lastPage} onChange={onPageChange} />
        </>
      )}
    </motion.div>
  );
}
