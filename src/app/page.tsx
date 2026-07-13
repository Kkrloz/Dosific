import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { NewProductForm } from "@/components/new-product-form";
import { ComparisonSection } from "@/components/comparison-section";
import { calculate } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Wallet className="size-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Dosific</h1>
          <p className="text-muted-foreground mt-1">
            Calcule e compare o custo por dose dos seus produtos para economizar
          </p>
          {withCalc.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {withCalc.length} produto{withCalc.length !== 1 ? "s" : ""} com preço cadastrado
              {bestCostPerDose !== null
                ? ` · Melhor custo/dose: ${formatCurrency(bestCostPerDose)}`
                : ""}
            </p>
          )}
        </div>
      </div>

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
