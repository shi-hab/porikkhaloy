import { Outlet, useLocation } from "react-router-dom";
import Footer from "./exams/components/molecules/ui/Footer";
import Navbar from "./exams/components/molecules/ui/Navbar";
import AnalyticsTracker from "./GA4_hooks/AnalyticsTracker";

function App() {
  const location = useLocation();
  const paths = ["exam-on-going"];
  const noHeaderOrFooter = paths.some(path => location.pathname.includes(path));

  return (
    <div className="relative mx-auto ">
      <AnalyticsTracker />
      <Navbar />
      <div>
        <div className="w-full max-w-7xl mx-auto ">
          <Outlet />
        </div>
      </div>
      {noHeaderOrFooter || <Footer />}
    </div>
  );
}
export default App;
