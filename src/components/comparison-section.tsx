"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComparisonBar } from "@/components/comparison-bar";
import { calculate } from "@/lib/calculator";
import { formatCurrency, formatDoses } from "@/lib/utils";

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
  const chartData = selectedProducts.map((p) => {
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
  });

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold text-primary mb-3">Comparar produtos</h2>
      {validProducts.length < 2 ? (
        <p className="text-sm text-muted-foreground">
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
                  className={isSelected ? "bg-accent hover:bg-emerald-600" : ""}
                >
                  {p.name}
                </Button>
              );
            })}
          </div>
          {chartData.length > 0 && (
            <>
              <ComparisonBar data={chartData} />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground">Produto</th>
                      <th className="text-right py-2 px-2 text-muted-foreground">Custo/dose</th>
                      <th className="text-right py-2 px-2 text-muted-foreground">Doses</th>
                      <th className="text-right py-2 px-2 text-muted-foreground">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item) => (
                      <tr key={item.name} className="border-b border-border last:border-0">
                        <td className="py-2 px-2 font-medium">{item.name}</td>
                        <td className="text-right py-2 px-2 text-accent font-semibold">
                          {formatCurrency(item.costPerDose)}
                        </td>
                        <td className="text-right py-2 px-2">{formatDoses(item.doses)}</td>
                        <td className="text-right py-2 px-2">
                          {formatCurrency(
                            products.find((p) => p.name === item.name)?.lastPrice ?? 0,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}
