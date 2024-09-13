// src/autoTracking.ts

import { logEvent } from "./eventLogger";
import { AnalyticsEvent } from "./types";

export function setupAutoTracking(apiKey: string, userId?: string): void {
  // Track page views
  logPageView(apiKey, userId);
  window.addEventListener("popstate", () => logPageView(apiKey, userId));

  // TEMPORARILY DISABLED
  // Track clicks
  // document.addEventListener("click", (e) => logClick(apiKey, e, userId));

  // Track route changes for SPAs
  trackRouteChanges(apiKey, userId);
}

function logPageView(apiKey: string, userId?: string): void {
  const event: Partial<AnalyticsEvent> = {
    analytic_type: "pageview",
    metadata: {
      url: window.location.href,
    },
    user_id: userId,
  };
  logEvent(apiKey, event);
}

function logClick(apiKey: string, event: MouseEvent, userId?: string): void {
  const target = event.target as HTMLElement;
  const clickEvent: Partial<AnalyticsEvent> = {
    analytic_type: "click",
    metadata: {
      url: window.location.href,
      targetId: target.id,
      targetClass: target.className,
      targetTag: target.tagName,
    },
    user_id: userId,
  };
  logEvent(apiKey, clickEvent);
}

function trackRouteChanges(apiKey: string, userId?: string): void {
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      logPageView(apiKey, userId);
    }
  });

  observer.observe(document, { subtree: true, childList: true });
}
