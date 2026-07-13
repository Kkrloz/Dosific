import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDoses } from "@/lib/utils";
import { calculate } from "@/lib/calculator";
import { Package, TrendingUp } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  categoryName: string;
  packageWeight: number;
  unit: string;
  doseSize: number;
  doseUnit: string;
  bonus: number | null;
  lastPrice: number | null;
  isBest?: boolean;
}

export function ProductCard({
  id,
  name,
  categoryName,
  packageWeight,
  unit,
  doseSize,
  doseUnit,
  bonus,
  lastPrice,
  isBest,
}: ProductCardProps) {
  if (!lastPrice) {
    return (
      <Link href={`/products/${id}`}>
        <Card className="p-5 hover:shadow-lg transition-all duration-200 h-full flex flex-col group hover:-translate-y-0.5">
          <div className="flex items-start gap-3 mb-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Package className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-primary truncate">{name}</h3>
              <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1">
                {categoryName}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-auto">Sem preço cadastrado</p>
        </Card>
      </Link>
    );
  }

  const calc = calculate(lastPrice, packageWeight, unit as any, doseSize, doseUnit as any, bonus ?? undefined);

  return (
    <Link href={`/products/${id}`}>
      <Card className={`p-5 hover:shadow-lg transition-all duration-200 h-full flex flex-col group hover:-translate-y-0.5 relative ${isBest ? "ring-2 ring-accent" : ""}`}>
        {isBest && (
          <Badge className="absolute -top-2.5 right-3 bg-accent text-accent-foreground text-xs px-2.5 py-0.5 shadow-sm">
            Melhor custo/dose
          </Badge>
        )}
        <div className="flex items-start gap-3 mb-3">
          <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
            <TrendingUp className="size-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-primary truncate">{name}</h3>
            <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1">
              {categoryName}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-accent tracking-tight">
            {formatCurrency(calc.costPerDose)}
          </span>
          <span className="text-xs text-muted-foreground">/dose</span>
        </div>
        <div className="mt-auto pt-2 space-y-1">
          <p className="text-xs text-muted-foreground">
            {formatCurrency(lastPrice)} · {packageWeight}{unit}
            {bonus ? <span className="text-accent"> +{bonus}g bônus</span> : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDoses(calc.totalDoses)} doses · {doseSize}{doseUnit} cada
          </p>
        </div>
      </Card>
    </Link>
  );
}
