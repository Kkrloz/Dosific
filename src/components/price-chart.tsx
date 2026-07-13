"use client";

import {
  ComposedChart,
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
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
        Nenhum histórico disponível
      </div>
    );
  }

  // Se tivermos apenas 1 ponto de preço, vamos duplicar para que o gráfico desenhe uma linha reta bonita
  const chartData = data.length === 1 ? [data[0], data[0]] : data;

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
          <XAxis
            dataKey="date"
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
            formatter={(value) => [formatCurrency(Number(value)), "Preço"]}
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
            strokeWidth={2.5}
            dot={{ fill: "#10B981", r: 4.5, strokeWidth: 2, stroke: "var(--card)" }}
            activeDot={{ r: 6.5, fill: "#10B981", stroke: "var(--card)", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
