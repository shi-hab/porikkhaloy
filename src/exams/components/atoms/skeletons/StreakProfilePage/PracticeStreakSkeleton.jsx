function PracticeStreakSkeleton() {
  return (
    <div className="flex justify-center gap-2 mt-4 animate-pulse">
      {Array(7)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-gray-200 rounded-full border border-gray-300"
          ></div>
        ))}
    </div>
  );
}

export default PracticeStreakSkeleton;
