/** One heading style for every section: serif title, siliguri subtitle. */
const LandingSectionHeading = ({ title, subtitle, tone = "light", align = "left", className = "" }) => {
  const dark = tone === "dark";
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <h2
        className={`font-serif text-[22px] font-bold leading-snug tracking-tight sm:text-[26px] ${
          dark ? "text-white" : "text-[#0C1B15]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-siliguri mt-1.5 text-[13px] leading-relaxed ${
            dark ? "text-emerald-100/60" : "text-[#5B6E64]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default LandingSectionHeading;