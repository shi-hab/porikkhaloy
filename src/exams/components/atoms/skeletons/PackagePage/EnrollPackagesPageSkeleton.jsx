const EnrollPackagesPageSkeleton = () => {
  return (
    <div className="mt-6 mx-2 rounded-xl border border-emerald-200 bg-emerald-100 p-4 animate-pulse">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-7 w-52 rounded-full bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Image */}
            <div className="aspect-[14/13] bg-gray-300 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollPackagesPageSkeleton;