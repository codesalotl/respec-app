"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

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

// Example description for the chart
export const description = "A donut chart with an active sector";

export function DiagnoseChart({ data }: { data: Record<string, number> }) {
  // Define the colors in descending order for higher values
  const colorPalette = [
    "hsl(var(--chart-8))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-1))",
  ];

  // Transforming the diagnosisResult into chartData format, sorting, and assigning colors
  const chartData = Object.entries(data)
    .map(([condition, score]) => ({
      name: condition,
      value: score,
    }))
    .sort((a, b) => b.value - a.value) // Sorting from highest to lowest
    .map((item, index) => ({
      ...item,
      fill: colorPalette[index], // Assign colors based on sorted order
    }));

  const chartConfig: ChartConfig = {
    ...Object.fromEntries(
      chartData.map(({ name, fill }) => [
        name,
        {
          label: name,
          color: fill,
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Diagnosis Results</CardTitle>
        <CardDescription>Respiratory Conditions Analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing diagnosis probabilities
        </div>
      </CardFooter> */}
    </Card>
  );
}
