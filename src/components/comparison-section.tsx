"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComparisonBar } from "@/components/comparison-bar";
import { calculate } from "@/lib/calculator";
import { formatCurrency, formatDoses } from "@/lib/utils";
import { BarChart3, Check, PiggyBank, Sparkles } from "lucide-react";

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
    <Card className="p-5 border border-border/40 bg-card/65 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/15">
          <BarChart3 className="size-4 text-emerald-500" />
        </div>
        <div>
          <h2 className="font-bold text-primary tracking-tight">Comparar Produtos</h2>
          <p className="text-xs text-muted-foreground">Selecione até 5 produtos para comparar o custo por dose graficamente</p>
        </div>
      </div>

      {validProducts.length < 2 ? (
        <p className="text-sm text-muted-foreground py-6 text-center bg-muted/20 rounded-lg border border-dashed border-border/60">
          Cadastre pelo menos 2 produtos com preço para comparar.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            {validProducts.map((p) => {
              const isSelected = selected.has(p.id);
              return (
                <Button
                  key={p.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggle(p.id)}
                  className={`rounded-full transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent shadow-sm hover:shadow-emerald-500/15"
                      : "hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/20"
                  }`}
                >
                  {isSelected && <Check className="size-3.5 mr-1" />}
                  {p.name}
                </Button>
              );
            })}
          </div>

          {chartData.length > 0 && (
            <div className="space-y-5 animate-fade-in-up">
              {savings && savings > 0 && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/[0.02] border border-emerald-500/20 rounded-xl p-4 text-sm flex items-start sm:items-center gap-3 text-emerald-800 dark:text-emerald-300">
                  <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <PiggyBank className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold">
                      Economia potencial de {formatCurrency(savings)}!
                    </span>{" "}
                    <span className="text-muted-foreground dark:text-muted-foreground/80">
                      comprando <strong className="text-primary font-semibold">{best?.name}</strong> em vez de <strong className="text-primary font-semibold">{worst?.name}</strong> (calculado sobre o rendimento de {formatDoses(best?.doses ?? 0)} doses).
                    </span>
                  </div>
                </div>
              )}

              <ComparisonBar data={chartData} />

              <div className="overflow-hidden border border-border/40 rounded-xl bg-background/30 mt-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Produto</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Custo/Dose</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Doses</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Preço Embalagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData
                      .sort((a, b) => a.costPerDose - b.costPerDose)
                      .map((item, i) => {
                        const p = products.find((p) => p.name === item.name);
                        const isFirst = i === 0;
                        return (
                          <tr
                            key={item.name}
                            className={`border-b border-border/30 last:border-0 transition-colors hover:bg-emerald-500/[0.02] ${
                              isFirst 
                                ? "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02]" 
                                : i % 2 === 0 ? "bg-muted/10" : "bg-transparent"
                            }`}
                          >
                            <td className="py-3 px-4 font-semibold text-primary flex items-center gap-1.5">
                              {item.name}
                              {isFirst && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                                  <Sparkles className="size-2.5" />
                                  Melhor Opção
                                </span>
                              )}
                            </td>
                            <td className={`text-right py-3 px-4 font-bold ${isFirst ? "text-emerald-500" : "text-primary/95"}`}>
                              {formatCurrency(item.costPerDose)}
                            </td>
                            <td className="text-right py-3 px-4 text-muted-foreground">{formatDoses(item.doses)}</td>
                            <td className="text-right py-3 px-4 text-muted-foreground">
                              {formatCurrency(p?.lastPrice ?? 0)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {chartData.length === 0 && selected.size > 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Selecione produtos com preço cadastrado para ver o comparativo.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
