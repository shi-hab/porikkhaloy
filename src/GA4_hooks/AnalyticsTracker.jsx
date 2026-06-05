import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";



const AnalyticsTracker = () => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth?.student);

  useEffect(() => {

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
      user_id: auth?.id || "",
      user_email: auth?.email || "",
      user_phone: auth?.phone || "",
    });

  }, [location]);

  return null;
};

export default AnalyticsTracker;