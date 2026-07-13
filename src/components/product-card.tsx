import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDoses } from "@/lib/utils";
import { calculate } from "@/lib/calculator";
import { Package, TrendingUp, Award, Sparkles } from "lucide-react";

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
        <Card className="p-5 border border-border/40 bg-card/65 backdrop-blur-sm hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group hover:-translate-y-1">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Package className="size-5 text-muted-foreground/75" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-primary truncate group-hover:text-emerald-500 transition-colors tracking-tight">{name}</h3>
              <span className="inline-block text-[10px] font-semibold text-muted-foreground bg-muted/65 px-2 py-0.5 rounded-full mt-1.5 border border-border/20">
                {categoryName}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-auto flex items-center gap-1">
            <span className="inline-block size-1.5 rounded-full bg-muted-foreground/45 animate-pulse"></span>
            Sem preço cadastrado
          </p>
        </Card>
      </Link>
    );
  }

  const calc = calculate(lastPrice, packageWeight, unit as any, doseSize, doseUnit as any, bonus ?? undefined);

  return (
    <Link href={`/products/${id}`}>
      <Card className={`p-5 border h-full flex flex-col group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
        isBest 
          ? "glow-best border-emerald-500/30 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02]" 
          : "border-border/40 bg-card/65 backdrop-blur-sm hover:border-border/80 shadow-sm hover:shadow-md"
      }`}>
        {isBest && (
          <div className="absolute top-0 right-0">
            <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm uppercase tracking-wider">
              <Award className="size-3" />
              Melhor Custo
            </div>
          </div>
        )}
        <div className="flex items-start gap-3 mb-4">
          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isBest ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/15"
          }`}>
            {isBest ? <Sparkles className="size-5" /> : <TrendingUp className="size-5" />}
          </div>
          <div className="min-w-0 pr-16">
            <h3 className="font-bold text-primary truncate group-hover:text-emerald-500 transition-colors tracking-tight">{name}</h3>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 border ${
              isBest 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                : "bg-muted/65 text-muted-foreground border-border/20"
            }`}>
              {categoryName}
            </span>
          </div>
        </div>
        
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-3xl font-extrabold text-emerald-500 tracking-tight">
            {formatCurrency(calc.costPerDose)}
          </span>
          <span className="text-xs font-medium text-muted-foreground">/ dose</span>
        </div>

        <div className="mt-auto pt-3 border-t border-border/20 space-y-1.5 text-xs text-muted-foreground/80">
          <p className="flex items-center justify-between">
            <span>Preço & Peso:</span>
            <span className="font-semibold text-primary/80">
              {formatCurrency(lastPrice)} · {packageWeight}{unit}
              {bonus ? <span className="text-emerald-500 font-semibold"> (+{bonus}g)</span> : ""}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span>Rendimento:</span>
            <span className="font-semibold text-primary/80">
              {formatDoses(calc.totalDoses)} doses · {doseSize}{doseUnit} cada
            </span>
          </p>
        </div>
      </Card>
    </Link>
  );
}
