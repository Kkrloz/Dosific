import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDoses } from "@/lib/utils";
import { calculate } from "@/lib/calculator";

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
        <Card className="p-4 hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-primary">{name}</h3>
              <p className="text-xs text-muted-foreground">{categoryName}</p>
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
      <Card className={`p-4 hover:shadow-md transition-shadow h-full flex flex-col relative ${isBest ? "ring-2 ring-accent" : ""}`}>
        {isBest && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs">
            Melhor custo/dose
          </Badge>
        )}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-primary">{name}</h3>
            <p className="text-xs text-muted-foreground">{categoryName}</p>
          </div>
        </div>
        <div className="mt-auto space-y-1">
          <p className="text-sm text-muted-foreground">
            {formatCurrency(lastPrice)} · {packageWeight}{unit}
          </p>
          <p className="text-lg font-bold text-accent">
            {formatCurrency(calc.costPerDose)}
            <span className="text-xs font-normal text-muted-foreground"> /dose</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDoses(calc.totalDoses)} doses · {doseSize}{doseUnit} cada
          </p>
        </div>
      </Card>
    </Link>
  );
}
