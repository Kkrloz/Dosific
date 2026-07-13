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
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
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

  const kpis = [
    {
      label: "Preço Atual",
      value: product.lastPrice ? formatCurrency(product.lastPrice) : "—",
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-muted/40 border border-border/20",
    },
    {
      label: "Custo por Dose",
      value: calc ? formatCurrency(calc.costPerDose) : "—",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] border border-emerald-500/10 shadow-sm",
    },
    {
      label: "Rendimento",
      value: calc ? `${formatDoses(calc.totalDoses)} doses` : "—",
      icon: Package,
      color: "text-primary",
      bg: "bg-muted/40 border border-border/20",
    },
    {
      label: "Tamanho da Dose",
      value: `${product.doseSize}${product.doseUnit}`,
      icon: Beaker,
      color: "text-primary",
      bg: "bg-muted/40 border border-border/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-500 bg-card hover:bg-emerald-500/[0.02] border border-border/40 hover:border-emerald-500/20 px-3.5 py-2 rounded-full transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para Início
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Coluna Esquerda: Informações e Ações */}
        <div className="space-y-6">
          <Card className="p-6 border border-border/40 bg-card/65 backdrop-blur-sm shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/15">
                <BarChart3 className="size-6 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-primary tracking-tight">{product.name}</h1>
                <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
                  {product.category.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className={`rounded-xl p-3.5 ${kpi.bg}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <kpi.icon className={`size-4 ${kpi.color}`} />
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  </div>
                  <p className={`text-xl font-extrabold tracking-tight ${kpi.color === 'text-primary' ? 'text-primary' : kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {priceDelta !== null && (
              <div className="mt-5 p-3 rounded-xl border border-border/30 bg-muted/20 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Variação desde o início:</span>
                </div>
                <div className={`flex items-center gap-0.5 font-bold ${priceDelta > 0 ? "text-red-500" : priceDelta < 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {priceDelta > 0 ? (
                    <>
                      <ArrowUpRight className="size-4" />
                      +{formatCurrency(priceDelta)}
                    </>
                  ) : priceDelta < 0 ? (
                    <>
                      <ArrowDownRight className="size-4" />
                      {formatCurrency(priceDelta)}
                    </>
                  ) : (
                    "Sem variação"
                  )}
                </div>
              </div>
            )}

            <Separator className="my-5 opacity-40" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground/80 bg-muted/10 p-3 rounded-xl border border-border/20">
              <p>Peso total: <strong className="text-primary font-semibold">{product.packageWeight}{product.unit}{product.bonus ? ` (+${product.bonus}g bônus)` : ""}</strong></p>
              <p>Registros de preço: <strong className="text-primary font-semibold">{product.prices.length}</strong></p>
              <p className="col-span-2">Cadastrado em: <strong className="text-primary font-semibold">{new Date(product.createdAt).toLocaleDateString("pt-BR", { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
            </div>
          </Card>

          <Card className="p-5 border border-border/40 bg-card/65 backdrop-blur-sm shadow-sm">
            <h3 className="text-sm font-bold text-primary mb-3.5 flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-500" />
              Atualizar Preço do Produto
            </h3>
            <form onSubmit={handleUpdatePrice} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label htmlFor="price" className="text-xs font-medium text-muted-foreground">
                  Novo Valor (R$)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="99,90"
                  required
                  className="bg-background/50"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-sm hover:shadow cursor-pointer transition-all px-5">
                Atualizar
              </Button>
            </form>
          </Card>
        </div>

        {/* Coluna Direita: Gráfico e Histórico de Preços */}
        <Card className="p-6 border border-border/40 bg-card/65 backdrop-blur-sm shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-primary flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Histórico de Preços
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Acompanhe a variação de preço deste produto ao longo do tempo</p>
          </div>
          
          <PriceChart data={chartData} />
          
          {product.prices.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Histórico de Alterações</h4>
              <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                {[...product.prices].reverse().map((p, idx, arr) => {
                  const prev = arr[idx + 1];
                  const diff = prev ? p.price - prev.price : null;

                  return (
                    <div
                      key={p.id}
                      className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-background/50 border border-border/30 hover:border-border/60 transition-all duration-200 text-sm"
                    >
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Calendar className="size-3.5 text-muted-foreground/60" />
                        <span className="text-xs font-medium">
                          {new Date(p.createdAt).toLocaleDateString("pt-BR", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {diff !== null && diff !== 0 && (
                          <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            diff > 0 
                              ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {diff > 0 ? `+${formatCurrency(diff)}` : `${formatCurrency(diff)}`}
                          </span>
                        )}
                        <span className="font-bold text-primary">{formatCurrency(p.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
