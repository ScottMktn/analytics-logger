import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ThemedAreaChart } from "@/components/ui/areaChart";
import { ThemedBarChart } from "@/components/ui/barChart";
import { Dropdown } from "@/components/ui/dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

async function fetchAnalyticsSummary(userId: string) {
  const url = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/api/analytics/summary?userId=${encodeURIComponent(userId)}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "Failed to fetch analytics summary:",
      res.status,
      res.statusText
    );
    throw new Error("Failed to fetch analytics summary");
  }

  const data = await res.json();

  return data;
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let analyticsSummary = null;
  let fetchError = null;
  if (user.id) {
    try {
      analyticsSummary = await fetchAnalyticsSummary(user.id);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      fetchError = error;
    }
  }

  return (
    <div className="w-full flex-1 flex flex-col space-y-8">
      <nav className="w-full flex justify-center border-b border-gray-200 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center text-sm p-4">
          <p>Analytics Logger</p>
          <p>Welcome, {user.email}</p>
        </div>
      </nav>
      <div className="flex-1 flex flex-col gap-16 max-w-7xl mx-auto p-4 w-full">
        <main className="flex-1 flex flex-col gap-4 h-full w-full">
          <div className="w-full flex justify-between">
            <h1 className="font-bold text-xl tracking-tight antialiased">
              Web Analytics
            </h1>
            <Dropdown options={["red", "green", "blue"]} defaultValue="red" />
          </div>

          {analyticsSummary ? (
            <div className="w-full grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <Card>
                  <Tabs defaultValue="Page Views">
                    <TabsList className="mx-2 sm:mx-4 mt-2 sm:mt-4">
                      <TabsTrigger value="Page Views">Page Views</TabsTrigger>
                      <TabsTrigger value="Visitors">Visitors</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Page Views">
                      <>
                        <CardHeader className="-mt-4">
                          <CardDescription>Total</CardDescription>
                          <CardTitle className="text-xl">
                            {analyticsSummary.summary.totalPageViews.toLocaleString()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="">
                          <ThemedAreaChart
                            chartData={
                              analyticsSummary.timeSeries.pageViews.data
                            }
                            dataKey={"data"}
                            xKey={"date"}
                            config={{
                              data: {
                                label: "Page Views",
                                color: "hsl(var(--chart-1))",
                              },
                            }}
                            onlyChart
                          />
                        </CardContent>
                      </>
                    </TabsContent>
                    <TabsContent value="Visitors">
                      <>
                        <CardHeader className="-mt-4">
                          <CardDescription>Total</CardDescription>
                          <CardTitle className="text-xl">
                            {analyticsSummary.summary.totalVisitors.toLocaleString()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="">
                          <ThemedAreaChart
                            chartData={
                              analyticsSummary.timeSeries.visitors.data
                            }
                            dataKey={"data"}
                            xKey={"date"}
                            config={{
                              data: {
                                label: "Visitors",
                                color: "hsl(var(--chart-2))",
                              },
                            }}
                            onlyChart
                          />
                        </CardContent>
                      </>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>

              <div className="col-span-12 md:col-span-4">
                <ThemedBarChart
                  chartData={analyticsSummary.topPages}
                  xKey={"views"}
                  yKey={"path"}
                  label={"Top Pages"}
                  config={{
                    views: {
                      label: "Page Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <ThemedBarChart
                  chartData={analyticsSummary.topReferrers}
                  xKey={"views"}
                  yKey={"referrer"}
                  label={"Top Referrers"}
                  config={{
                    views: {
                      label: "Referrer",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <ThemedBarChart
                  chartData={analyticsSummary.topCountries}
                  xKey={"views"}
                  yKey={"country"}
                  label={"Top Countries"}
                  config={{
                    views: {
                      label: "Country",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Failed to Load Analytics Data
              </h2>
              <p className="text-gray-500 text-center">
                We encountered an error while fetching your analytics. Please
                try again later or contact support if the issue persists.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
