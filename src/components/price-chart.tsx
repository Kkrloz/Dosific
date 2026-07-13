"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
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
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Nenhum histórico disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Preço"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--card-foreground)",
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="none"
          fill="url(#priceGradient)"
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: "#10B981", r: 4, strokeWidth: 2, stroke: "var(--card)" }}
          activeDot={{ r: 6, fill: "#10B981", stroke: "var(--card)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
