"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ComparisonItem {
  name: string;
  costPerDose: number;
  doses: number;
}

interface ComparisonBarProps {
  data: ComparisonItem[];
}

export function ComparisonBar({ data }: ComparisonBarProps) {
  if (data.length === 0) return null;

  const minCost = Math.min(...data.map((d) => d.costPerDose));

  return (
    <div className="w-full h-[320px] pt-4 pr-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="bestBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="otherBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#64748B" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `R$ ${v}`}
            dx={-4}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Custo/Dose"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "rgba(var(--card-rgb, 255, 255, 255), 0.8)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
              padding: "8px 12px",
            }}
            labelStyle={{ fontWeight: 700, fontSize: "12px", marginBottom: "4px", color: "var(--foreground)" }}
            itemStyle={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}
            cursor={{ fill: "var(--muted)", opacity: 0.15 }}
          />
          <Bar
            dataKey="costPerDose"
            barSize={32}
            shape={(props: any) => {
              const { x, y, width, height } = props;
              const isBest = props.payload.costPerDose === minCost;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={isBest ? "url(#bestBarGradient)" : "url(#otherBarGradient)"}
                  rx={6}
                  ry={6}
                  filter={isBest ? "drop-shadow(0 4px 12px rgba(16, 185, 129, 0.25))" : undefined}
                  className="transition-all duration-300 hover:opacity-90"
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
