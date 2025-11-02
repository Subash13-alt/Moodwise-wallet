"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Mood = "happy" | "sad" | "neutral";

type MoodChartProps = {
  data: {
    date: string;
    spending: number;
    mood: Mood;
  }[];
};

const chartConfig = {
  spending: {
    label: "Spending",
  },
  happy: {
    label: "Happy",
    color: "hsl(var(--chart-2))",
  },
  sad: {
    label: "Sad",
    color: "hsl(var(--chart-1))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function MoodChart({ data }: MoodChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="spending"
          radius={4}
          // @ts-ignore
          fill="var(--color)"
        >
          {data.map((entry) => (
            <div
              key={entry.date}
              // @ts-ignore
              fill={
                entry.mood === "happy"
                  ? "var(--color-happy)"
                  : entry.mood === "sad"
                  ? "var(--color-sad)"
                  : "var(--color-neutral)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
