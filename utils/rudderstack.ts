import { useEffect, useState } from "react";
import { RudderAnalytics } from "@rudderstack/analytics-js";

const useRudderStackAnalytics = (): RudderAnalytics | undefined => {
  const [analytics, setAnalytics] = useState<RudderAnalytics>();

  useEffect(() => {
    if ((window && !analytics) || !("rudderanalytics" in window)) {
      const analyticsInstance = new RudderAnalytics();

      analyticsInstance.load(
        process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY || "",
        process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE_URL || ""
      );

      analyticsInstance.ready(() => {
        console.log("Rudderanalytics, We are all set!");
      });

      window.rudderanalytics = analyticsInstance;

      setAnalytics(analyticsInstance);
    } else if (window && "rudderanalytics" in window) {
      setAnalytics(window.rudderanalytics as RudderAnalytics);
    }
  }, [analytics]);

  return analytics;
};

export default useRudderStackAnalytics;
