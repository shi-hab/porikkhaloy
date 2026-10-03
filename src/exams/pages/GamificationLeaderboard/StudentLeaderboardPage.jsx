import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

import {
  useGetLeaderboardQuery,
  useGetMyLeaderboardStatusQuery,
} from '@/features/GamificationLeaderboard/studentLeaderboardApi';

import { LeaderboardOnboarding } from './components/LeaderboardOnboarding';
import { LeaderboardSkeleton } from './components/LeaderboardSkeleton';
import { TierStrip } from './components/TierStrip';
import { TierGroup } from './components/TierGroup';
import { LeaderboardInfoTrigger } from './components/LeaderboardInfoModal';


function StudentLeaderboardPage() {
  // === CHANGE: default 'class' — normally "My Class" scope-e thakbe ===
  const [scope, setScope] = useState('class');
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [page, setPage] = useState(1);

  const { data: statusData, isLoading: isStatusLoading } = useGetMyLeaderboardStatusQuery();

  const hasStarted = statusData?.data?.has_started ?? false;
  const myStatus = statusData?.data?.status;

  const { data: leaderboardData, isLoading: isBoardLoading, isFetching: isBoardFetching } =
    useGetLeaderboardQuery(
      { myClass: scope === 'class', page },
      { skip: isStatusLoading || !hasStarted }
    );

  const tierGroups = leaderboardData?.data?.tiers || [];
  const myTierId = myStatus?.tier?.id;

  const sortedTiers = useMemo(
    () => [...tierGroups].sort((a, b) => a.tier.sort_order - b.tier.sort_order),
    [tierGroups]
  );

  useEffect(() => {
    if (selectedTierId !== null) return;
    if (myTierId) setSelectedTierId(myTierId);
    else if (sortedTiers.length > 0) setSelectedTierId(sortedTiers[0].tier.id);
  }, [myTierId, sortedTiers, selectedTierId]);

  // Reset to page 1 whenever the selected tier or scope changes.
  useEffect(() => {
    setPage(1);
  }, [selectedTierId, scope]);

  const totalStudents = tierGroups.reduce((sum, group) => sum + (group.student_count || 0), 0);
  const selectedGroup = sortedTiers.find((group) => group.tier.id === selectedTierId);

  const showSkeleton = isStatusLoading || (hasStarted && (isBoardLoading || isBoardFetching));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6" style={{ overflowAnchor: 'none' }}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-violet-500" />
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Leaderboard</h1>
        <LeaderboardInfoTrigger />
      </div>

      {/* Self-এর global rank — শুধু এখানেই দেখাবে, list-এর row-তে না */}
      {/* {!showSkeleton && hasStarted && myStatus?.rank_global && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Global Rank: <b className="text-gray-800 dark:text-gray-100">#{myStatus.rank_global}</b>
        </p>
      )} */}

      {showSkeleton && <LeaderboardSkeleton />}

      {!showSkeleton && !hasStarted && <LeaderboardOnboarding />}

      {!showSkeleton && hasStarted && (
        <>
          {sortedTiers.length > 0 && (
            <TierStrip
              tiers={sortedTiers.map((group) => group.tier)}
              selectedTierId={selectedTierId}
              myTierId={myTierId}
              onSelect={setSelectedTierId}
              status={myStatus}
            />
          )}

          {/* <div className="flex gap-1.5 mb-5 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 w-fit">
            {[
              { key: 'global', label: 'Global' },
              { key: 'class', label: 'My Class' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setScope(tab.key)}
                className={`
                  px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${scope === tab.key
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div> */}

          {totalStudents === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <Flame className="w-7 h-7 text-gray-300" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                কোনো স্টুডেন্ট পাওয়া যায়নি
              </p>
            </div>
          )}

          {totalStudents > 0 && (
            <AnimatePresence mode="wait">
              {selectedGroup && (
                <TierGroup
                  key={selectedGroup.tier.id}
                  tier={selectedGroup.tier}
                  students={selectedGroup.students}
                  myEntry={selectedGroup.my_entry}
                  studentCount={selectedGroup.student_count}
                  isMyTier={selectedGroup.tier.id === myTierId}
                  page={selectedGroup.pagination?.page ?? page}
                  lastPage={selectedGroup.pagination?.last_page ?? 1}
                  perPage={selectedGroup.pagination?.per_page ?? 50}
                  onPageChange={setPage}
                />
              )}
            </AnimatePresence>
          )}
        </>
      )
      }
    </div >
  );
}

export default StudentLeaderboardPage;