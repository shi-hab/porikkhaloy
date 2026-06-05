function StreakPageHeadingSkeleton() {
  return (
    <div className="flex relative justify-between items-center mx-4 animate-pulse">
      <div className="flex flex-col items-start justify-center gap-2">
        <div className="h-16 w-28 bg-gray-300 rounded-md"></div>
        <div className="h-6 w-40 bg-gray-200 rounded-md"></div>
      </div>
      <div className="absolute right-4 w-28 h-28 bg-gray-300 rounded-full opacity-40 pointer-events-none"></div>
    </div>
  );
}

export default StreakPageHeadingSkeleton