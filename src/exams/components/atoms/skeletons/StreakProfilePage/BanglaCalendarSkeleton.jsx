function BanglaCalendarSkeleton() {
  return (
    <div className="w-full font-siliguri bg-white sm:max-w-md md:max-w-md mx-auto border-2 rounded-md p-4 shadow animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mx-3 lg:mx-2">
        <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
        <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {Array(7)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className="h-4 w-full bg-gray-200 rounded-md"></div>
          ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 ml-4">
        {Array(35)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="w-[28px] h-[28px] bg-gray-200 rounded-full"
            ></div>
          ))}
      </div>
    </div>
  );
}

export default BanglaCalendarSkeleton;
