import { AnalyticsEvent } from "./types";

const API_ENDPOINT = "http://localhost:3000/api/log-event";

export async function logEvent(
  apiKey: string,
  event: Partial<AnalyticsEvent>
): Promise<void> {
  const visitorId = getOrCreateVisitorId();
  const completeEvent: AnalyticsEvent = {
    analytic_type: event.analytic_type || "pageview",
    api_key: apiKey,
    timestamp: new Date().toISOString(),
    visitor_id: visitorId,
    page: window.location.pathname,
    referrer: document.referrer || undefined,
    country: await getCountry(),
    operating_system: getOS(),
    browser: getBrowser(),
    ...event,
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(completeEvent),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to log event:", error);
    // Optionally, implement retry logic or offline storage here
  }
}

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
}

function generateUUID(): string {
  return crypto.randomUUID();
}

async function getCountry(): Promise<string | undefined> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data.country_name;
  } catch (error) {
    console.error("Failed to get country:", error);
    return undefined;
  }
}

function getOS(): string {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return "Windows";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else if (/Linux/.test(platform)) {
    return "Linux";
  }

  return "Unknown OS";
}

function getBrowser(): string {
  const userAgent = window.navigator.userAgent;
  const browsers = {
    Chrome: /chrome|chromium|crios/i,
    Firefox: /firefox|fxios/i,
    Safari: /safari/i,
    Opera: /opera|opr/i,
    IE: /trident/i,
    Edge: /edg/i,
  };

  for (const [browser, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) return browser;
  }

  return "Unknown Browser";
}
