const crypto = require("crypto");

function generateMockData(numEvents = 1000) {
  const mockApiKey = "mock_" + crypto.randomBytes(16).toString("hex");
  const events = [];
  const visitorIds = new Set();
  const startDate = new Date("2023-01-01T00:00:00Z");
  const endDate = new Date("2023-01-31T23:59:59Z");

  const pages = [
    "/home",
    "/blog",
    "/products",
    "/about",
    "/contact",
    "/pricing",
    "/docs",
    "/api",
  ];
  const referrers = [
    "https://google.com",
    "https://github.com",
    "https://twitter.com",
    "https://linkedin.com",
    "https://bing.com",
    "https://duckduckgo.com",
    null,
  ];
  const countries = [
    "United States",
    "India",
    "United Kingdom",
    "Germany",
    "Canada",
    "Japan",
    "Australia",
    "Brazil",
    "France",
    "Netherlands",
  ];
  const operatingSystems = ["Windows", "macOS", "Linux", "iOS", "Android"];
  const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];

  for (let i = 0; i < numEvents; i++) {
    const timestamp = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );
    const visitorId = crypto.randomBytes(16).toString("hex");
    visitorIds.add(visitorId);

    const event = {
      api_key: mockApiKey,
      timestamp: timestamp.toISOString(),
      visitor_id: visitorId,
      page: pages[Math.floor(Math.random() * pages.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      operating_system:
        operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      metadata: {}, // You can add more custom data here if needed
    };

    events.push(event);
  }

  // Sort events by timestamp
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    mockApiKey,
    events,
    metrics: {
      totalVisitors: visitorIds.size,
      totalPageViews: events.length,
    },
  };
}

const mockData = generateMockData();
console.log(JSON.stringify(mockData, null, 2));
console.log("Mock API Key:", mockData.mockApiKey);
