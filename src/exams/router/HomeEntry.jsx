import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { isApp } from "@/File/device";

import { LandingPage } from "../pages/rootLanding/LandingPage";
import OnboardingPage, { ONBOARDING_KEY } from "../pages/rootLanding/OnboardingPage";

export default function HomeEntry() {
  const isLoggedIn = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isApp()) {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY) === "true";

    if (!hasSeenOnboarding) {
      return <OnboardingPage />;   // app-এ প্রথমবার → onboarding দেখাও
    }
    return <Navigate to="/login" replace />; // app-এ আগেই দেখা হয়ে গেছে → সরাসরি login
  }

  return <LandingPage />; // ব্রাউজার/ওয়েব
}
