import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const startDate = searchParams.get("startDate") || "2023-01-01";
  const endDate =
    searchParams.get("endDate") || new Date().toISOString().split("T")[0];

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Updated query to include referrer and country
  const { data, error } = await supabase
    .from("analytics_events")
    .select("timestamp, visitor_id, page, referrer, country")
    .eq("user_id", userId)
    .gte("timestamp", startDate)
    .lte("timestamp", endDate);

  if (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Error fetching analytics data" },
      { status: 500 }
    );
  }

  // Process the data
  const uniqueVisitors = new Set();
  const dailyVisitors: { [key: string]: Set<string> } = {};
  const dailyPageViews: { [key: string]: number } = {};
  const pageViews: { [key: string]: number } = {};
  const referrers: { [key: string]: number } = {};
  const countries: { [key: string]: number } = {};

  data?.forEach((event) => {
    const date = event.timestamp.split("T")[0];

    uniqueVisitors.add(event.visitor_id);

    if (!dailyVisitors[date]) dailyVisitors[date] = new Set();
    dailyVisitors[date].add(event.visitor_id);

    dailyPageViews[date] = (dailyPageViews[date] || 0) + 1;

    pageViews[event.page] = (pageViews[event.page] || 0) + 1;

    if (event.referrer) {
      referrers[event.referrer] = (referrers[event.referrer] || 0) + 1;
    }

    if (event.country) {
      countries[event.country] = (countries[event.country] || 0) + 1;
    }
  });

  const dates = Object.keys(dailyPageViews).sort();

  const topPages = Object.entries(pageViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));

  const topReferrers = Object.entries(referrers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([referrer, views]) => ({ referrer, views }));

  const topCountries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, views]) => ({ country, views }));

  const result = {
    summary: {
      uniqueVisitors: uniqueVisitors.size,
      totalVisitors: data?.length || 0,
      totalPageViews: data?.length || 0,
    },
    timeSeries: {
      visitors: {
        startDate,
        endDate,
        data: dates.map((date) => ({
          date,
          data: dailyVisitors[date]?.size || 0,
        })),
      },
      pageViews: {
        startDate,
        endDate,
        data: dates.map((date) => ({
          date,
          data: dailyPageViews[date] || 0,
        })),
      },
    },
    topPages: topPages,
    topReferrers: topReferrers,
    topCountries: topCountries,
  };

  return NextResponse.json(result);
}
