import { Outlet, useLocation } from "react-router-dom";
import Footer from "./exams/components/molecules/ui/Footer";
import Navbar from "./exams/components/molecules/ui/Navbar";
import BackHeader from "../src/exams/router/BackHeader";
import AnalyticsTracker from "./GA4_hooks/AnalyticsTracker";
import { getBackNavRoute } from "../src/exams/router/backNavRoutes";

function App() {
  const { pathname } = useLocation();

  const hideLayoutRoutes = [
    "/", "/login", "/registration", "/forgot-password", "/reset-password",
    "/verify-email", "/terms-and-conditions", "/privacy-policy", "/refund-policy",
  ];

  const hideLayout =
    hideLayoutRoutes.includes(pathname) ||
    pathname.startsWith("/social-login-success");

  const backRoute = getBackNavRoute(pathname);

  const hideFooter =
    pathname.includes("exam-on-going") ||
    pathname.includes("/quiz-battle-running") ||
    hideLayout;

  return (
    <div className="relative mx-auto">
      <AnalyticsTracker />

      {/* ager moto, mobile top bar ta shudhu back page e hide */}
      {!hideLayout && <Navbar hideMobileTopBar={!!backRoute} />}

      <div className={!hideLayout ? "lg:pl-96 lg:pr-28" : ""}>
        <div className={!hideLayout ? "w-full max-w-6xl mx-auto" : ""}>
          {backRoute && <BackHeader title={backRoute.title} />}
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