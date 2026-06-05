function MCQCardSkeleton() {
  return (
    <div className="animate-pulse border relative h-full p-2 overflow-hidden rounded-sm group bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Skeleton for question number & title */}
      <div className="h-8 w-full  bg-gray-300 dark:bg-gray-700 rounded  mb-3"></div>

      {/* Skeleton for tags */}
      <div className="flex justify-end items-center gap-1 mb-3">
        <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-5 w-5 ml-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* Skeleton for options */}
      <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="h-6 bg-gray-200 dark:bg-gray-700 rounded col-span-1 lg:col-span-1"
          />
        ))}
      </ul>

      
    </div>
  );
}

export default MCQCardSkeleton;
