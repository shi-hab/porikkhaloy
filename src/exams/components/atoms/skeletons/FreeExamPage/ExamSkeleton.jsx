function ExamSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-md shadow-lg bg-gray-300 dark:bg-gray-700 p-4">
      {/* Title */}
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mx-auto mb-4"></div>

      {/* Info Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-900 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-900 rounded"></div>
        </div>

        <div className="hidden md:block h-5 w-px bg-gray-200 dark:bg-gray-900"></div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-900 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-900 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default ExamSkeleton