const PackagesPageSkeleton = () => {
  return (
    <div className="container animate-pulse">
      {/* Sticky Category */}
      <div className="sticky top-14 md:top-0 z-50 py-2.5 px-1 bg-[#f4f4f5] border-b dark:bg-gray-900 rounded-md">
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24  rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-10 mt-4">
        {Array.from({ length: 2 }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-slate-100 border border-slate-200 rounded-xl p-4"
          >
            {/* Section Title */}
            <div className="h-8 w-52 rounded-full bg-gray-300 dark:bg-gray-700 mb-5" />

            {/* Package Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden bg-white shadow"
                >
                  {/* Image */}
                  <div className="aspect-[14/13] bg-gray-300 dark:bg-gray-700" />
                  
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesPageSkeleton;