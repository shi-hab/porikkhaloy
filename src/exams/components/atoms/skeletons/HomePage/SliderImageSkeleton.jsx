function SliderImageSkeleton() {
  return (
    <div className="relative w-full overflow-hidden rounded-md shadow-lg bg-gray-200 animate-pulse">
      {/* Background */}
      <div className="w-full h-full bg-gray-300 rounded-md " />

      {/* Center Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-20"></div>
    </div>
  );
}

export default SliderImageSkeleton;
