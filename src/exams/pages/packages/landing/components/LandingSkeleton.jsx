const Block = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-[#E1E8E3] ${className}`} />
);

const LandingSkeleton = () => {
  return (
    <div>
      <Block className="h-48 w-full sm:h-64" />
      <Block className="mt-4 h-7 w-3/4" />
      <Block className="mt-2 h-4 w-full" />
      <Block className="mt-1 h-4 w-2/3" />
      <Block className="mt-5 h-11 w-40 rounded-full" />

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Block key={i} className="h-20" />
        ))}
      </div>

      <Block className="mt-5 h-16 w-full" />

      <div className="mt-6 space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} className="h-4 w-full" />
        ))}
      </div>

      <Block className="mt-8 h-24 w-full" />
    </div>
  );
};

export default LandingSkeleton;