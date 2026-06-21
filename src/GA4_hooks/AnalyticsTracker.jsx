import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AnalyticsTracker = () => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth?.student);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    const uniqueEventId = "porikkhaloy_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    window.dataLayer.push({
      event: "page_view",
      event_id: uniqueEventId,
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,

      user_id: auth?.id || "",
      user_email: auth?.email || "",
      user_phone: auth?.phone || "",
    });

  }, [location, auth]);

  return null;
};

export default AnalyticsTracker;