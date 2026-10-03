import { Skeleton } from '@/components/ui/skeleton';

// ─── TierStrip skeleton ──────────────────────────────────────────────────────
// Mirrors: rounded-2xl mb-6, gradient bg, border
//   └─ scroll row: items-end gap-4, px-5 pt-5 pb-4
//       one "selected" icon (w-16 h-16) + 4 smaller (w-11 h-11)
//   └─ border-t section (px-5 pb-5):
//       TierProgress → label row, progress bar area with safe-zone + XP labels

function TierStripSkeleton() {
  return (
    <div className="rounded-2xl mb-6 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
      {/* scroll row — mirrors flex items-end gap-4 px-5 pt-5 pb-4 */}
      <div className="flex items-end gap-4 sm:gap-6 px-5 pt-5 pb-4">
        {/* smaller icons before selected */}
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />

        {/* selected (taller) */}
        <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />

      </div>

      {/* border-t + TierProgress — mirrors px-5 pb-5, pt-4 */}
      <div className="px-5">
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          {/* XP range labels row — mirrors flex justify-between mb-1.5 */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-2.5 w-14" />
          </div>

          {/* progress bar area — mirrors relative pt-7 pb-8 */}
          <div className="relative pt-2 pb-8">
            {/* the bar itself */}
            <div className="relative h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <Skeleton className="absolute inset-0 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Scope tabs skeleton ─────────────────────────────────────────────────────
// Mirrors: flex gap-1.5 mb-5 p-1 rounded-xl bg-gray-100 w-fit
//   two tab buttons: px-3.5 py-1.5 rounded-lg text-xs

function ScopeTabsSkeleton() {
  return (
    <div className="flex gap-1.5 mb-5 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 w-fit">
      <Skeleton className="h-7 w-16 rounded-lg" />
      <Skeleton className="h-7 w-20 rounded-lg" />
    </div>
  );
}


// ─── TierHeader skeleton ─────────────────────────────────────────────────────
// Mirrors: flex items-center justify-between mb-4
//   left: flex gap-3 → icon (w-10 h-10 rounded-xl) + name/range stack
//   right: badge pill + count

function TierHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}


// ─── Podium skeleton ─────────────────────────────────────────────────────────
// Mirrors: flex items-end justify-center gap-4 sm:gap-8 mb-8 pt-2
//   Order rendered: 2nd place (w-16 h-16), 1st (w-20 h-20), 3rd (w-16 h-16)
//   Each has avatar + name label + XP label below

function PodiumSkeleton() {
  return (
    <div className="flex items-end justify-center gap-4 sm:gap-8 mb-4">
      {/* 2nd place */}
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-2.5 w-14 mt-1" />
        <Skeleton className="h-2 w-10" />
      </div>

      {/* 1st place — tallest */}
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-2.5 w-16 mt-1" />
        <Skeleton className="h-2 w-12" />
      </div>

      {/* 3rd place */}
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-2.5 w-14 mt-1" />
        <Skeleton className="h-2 w-10" />
      </div>
    </div>
  );
}


// ─── LeaderboardList skeleton ─────────────────────────────────────────────────
// Mirrors: rounded-2xl border overflow-hidden
//   rows: flex items-center gap-3 px-4 py-3 border-b last:border-b-0
//     rank (w-6) | avatar (w-8 h-8 rounded-full) | name (flex-1) | XP (w-12)

function LeaderboardListSkeleton({ rows = 7 }) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 ${i !== rows - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
            }`}
        >
          <Skeleton className="w-5 h-3 shrink-0" />
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <Skeleton className="h-3.5 flex-1" />
          <Skeleton className="h-3.5 w-14 shrink-0" />
        </div>
      ))}
    </div>
  );
}


// ─── TierGroup skeleton ───────────────────────────────────────────────────────
// Mirrors: rounded-2xl border p-5 mb-6 (violet tint on my tier — use neutral for skeleton)
//   TierHeader → Podium → LeaderboardList

function TierGroupSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <PodiumSkeleton />
      <LeaderboardListSkeleton rows={7} />
    </div>
  );
}


// ─── Main exported skeleton ───────────────────────────────────────────────────
// Mirrors the full StudentLeaderboardPage layout exactly (minus the page header
// which stays visible throughout loading).

export function LeaderboardSkeleton() {
  return (
    <div>
      <TierStripSkeleton />
      <TierGroupSkeleton />
    </div>
  );
}
