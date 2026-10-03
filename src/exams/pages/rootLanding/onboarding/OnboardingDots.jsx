function OnboardingDots({ total, activeIndex }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, idx) => (
        <span
          key={idx}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            idx === activeIndex
              ? "w-6 bg-gradient-to-r from-indigo-500 to-purple-500"
              : "w-1.5 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

export default OnboardingDots;