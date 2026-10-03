import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import FeatureShowcase from "./components/FeatureShowcase";
import VideoSection from "./components/VideoSection";
import PartnershipSection from "./components/PartnershipSection";
import { isApp } from "@/File/device";

export const ONBOARDING_KEY = "app_onboarding_seen";

const STEPS = ["feature", "video", "partnership", "start"];

function OnboardingPage() {
  const navigate = useNavigate();

  const [appStep, setAppStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const lockRef = useRef(false); // transition চলাকালীন বাটন লক

  const appMode = Boolean(isApp);

  const finishOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    navigate("/login", { replace: true });
  };

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    navigate("/login", { replace: true });
  };

  const nextStep = () => {
    if (!appMode || lockRef.current) return;
    if (appStep >= STEPS.length - 1) return;

    lockRef.current = true;
    setDirection(1);
    setAppStep((s) => s + 1);
  };

  const previousStep = () => {
    if (!appMode || lockRef.current) return;
    if (appStep <= 0) return;

    lockRef.current = true;
    setDirection(-1);
    setAppStep((s) => s - 1);
  };

  // animation শেষ হলে lock খুলে দেয়া হচ্ছে (onAnimationComplete থেকেও করা যায়, safety এর জন্য timeout)
  useEffect(() => {
    const t = setTimeout(() => {
      lockRef.current = false;
    }, 480);
    return () => clearTimeout(t);
  }, [appStep]);

  // ---------- appMode নয় (normal website flow) — অপরিবর্তিত ----------
  if (!appMode) {
    return (
      <div className="bg-[#030014] text-slate-100 selection:bg-indigo-600 selection:text-white mb-[-80px]">
        <main>
          <FeatureShowcase
            onNextSection={() => {
              document.getElementById("video-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            onPreviousSection={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSkip={finishOnboarding}
          />

          <div id="video-section">
            <VideoSection />
          </div>

          <PartnershipSection />

          <div className="flex flex-col items-center justify-center py-10 text-center">
            <button
              onClick={finishOnboarding}
              className="mt-7 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7] px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_25px_rgba(99,102,241,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_30px_rgba(99,102,241,0.55)] active:scale-95"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------- appMode: একবারে শুধু একটাই স্টেপ DOM-এ থাকবে ----------
  const stepVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
    }),
  };

  return (
    <div className="mb-[-80px] min-h-screen bg-[#030014] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={skipOnboarding}
            className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
          >
            Skip
          </button>

          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl">
            {STEPS.map((_, step) => (
              <span
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === appStep
                    ? "w-7 bg-indigo-500"
                    : step < appStep
                      ? "w-2 bg-indigo-400"
                      : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <main>
        <AnimatePresence mode="wait" custom={direction}>
          {/* ---- Step 0: FeatureShowcase — নিজের internal scroll-cycle অক্ষত ---- */}
          {appStep === 0 && (
            <motion.div
              key="feature"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeatureShowcase
                onNextSection={nextStep}
                onPreviousSection={previousStep}
                onSkip={finishOnboarding}
              />
            </motion.div>
          )}

          {/* ---- Step 1: VideoSection ---- */}
          {appStep === 1 && (
            <motion.div
              key="video"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-screen"
            >
              <VideoSection />
            </motion.div>
          )}

          {/* ---- Step 2: PartnershipSection ---- */}
          {appStep === 2 && (
            <motion.div
              key="partnership"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-screen"
            >
              <PartnershipSection />
            </motion.div>
          )}

          {/* ---- Step 3: Final screen ---- */}
          {appStep === 3 && (
            <motion.div
              key="start"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-screen items-center justify-center px-5"
            >
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20"
                >
                  <Check className="h-8 w-8 text-indigo-400" />
                </motion.div>

                <h2 className="text-2xl font-black text-white sm:text-4xl">
                  শেখা শুরু করতে প্রস্তুত?
                </h2>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                  পরীক্ষালয়ের সাথে তোমার প্রস্তুতি আরও স্মার্ট ও সহজভাবে শুরু
                  করো।
                </p>

                <motion.button
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
                  onClick={finishOnboarding}
                  className="mt-7 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7] px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_25px_rgba(99,102,241,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_30px_rgba(99,102,241,0.55)] active:scale-95"
                >
                  <span>শুরু করো</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bottom Next/Back bar — শেষ ধাপে নিজস্ব বাটন থাকায় এখানে দেখানো হয় না */}
        {appStep < STEPS.length - 1 && (
          <div className="fixed bottom-5 left-0 right-0 z-[100] px-4">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
              <button
                type="button"
                onClick={previousStep}
                disabled={appStep === 0}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-300 backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:opacity-0 disabled:pointer-events-none"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.03] active:scale-95"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OnboardingPage;