"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type MoodChartProps = {
  data: {
    mood: string;
    spending: number;
    fill: string;
  }[];
};

const chartConfig = {
  spending: {
    label: "Spending",
  },
  happy: { label: "Happy", color: "hsl(var(--chart-2))" },
  sad: { label: "Sad", color: "hsl(var(--chart-1))" },
  neutral: { label: "Neutral", color: "hsl(var(--muted-foreground))" },
  stressed: { label: "Stressed", color: "hsl(var(--chart-4))" },
  anxious: { label: "Anxious", color: "hsl(var(--chart-5))" },
  tired: { label: "Tired", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export function MoodChart({ data }: MoodChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="mood"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `₹${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="spending" radius={4}>
          {data.map((entry) => (
            <Cell key={`cell-${entry.mood}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
