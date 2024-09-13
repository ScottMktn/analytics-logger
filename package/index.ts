// src/index.ts

import React, { useEffect } from "react";
import { setupAutoTracking } from "./autoTracking";

interface AnalyticsProps {
  apiKey: string;
  userId?: string;
  autoTrack?: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({
  apiKey,
  userId,
  autoTrack = true,
}) => {
  useEffect(() => {
    if (autoTrack) {
      // Set up automatic tracking
      setupAutoTracking(apiKey, userId);
      console.log("Auto-tracking initialized successfully");
    } else {
      console.log("Analytics initialized without auto-tracking");
    }

    return () => {
      // Cleanup function if needed
    };
  }, [apiKey, userId, autoTrack]);

  return null; // This component doesn't render anything
};

export { Analytics };
export { logEvent } from "./eventLogger";
export { setupAutoTracking } from "./autoTracking";

// Also export types that might be useful for users of your package
export type { AnalyticsEvent } from "./types";
