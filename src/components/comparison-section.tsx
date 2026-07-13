"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComparisonBar } from "@/components/comparison-bar";
import { calculate } from "@/lib/calculator";
import { formatCurrency, formatDoses } from "@/lib/utils";
import { BarChart3, Check } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  packageWeight: number;
  unit: string;
  doseSize: number;
  doseUnit: string;
  bonus: number | null;
  lastPrice: number | null;
}

export function ComparisonSection({ products }: { products: ProductItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const validProducts = products.filter((p) => p.lastPrice !== null);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 5) next.add(id);
      return next;
    });
  }

  const selectedProducts = validProducts.filter((p) => selected.has(p.id));
  const chartData = useMemo(
    () =>
      selectedProducts.map((p) => {
        const calc = calculate(
          p.lastPrice!,
          p.packageWeight,
          p.unit as any,
          p.doseSize,
          p.doseUnit as any,
          p.bonus ?? undefined,
        );
        return {
          name: p.name,
          costPerDose: calc.costPerDose,
          doses: calc.totalDoses,
        };
      }),
    [selectedProducts],
  );

  const best = chartData.length > 0
    ? chartData.reduce((min, curr) => (curr.costPerDose < min.costPerDose ? curr : min))
    : null;

  const worst = chartData.length > 0
    ? chartData.reduce((max, curr) => (curr.costPerDose > max.costPerDose ? curr : max))
    : null;

  const savings = best && worst
    ? (worst.costPerDose - best.costPerDose) * best.doses
    : null;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center">
          <BarChart3 className="size-4 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold text-primary">Comparar produtos</h2>
          <p className="text-xs text-muted-foreground">Selecione até 5 produtos para comparar custo por dose</p>
        </div>
      </div>

      {validProducts.length < 2 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Cadastre pelo menos 2 produtos com preço para comparar
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {validProducts.map((p) => {
              const isSelected = selected.has(p.id);
              return (
                <Button
                  key={p.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggle(p.id)}
                  className={
                    isSelected
                      ? "bg-accent hover:bg-emerald-600 shadow-sm"
                      : "hover:border-accent/50"
                  }
                >
                  {isSelected && <Check className="size-3 mr-1" />}
                  {p.name}
                </Button>
              );
            })}
          </div>

          {chartData.length > 0 && (
            <>
              {savings && savings > 0 && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-4 text-sm">
                  <span className="font-medium text-accent">
                    Economia de {formatCurrency(savings)}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    comparando {best?.name} com {worst?.name}
                  </span>
                </div>
              )}

              <ComparisonBar data={chartData} />

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 px-3 text-muted-foreground font-medium">Produto</th>
                      <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Custo/dose</th>
                      <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Doses</th>
                      <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData
                      .sort((a, b) => a.costPerDose - b.costPerDose)
                      .map((item, i) => {
                        const p = products.find((p) => p.name === item.name);
                        return (
                          <tr
                            key={item.name}
                            className={`border-b border-border last:border-0 transition-colors hover:bg-muted/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                          >
                            <td className="py-2.5 px-3 font-medium">
                              {item.name}
                              {i === 0 && (
                                <span className="ml-2 text-xs text-accent font-semibold">← Melhor</span>
                              )}
                            </td>
                            <td className="text-right py-2.5 px-3 text-accent font-semibold">
                              {formatCurrency(item.costPerDose)}
                            </td>
                            <td className="text-right py-2.5 px-3">{formatDoses(item.doses)}</td>
                            <td className="text-right py-2.5 px-3">
                              {formatCurrency(p?.lastPrice ?? 0)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {chartData.length === 0 && selected.size > 0 && (
            <p className="text-sm text-muted-foreground py-2">
              Selecione produtos com preço para ver a comparação
            </p>
          )}
        </>
      )}
    </Card>
  );
}
