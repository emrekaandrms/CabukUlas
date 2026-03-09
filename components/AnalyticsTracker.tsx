import { useEffect } from "react";
import { usePathname } from "expo-router";
import { endAnalyticsSession, startAnalyticsSession, trackAnalyticsEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void startAnalyticsSession();

    return () => {
      void endAnalyticsSession();
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;

    void trackAnalyticsEvent({
      event_name: "screen_view",
      source_screen: pathname,
    });
  }, [pathname]);

  return null;
}
