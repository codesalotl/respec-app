import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsTableProps {
  timestampResult: {
    crackles: boolean;
    crackles_confidence: number;
    end_time: number;
    start_time: number;
    wheezes: boolean;
    // other properties...
  }[];
}

const chartConfig = {
  crackles: {
    label: "Crackles",
    color: "hsl(var(--chart-7))", // Adjust color if necessary
  },
  wheezes: {
    label: "Wheezes",
    color: "hsl(var(--chart-6))", // Adjust color if necessary
  },
} satisfies ChartConfig;

export default function ResultsRatio({ timestampResult }: ResultsTableProps) {
  // Aggregate the data
  const cracklesCount = timestampResult.filter((item) => item.crackles).length;
  const wheezesCount = timestampResult.filter((item) => item.wheezes).length;
  const totalCount = cracklesCount + wheezesCount;

  // Calculate percentages
  const cracklesPercentage =
    totalCount > 0 ? (cracklesCount / totalCount) * 100 : 0;
  const wheezesPercentage =
    totalCount > 0 ? (wheezesCount / totalCount) * 100 : 0;

  const data = [
    {
      category: "crackles",
      percentage: cracklesPercentage,
      fill: "hsl(var(--chart-7))",
    },
    {
      category: "wheezes",
      percentage: wheezesPercentage,
      fill: "hsl(var(--chart-6))",
    },
  ];

  // Determine the category with the highest percentage
  const initialActiveCategory = data.reduce(
    (max, item) => (item.percentage > max.percentage ? item : max),
    data[0]
  ).category;

  const [activeCategory, setActiveCategory] = React.useState(
    initialActiveCategory
  );

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.category === activeCategory),
    [activeCategory, data]
  );

  return (
    <Card data-chart="pie-interactive" className="flex flex-col border-0">
      <ChartStyle id="pie-interactive" config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart - Interactive</CardTitle>
          <CardDescription>Crackles and Wheezes Percentage</CardDescription>
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {data.map(({ category, fill }) => {
              const config = chartConfig[category as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={category}
                  value={category}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: fill }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id="pie-interactive"
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.percentage.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {activeCategory === "crackles"
                            ? "Crackles"
                            : "Wheezes"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
