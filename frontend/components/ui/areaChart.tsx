"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

type ChartFieldConfig<T> = {
  [K in keyof T]?: {
    label: string;
    color: string;
  };
};

interface ChartProps<T> {
  chartData: T[];
  dataKey: keyof T;
  xKey: any;
  config: ChartFieldConfig<T>;
  total?: number;
  yFormatter?: (value: number) => string;
  xFormatter?: (value: string | number) => string;
  onlyChart?: boolean;
}

export function ThemedAreaChart<T>({
  chartData,
  dataKey,
  xKey,
  config,
  total,
  onlyChart = false,
  yFormatter = (value) => value.toLocaleString(),
  xFormatter = (value) => {
    const date = new Date(value as string);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  },
}: ChartProps<T>) {
  const areaConfig = config[dataKey];

  const chartContent = (
    <ChartContainer
      config={config as unknown as ChartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey as string}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={xFormatter}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={16}
          tickCount={3}
          tickFormatter={yFormatter}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px] text-white"
              nameKey={String(dataKey)}
              labelFormatter={(value) => {
                return new Date(value as string).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Area
          dataKey={dataKey as string}
          type="natural"
          fill={areaConfig?.color || "red"}
          fillOpacity={0.4}
          stroke={areaConfig?.color || "red"}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );

  if (onlyChart) {
    return chartContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>{areaConfig?.label}</CardDescription>
        {total && (
          <CardTitle className="text-xl">{total.toLocaleString()}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">{chartContent}</CardContent>
    </Card>
  );
}
