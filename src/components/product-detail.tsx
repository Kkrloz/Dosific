"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PriceChart } from "@/components/price-chart";
import { updatePrice } from "@/lib/actions";
import { calculate } from "@/lib/calculator";
import { formatCurrency, formatDoses } from "@/lib/utils";
import {
  DollarSign,
  Package,
  Beaker,
  BarChart3,
  ArrowLeft,
  TrendingUp,
  Clock,
} from "lucide-react";

interface PricePoint {
  id: string;
  price: number;
  createdAt: Date;
}

interface ProductWithPrices {
  id: string;
  name: string;
  category: { name: string };
  packageWeight: number;
  unit: string;
  doseSize: number;
  doseUnit: string;
  bonus: number | null;
  lastPrice: number | null;
  prices: PricePoint[];
  createdAt: Date;
}

interface ProductDetailProps {
  product: ProductWithPrices;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  async function handleUpdatePrice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const price = parseFloat(new FormData(form).get("price") as string);
    await updatePrice(product.id, price);
    form.reset();
    toast.success("Preço atualizado", {
      description: `Novo preço: ${formatCurrency(price)}`,
    });
    router.refresh();
  }

  const calc = product.lastPrice
    ? calculate(
        product.lastPrice,
        product.packageWeight,
        product.unit as any,
        product.doseSize,
        product.doseUnit as any,
        product.bonus ?? undefined,
      )
    : null;

  const chartData = product.prices.map((p) => ({
    price: p.price,
    date: new Date(p.createdAt).toLocaleDateString("pt-BR"),
  }));

  const priceDelta =
    product.prices.length >= 2
      ? product.prices[product.prices.length - 1].price -
        product.prices[0].price
      : null;

  const stats = [
    {
      label: "Preço atual",
      value: product.lastPrice ? formatCurrency(product.lastPrice) : "—",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Custo por dose",
      value: calc ? formatCurrency(calc.costPerDose) : "—",
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "Rendimento",
      value: calc ? `${formatDoses(calc.totalDoses)} doses` : "—",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Dose",
      value: `${product.doseSize}${product.doseUnit} cada`,
      icon: Beaker,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <BarChart3 className="size-6 text-accent" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
                <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1">
                  {product.category.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className={`size-3.5 ${s.color}`} />
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {priceDelta !== null && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Clock className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Variação total:</span>
                <span className={priceDelta > 0 ? "text-destructive font-medium" : "text-accent font-medium"}>
                  {priceDelta > 0 ? "+" : ""}{formatCurrency(priceDelta)}
                </span>
              </div>
            )}

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Peso: {product.packageWeight}{product.unit}{product.bonus ? ` (+${product.bonus}g bônus)` : ""}</p>
              <p>Registros de preço: {product.prices.length}</p>
              <p>Cadastrado em: {new Date(product.createdAt).toLocaleDateString("pt-BR")}</p>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-primary mb-3">Atualizar preço</h2>
            <form onSubmit={handleUpdatePrice} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="price" className="text-xs text-muted-foreground">
                  Novo valor (R$)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="99,90"
                  required
                />
              </div>
              <Button type="submit" className="bg-accent hover:bg-emerald-600 shrink-0">
                Atualizar
              </Button>
            </form>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-accent" />
            Histórico de preços
          </h2>
          <PriceChart data={chartData} />
          {product.prices.length > 0 && (
            <div className="mt-4 max-h-48 overflow-y-auto space-y-1">
              {[...product.prices].reverse().map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-muted/50 text-sm"
                >
                  <span className="text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="font-medium">{formatCurrency(p.price)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
