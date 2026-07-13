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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#475569" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#475569" }}
          tickLine={false}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Custo/dose"]}
          contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
        />
        <Bar
          dataKey="costPerDose"
          radius={[4, 4, 0, 0]}
          shape={(props: any) => {
            const isBest = props.payload.costPerDose === minCost;
            return (
              <rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill={isBest ? "#10B981" : "#475569"}
                rx={4}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
