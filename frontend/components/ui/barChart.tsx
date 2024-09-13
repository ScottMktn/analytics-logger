"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartFieldConfig<T> = {
  [K in keyof T]?: {
    label: string;
    color: string;
  };
};

interface ChartProps<T> {
  chartData: T[];
  xKey: string;
  yKey: string;
  config: ChartFieldConfig<T>;
  label: string;
  xFormatter?: (value: string | number) => string;
}

export function ThemedBarChart<T>({
  chartData,
  xKey,
  yKey,
  label,
  config,
  xFormatter = (value) => String(value).slice(0, 3),
}: ChartProps<T>) {
  const barConfig = config[xKey as keyof T];

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config as unknown as ChartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={yKey as string}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={xFormatter}
              hide
            />
            <XAxis dataKey={xKey as string} type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="line" className="text-white" />
              }
            />
            <Bar
              dataKey={xKey as string}
              layout="vertical"
              fill={barConfig?.color || "lightblue"}
              radius={4}
            >
              <LabelList
                dataKey={yKey as string}
                position="insideLeft"
                offset={8}
                className="fill-[--color-label] font-semibold"
                fontSize={12}
              />
              <LabelList
                dataKey={xKey as string}
                position="right"
                offset={8}
                className="fill-[black]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
