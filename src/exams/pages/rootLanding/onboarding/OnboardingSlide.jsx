import { AppMockupScreen } from "../components/AppMockupScreen";

function OnboardingSlide({ slide }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center">
      <div className="w-full max-w-[220px] mb-8">
        <AppMockupScreen type={`${slide.screenType}_1`} />
      </div>

      {slide.badge && (
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-3">
          {slide.badge}
        </span>
      )}

      <h2 className="text-xl font-black text-white leading-snug mb-2">
        {slide.title}
      </h2>

      {slide.description && (
        <p className="text-sm text-slate-300/90 leading-relaxed max-w-xs">
          {slide.description}
        </p>
      )}
    </div>
  );
}

export default OnboardingSlide;