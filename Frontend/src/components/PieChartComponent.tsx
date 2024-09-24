import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import React from 'react';

const chartData = [
    { browser: "INTRA", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "Western", visitors: 200, fill: "var(--color-safari)" },
    { browser: "MTC Touch", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "Alfa", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ];
  
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "INTRA",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Western Union",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "MTC Touch",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Alfa",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;
  
  export const PieChartComponent = React.memo(() => {
    return (
      <Card className="flex flex-col shadow-lg">
        <CardHeader className="items-center pb-0">
          <CardTitle>Transaction Distribution</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
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
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing Transaction Distribution for the last 6 months
          </div>
        </CardFooter>
      </Card>
    );
  });
  