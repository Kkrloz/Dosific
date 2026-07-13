"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PricePoint {
  price: number;
  date: string;
}

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Nenhum histórico disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#475569" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#475569" }}
          tickLine={false}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Preço"]}
          contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: "#10B981", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
