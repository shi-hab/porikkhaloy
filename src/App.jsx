import { Outlet, useLocation } from "react-router-dom";
import Footer from "./exams/components/molecules/ui/Footer";
import Navbar from "./exams/components/molecules/ui/Navbar";
import AnalyticsTracker from "./GA4_hooks/AnalyticsTracker";

function App() {
  const { pathname } = useLocation();

  const hideLayoutRoutes = [
    "/",
    "/login",
    "/registration",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/terms-and-conditions",
    "/privacy-policy",
    "/refund-policy",
  ];

  const hideLayout =
    hideLayoutRoutes.includes(pathname) ||
    pathname.startsWith("/social-login-success") ;

  const hideFooter =
    pathname.includes("exam-on-going") || pathname.includes("/quiz-battle-running") || hideLayout;

  return (
    <div className="relative mx-auto">
      <AnalyticsTracker />

      {!hideLayout && <Navbar />}

      <div className={!hideLayout ? "lg:pl-96 lg:pr-28" : ""}>
        <div className={!hideLayout ? "w-full max-w-6xl mx-auto" : ""}>
          <Outlet />
        </div>
      </div>

      {!hideFooter && (
        <div className="lg:pl-64">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;