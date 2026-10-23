const Bar = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-[#E3EBE6] ${className}`} />
);

/** Mirrors the real layout: image, meta card, buttons, details, routine. */
const LandingSkeleton = () => (
  <div className="font-siliguri" aria-busy="true" aria-label="লোড হচ্ছে">
    <Bar className="aspect-[16/9] w-full !rounded-3xl" />

    <div className="relative -mt-9 px-4">
      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#0C1B15] p-5">
        <div className="space-y-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
        </div>
        <div className="space-y-3">
          <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>

    <div className="mt-4 flex gap-2.5">
      <Bar className="h-12 flex-1" />
      <Bar className="h-12 flex-1" />
    </div>

    <div className="mt-6 space-y-2.5">
      <Bar className="h-7 w-3/4" />
      <Bar className="h-4 w-full" />
      <Bar className="h-4 w-5/6" />
    </div>

    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Bar key={i} className="h-20" />
      ))}
    </div>

    <div className="mt-6 space-y-2 rounded-[28px] bg-[#0C1B15] p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-white/10" />
      ))}
    </div>
  </div>
);

export default LandingSkeleton;