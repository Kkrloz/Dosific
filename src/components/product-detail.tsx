"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PriceChart } from "@/components/price-chart";
import { updatePrice } from "@/lib/actions";
import { calculate } from "@/lib/calculator";
import { formatCurrency, formatDoses } from "@/lib/utils";

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

  return (
    <div className="space-y-6">
      <div>
        <a href="/" className="text-sm text-muted-foreground hover:text-accent">
          ← Voltar
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
            <p className="text-sm text-muted-foreground">{product.category.name}</p>
          </div>

          <Separator />

          {product.lastPrice && calc ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Preço atual</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(product.lastPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Custo por dose</p>
                <p className="text-xl font-bold text-accent">{formatCurrency(calc.costPerDose)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rendimento total</p>
                <p className="text-lg font-semibold">{formatDoses(calc.totalDoses)} doses</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dose</p>
                <p className="text-lg font-semibold">
                  {product.doseSize}{product.doseUnit} cada
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum preço cadastrado</p>
          )}

          <Separator />

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Peso: {product.packageWeight}{product.unit}</p>
            {product.bonus && <p>Bônus: +{product.bonus}g</p>}
            <p>Cadastrado em: {new Date(product.createdAt).toLocaleDateString("pt-BR")}</p>
            <p>Registros de preço: {product.prices.length}</p>
          </div>

          <Separator />

          <form onSubmit={handleUpdatePrice} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="price">Atualizar preço</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="Novo preço" required />
            </div>
            <Button type="submit" className="bg-accent hover:bg-emerald-600">
              Atualizar
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Histórico de preços</h2>
          <PriceChart data={chartData} />
        </Card>
      </div>
    </div>
  );
}
