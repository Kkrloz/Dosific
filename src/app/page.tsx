import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { NewProductForm } from "@/components/new-product-form";
import { ComparisonSection } from "@/components/comparison-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">Dosific</h1>
        <p className="text-muted-foreground text-sm">
          Calcule e compare o custo por dose dos seus produtos
        </p>
      </div>

      <NewProductForm categories={categories} />

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum produto cadastrado. Adicione o primeiro acima.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                categoryName={p.category.name}
                packageWeight={p.packageWeight}
                unit={p.unit}
                doseSize={p.doseSize}
                doseUnit={p.doseUnit}
                bonus={p.bonus}
                lastPrice={p.lastPrice}
              />
            ))}
          </div>

          {products.length > 1 && (
            <ComparisonSection products={products} />
          )}
        </>
      )}
    </div>
  );
}
