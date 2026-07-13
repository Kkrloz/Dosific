import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { NewProductForm } from "@/components/new-product-form";
import { ComparisonSection } from "@/components/comparison-section";
import { calculate } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Award, TrendingUp, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const withCalc = products
    .filter((p) => p.lastPrice !== null)
    .map((p) => ({
      ...p,
      costPerDose: calculate(
        p.lastPrice!,
        p.packageWeight,
        p.unit as any,
        p.doseSize,
        p.doseUnit as any,
        p.bonus ?? undefined,
      ).costPerDose,
    }));

  const bestCostPerDose = withCalc.length > 0
    ? Math.min(...withCalc.map((p) => p.costPerDose))
    : null;

  const bestProduct = withCalc.length > 0
    ? withCalc.reduce((best, curr) => curr.costPerDose < best.costPerDose ? curr : best)
    : null;

  const avgCostPerDose = withCalc.length > 0
    ? withCalc.reduce((sum, p) => sum + p.costPerDose, 0) / withCalc.length
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/20">
            <Wallet className="size-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Dosific
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Calcule e compare o custo por dose dos seus produtos para economizar inteligente.
            </p>
          </div>
        </div>
      </div>

      {withCalc.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/10">
              <Layers className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Produtos Cadastrados</p>
              <h3 className="text-2xl font-bold text-primary mt-0.5">{withCalc.length}</h3>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/10">
              <Award className="size-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Melhor Custo/Dose</p>
              <h3 className="text-2xl font-bold text-emerald-500 mt-0.5 truncate">
                {bestProduct ? `${formatCurrency(bestProduct.costPerDose)}` : "—"}
              </h3>
              {bestProduct && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {bestProduct.name}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/10">
              <TrendingUp className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Custo Médio/Dose</p>
              <h3 className="text-2xl font-bold text-primary mt-0.5">
                {avgCostPerDose !== null ? formatCurrency(avgCostPerDose) : "—"}
              </h3>
            </div>
          </div>
        </div>
      )}

      <NewProductForm categories={categories} />

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Wallet className="size-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-primary mb-1">Nenhum produto ainda</h2>
          <p className="text-sm text-muted-foreground">
            Adicione seu primeiro produto para começar a calcular
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <ProductCard
                  id={p.id}
                  name={p.name}
                  categoryName={p.category.name}
                  packageWeight={p.packageWeight}
                  unit={p.unit}
                  doseSize={p.doseSize}
                  doseUnit={p.doseUnit}
                  bonus={p.bonus}
                  lastPrice={p.lastPrice}
                  isBest={
                    p.lastPrice !== null &&
                    bestCostPerDose !== null &&
                    calculate(
                      p.lastPrice,
                      p.packageWeight,
                      p.unit as any,
                      p.doseSize,
                      p.doseUnit as any,
                      p.bonus ?? undefined,
                    ).costPerDose === bestCostPerDose
                  }
                />
              </div>
            ))}
          </div>

          {withCalc.length > 1 && (
            <ComparisonSection products={products} />
          )}
        </>
      )}
    </div>
  );
}
