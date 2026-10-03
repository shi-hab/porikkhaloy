import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import OnboardingSlide from "./OnboardingSlide";
import OnboardingDots from "./OnboardingDots";
import { onboardingSlides } from "./onboardingData";

const SWIPE_THRESHOLD = 60;
export const ONBOARDING_KEY = "app_onboarding_seen";

function OnboardingFlow() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();
  const total = onboardingSlides.length;
  const isLast = index === total - 1;

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    navigate("/login", { replace: true });
  };

  const goNext = () => {
    if (isLast) return finishOnboarding();
    setDirection(1);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#030014] flex flex-col overflow-hidden font-siliguri">
      {!isLast && (
        <button
          onClick={finishOnboarding}
          className="absolute top-5 right-5 z-20 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5"
        >
          Skip
        </button>
      )}

      <div className="flex-1 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <OnboardingSlide slide={onboardingSlides[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 pb-8 pt-4">
        <OnboardingDots total={total} activeIndex={index} />

        <button
          onClick={goNext}
          className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.35)] active:scale-95 transition-all"
        >
          {isLast ? "শুরু করি" : "পরবর্তী"}
        </button>
      </div>
    </div>
  );
}

export default OnboardingFlow;