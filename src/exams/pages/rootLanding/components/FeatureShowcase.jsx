import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  X,
} from "lucide-react";
import { AppMockupScreen } from "./AppMockupScreen";
import { featuresData } from "../data/mockData";
import { isApp } from "@/File/device";

const TRANSITION_MS = 700;
const SWIPE_THRESHOLD = 30;

function FeatureShowcase({
  onNextSection,
  onPreviousSection,
  onSkip,
}) {
  const count = featuresData.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const wrapperRef = useRef(null);
  const activeIndexRef = useRef(0);
  const cooldownRef = useRef(false);
  const touchStartY = useRef(0);
  const touchLockedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const skippedRef = useRef(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const syncMobile = () => setIsMobile(mobileQuery.matches);

    const syncMotion = () => {
      reducedMotionRef.current = motionQuery.matches;
    };

    syncMobile();
    syncMotion();

    mobileQuery.addEventListener("change", syncMobile);
    motionQuery.addEventListener("change", syncMotion);

    return () => {
      mobileQuery.removeEventListener("change", syncMobile);
      motionQuery.removeEventListener("change", syncMotion);
    };
  }, []);

  const getPinnedRange = useCallback(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return null;

    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = rect.top + window.scrollY;
    const viewportH = window.innerHeight;

    return {
      top: wrapperTop,
      bottom: wrapperTop + wrapper.offsetHeight - viewportH,
      viewportH,
    };
  }, []);

  // Jump directly to a specific feature index
  const goToIndex = useCallback(
    (targetIndex) => {
      if (
        targetIndex === activeIndexRef.current ||
        targetIndex < 0 ||
        targetIndex >= count
      ) {
        return;
      }

      if (cooldownRef.current) return;

      const range = getPinnedRange();

      if (!range) return;

      const dir =
        targetIndex > activeIndexRef.current ? 1 : -1;

      cooldownRef.current = true;

      setDirection(dir);
      setActiveIndex(targetIndex);

      window.scrollTo({
        top: range.top + targetIndex * range.viewportH,
        behavior: reducedMotionRef.current ? "auto" : "smooth",
      });

      window.setTimeout(
        () => {
          cooldownRef.current = false;
        },
        reducedMotionRef.current ? 50 : TRANSITION_MS
      );
    },
    [count, getPinnedRange]
  );

  // Advance/reverse exactly one feature
  const step = useCallback(
    (dir) => {
      const current = activeIndexRef.current;
      const next = current + dir;

      if (next < 0 || next >= count) return false;

      goToIndex(next);

      return true;
    },
    [count, goToIndex]
  );

  // Skip the whole locked section
  const skipSection = useCallback(() => {
    const range = getPinnedRange();

    skippedRef.current = true;
    cooldownRef.current = true;

    setActiveIndex(count - 1);

    const targetTop = range
      ? range.bottom + range.viewportH + 4
      : undefined;

    if (targetTop !== undefined) {
      window.scrollTo({
        top: targetTop,
        behavior: reducedMotionRef.current ? "auto" : "smooth",
      });
    } else {
      const endMarker = document.getElementById(
        "feature-showcase-end"
      );

      endMarker?.scrollIntoView({
        behavior: reducedMotionRef.current
          ? "auto"
          : "smooth",
      });
    }

    window.setTimeout(() => {
      cooldownRef.current = false;
    }, reducedMotionRef.current ? 50 : TRANSITION_MS);
  }, [count, getPinnedRange]);

  // App mode: next button
  const handleAppNext = useCallback(() => {
    if (!isApp) return;

    const current = activeIndexRef.current;

    // More features available
    if (current < count - 1) {
      step(1);
      return;
    }

    // Last feature → move to next onboarding section
    if (onNextSection) {
      onNextSection();
    }
  }, [count, onNextSection, step]);

  // App mode: back button
  const handleAppBack = useCallback(() => {
    if (!isApp) return;

    const current = activeIndexRef.current;

    // Previous feature
    if (current > 0) {
      step(-1);
      return;
    }

    // Already at first feature
    if (onPreviousSection) {
      onPreviousSection();
    }
  }, [onPreviousSection, step]);

  // App mode: skip
  const handleAppSkip = useCallback(() => {
    if (!isApp) {
      skipSection();
      return;
    }

    if (onSkip) {
      onSkip();
      return;
    }

    skipSection();
  }, [onSkip, skipSection]);

  // Keep activeIndex synced on natural scroll / drag
  useEffect(() => {
    const onScroll = () => {
      if (cooldownRef.current) return;

      const range = getPinnedRange();

      if (!range) return;

      const scrollY = window.scrollY;

      if (
        scrollY < range.top - 10 ||
        scrollY > range.bottom + 10
      ) {
        return;
      }

      const raw =
        (scrollY - range.top) / range.viewportH;

      const nearest = Math.min(
        count - 1,
        Math.max(0, Math.round(raw))
      );

      if (nearest !== activeIndexRef.current) {
        setDirection(
          nearest > activeIndexRef.current ? 1 : -1
        );

        setActiveIndex(nearest);
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [count, getPinnedRange]);

  // Strict scroll lock handler
  useEffect(() => {
    const onWheel = (e) => {
      const range = getPinnedRange();

      if (!range) return;

      const scrollY = window.scrollY;

      const withinPinned =
        scrollY >= range.top - 10 &&
        scrollY <= range.bottom + 10;

      if (!withinPinned) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const current = activeIndexRef.current;

      // Allow natural scroll exit only at boundaries
      const isExiting =
        (dir > 0 && current >= count - 1) ||
        (dir < 0 && current <= 0);

      if (isExiting) {
        return;
      }

      // Inside section: prevent native free-scroll
      e.preventDefault();

      if (cooldownRef.current) return;

      if (Math.abs(e.deltaY) < 12) return;

      step(dir);
    };

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchLockedRef.current = false;
    };

    const onTouchMove = (e) => {
      const range = getPinnedRange();

      if (!range) return;

      const scrollY = window.scrollY;

      const withinPinned =
        scrollY >= range.top - 10 &&
        scrollY <= range.bottom + 10;

      if (!withinPinned) return;

      const delta =
        touchStartY.current - e.touches[0].clientY;

      const dir = delta > 0 ? 1 : -1;
      const current = activeIndexRef.current;

      const isExiting =
        (dir > 0 && current >= count - 1) ||
        (dir < 0 && current <= 0);

      if (isExiting) return;

      if (e.cancelable) {
        e.preventDefault();
      }

      if (
        touchLockedRef.current ||
        cooldownRef.current
      ) {
        return;
      }

      if (Math.abs(delta) >= SWIPE_THRESHOLD) {
        touchLockedRef.current = true;
        step(dir);
      }
    };

    const onTouchEnd = () => {
      touchLockedRef.current = false;
    };

    const onKeyDown = (e) => {
      if (
        ![
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          " ",
        ].includes(e.key)
      ) {
        return;
      }

      const range = getPinnedRange();

      if (!range) return;

      const scrollY = window.scrollY;

      const withinPinned =
        scrollY >= range.top - 10 &&
        scrollY <= range.bottom + 10;

      if (!withinPinned) return;

      const dir =
        e.key === "ArrowUp" ||
          e.key === "PageUp"
          ? -1
          : 1;

      const current = activeIndexRef.current;

      const isExiting =
        (dir > 0 && current >= count - 1) ||
        (dir < 0 && current <= 0);

      if (isExiting) return;

      e.preventDefault();

      if (cooldownRef.current) return;

      step(dir);
    };

    window.addEventListener("wheel", onWheel, {
      passive: false,
    });

    window.addEventListener(
      "touchstart",
      onTouchStart,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      onTouchMove,
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      onTouchEnd,
      { passive: true }
    );

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener(
        "touchstart",
        onTouchStart
      );
      window.removeEventListener(
        "touchmove",
        onTouchMove
      );
      window.removeEventListener(
        "touchend",
        onTouchEnd
      );
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [step, getPinnedRange, count]);

  const activeFeature =
    featuresData[activeIndex] || featuresData[0];

  const leftScreenType =
    `${activeFeature.screenType}_1`;

  const rightScreenType =
    `${activeFeature.screenType}_2`;

  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      y: dir > 0 ? 24 : -24,
      scale: 0.98,
      filter: "blur(4px)",
    }),

    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },

    exit: (dir) => ({
      opacity: 0,
      y: dir > 0 ? -24 : 24,
      scale: 0.98,
      filter: "blur(4px)",
    }),
  };

  return (
    <section
      ref={wrapperRef}
      id="feature-showcase"
      style={{
        height: `${count * 100}vh`,
      }}
      className="relative bg-[#030014] font-siliguri"
    >
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] sm:h-[calc(100dvh-4rem)] w-full flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-12 pb-20 sm:pb-16">

        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[150px]" />

        <div className="pointer-events-none absolute -bottom-32 left-[5%] h-[400px] w-[400px] rounded-full bg-[#281E5D]/25 blur-[140px]" />

        <div className="pointer-events-none absolute right-[5%] top-[20%] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-[140px]" />

        

        {/* Main Content Area */}
        <div className="relative z-10 flex w-full items-center justify-center py-2">
          <AnimatePresence
            mode="wait"
            custom={direction}
          >
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: reducedMotionRef.current
                  ? 0
                  : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                grid
                w-full
                max-w-7xl
                grid-cols-2
                items-center
                justify-items-center
                gap-10
                sm:gap-6
                lg:grid-cols-[1fr_minmax(320px,460px)_1fr]
                lg:gap-8
                xl:grid-cols-[1fr_minmax(360px,500px)_1fr]
                xl:gap-14
              "
              style={{
                gridTemplateAreas: isMobile
                  ? '"text text" "left right"'
                  : '"left text right"',
              }}
            >

              {/* LEFT PHONE MOCKUP */}
              <div
                style={{
                  gridArea: "left",
                }}
                className="relative flex w-full justify-center justify-self-center"
              >
                <div className="relative z-10 w-full max-w-[230px] xs:max-w-[155px] sm:max-w-[195px] md:max-w-[225px] lg:max-w-[260px] xl:max-w-[290px] transition-transform duration-500 hover:scale-[1.02]">
                  <AppMockupScreen
                    type={leftScreenType}
                  />
                </div>
              </div>

              {/* CENTER COPY */}
              <div
                style={{
                  gridArea: "text",
                }}
                className="
                  min-w-0
                  w-full
                  max-w-[320px]
                  text-center
                  sm:max-w-md
                  lg:max-w-[460px]
                  xl:max-w-[500px]
                  justify-self-center
                  flex
                  flex-col
                  items-center
                  px-2
                "
              >

                {/* Subtitle tag */}
                {activeFeature.subtitle && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-2 sm:mb-3">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {activeFeature.subtitle}
                  </div>
                )}

                {/* Main Feature Title */}
                <h3 className="
                  text-lg
                  font-black
                  leading-snug
                  text-white
                  sm:text-2xl
                  md:text-3xl
                  lg:text-3xl
                  xl:text-4xl
                  tracking-tight
                ">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                    {activeFeature.title}
                  </span>
                </h3>

                {/* Feature Description */}
                {activeFeature.description && (
                  <p className="
                    mx-auto
                    mt-2
                    max-w-xs
                    text-xs
                    leading-relaxed
                    text-slate-300/90
                    sm:mt-3
                    sm:max-w-sm
                    sm:text-sm
                    md:text-base
                    lg:max-w-md
                  ">
                    {activeFeature.description}
                  </p>
                )}

                {/* Key Feature Highlights */}
                {activeFeature.highlights &&
                  activeFeature.highlights.length > 0 && (
                    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full text-left">
                      {activeFeature.highlights
                        .slice(0, 4)
                        .map((hl, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-[#120c2e]/60 border border-indigo-500/15 rounded-xl px-2.5 py-1.5 backdrop-blur-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />

                            <span className="text-[11px] lg:text-xs text-slate-300 font-medium leading-tight">
                              {hl}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* RIGHT PHONE MOCKUP */}
              <div
                style={{
                  gridArea: "right",
                }}
                className="relative flex w-full justify-center justify-self-center"
              >
                <div className="relative z-10 w-full max-w-[230px] xs:max-w-[155px] sm:max-w-[195px] md:max-w-[225px] lg:max-w-[260px] xl:max-w-[290px] transition-transform duration-500 hover:scale-[1.02]">
                  <AppMockupScreen
                    type={rightScreenType}
                  />
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        
        {/* Fixed Bottom Dot Indicators */}
        {isApp && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-[#120c2e]/80 border border-indigo-500/20 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${isApp
                ? "bottom-[72px] sm:bottom-[78px]"
                : "bottom-4 sm:bottom-6"
              }`}
          >
            {featuresData.map((f, idx) => (
              <button
                key={f.id || idx}
                onClick={() => goToIndex(idx)}
                aria-label={`Go to feature ${idx + 1}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                    ? "w-6 sm:w-8 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                    : "w-2 sm:w-2.5 bg-white/20 hover:bg-white/45"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <span
        id="feature-showcase-end"
        className="sr-only"
      />
    </section>
  );
}

export default FeatureShowcase;