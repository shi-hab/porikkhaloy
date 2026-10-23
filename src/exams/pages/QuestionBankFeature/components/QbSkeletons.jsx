const Bar = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-gray-700 ${className}`} />
);

export const ListSkeleton = ({ rows = 5 }) => (
  <div className="grid gap-2.5">
    {Array.from({ length: rows }).map((_, i) => (
      <Bar key={i} className="h-16" />
    ))}
  </div>
);

export const GridSkeleton = () => (
  <div className="grid grid-cols-2 gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <Bar key={i} className="h-28" />
    ))}
  </div>
);

export const QuestionSkeleton = () => (
  <div className="grid gap-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-2xl border border-slate-200 p-4 dark:border-gray-700">
        <Bar className="mb-3 h-5 w-4/5" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((__, j) => (
            <Bar key={j} className="h-10" />
          ))}
        </div>
      </div>
    ))}
  </div>
);