function StreakSocietySkeleton() {
  return (
    <div className="mt-6 px-2 animate-pulse">
      <div className="h-8 w-48 bg-gray-300 rounded-md mb-3"></div>
      <div className="flex items-center justify-center gap-4 bg-gray-200 rounded-lg py-6 px-2 border-2">
        <div className="w-20 h-20 bg-gray-300 rounded-full opacity-50"></div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-8 w-full bg-gray-300 rounded-md"></div>
          <div className="h-3 w-3/4 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default StreakSocietySkeleton;
