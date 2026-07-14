import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { NewProductForm } from "@/components/new-product-form";
import { ComparisonSection } from "@/components/comparison-section";
import { calculate, type Unit } from "@/lib/calculator";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { Wallet, Award, TrendingUp, Layers, Sparkles, Search, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const searchQuery = typeof q === "string" ? q : "";

  const products = await prisma.product.findMany({
    where: {
      status: "APPROVED",
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { category: { name: { contains: searchQuery, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { category: true, user: { select: { name: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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
        p.unit as Unit,
        p.doseSize,
        p.doseUnit as Unit,
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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/[0.07] via-emerald-400/[0.03] to-background border border-emerald-500/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 overflow-hidden">
              <Image
                src="/icone-removebg-preview.png"
                alt="Dosific Ícone"
                width={56}
                height={56}
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  Dosific
                </h1>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Beta
                </span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                Calcule e compare o custo por dose dos seus produtos para <strong className="text-emerald-500 font-semibold">economizar inteligente</strong>.
              </p>
            </div>
          </div>
          {withCalc.length > 0 && (
            <div className="flex items-center gap-3 shrink-0 bg-background/60 backdrop-blur-sm border border-border/40 rounded-xl px-4 py-2.5">
              <div className="flex -space-x-2">
                {withCalc.slice(0, 4).map((p) => (
                  <div key={p.id} className="size-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {withCalc.length > 4 && (
                  <div className="size-7 rounded-full bg-muted text-[10px] font-bold text-muted-foreground flex items-center justify-center ring-2 ring-background">
                    +{withCalc.length - 4}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium">{withCalc.length} produtos</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Active State */}
      {searchQuery && (
        <div className="flex items-center gap-2 bg-emerald-500/[0.04] border border-emerald-500/15 rounded-xl px-4 py-2.5">
          <Search className="size-4 text-emerald-500 shrink-0" />
          <span className="text-sm text-muted-foreground">
            Resultados para: <strong className="text-primary font-semibold">&ldquo;{searchQuery}&rdquo;</strong>
          </span>
          <span className="text-xs text-muted-foreground/60 ml-auto">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </span>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-emerald-500 bg-muted/50 hover:bg-emerald-500/10 px-2.5 py-1 rounded-full transition-all"
          >
            <X className="size-3" />
            Limpar
          </a>
        </div>
      )}

      {/* Stats Cards */}
      {!searchQuery && withCalc.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 group">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/10 group-hover:bg-emerald-500/15 transition-colors">
              <Layers className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Produtos Cadastrados</p>
              <h3 className="text-2xl font-bold text-primary mt-0.5">{withCalc.length}</h3>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 group">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/10 group-hover:bg-emerald-500/15 transition-colors">
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

          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 group">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/10 group-hover:bg-emerald-500/15 transition-colors">
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

      <div id="new-product">
        <NewProductForm categories={categories} />
      </div>

      {products.length > 0 && (searchQuery ? products.length > 0 : true) ? (
        <>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              Exibindo {products.length} {products.length === 1 ? "produto" : "produtos"}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <ProductCard
                  id={p.id}
                  name={p.name}
                  categoryName={p.category.name}
                  packageWeight={p.packageWeight}
                  unit={p.unit as Unit}
                  doseSize={p.doseSize}
                  doseUnit={p.doseUnit as Unit}
                  bonus={p.bonus}
                  lastPrice={p.lastPrice}
                  url={p.url}
                  affiliateLink={p.affiliateLink}
                  isBest={
                    p.lastPrice !== null &&
                    bestCostPerDose !== null &&
                    calculate(
                      p.lastPrice,
                      p.packageWeight,
                      p.unit as Unit,
                      p.doseSize,
                      p.doseUnit as Unit,
                      p.bonus ?? undefined,
                    ).costPerDose === bestCostPerDose
                  }
                />
              </div>
            ))}
          </div>

          {withCalc.length > 1 && (
            <div id="compare">
              <ComparisonSection products={products} />
            </div>
          )}
        </>
      ) : !searchQuery && (
        <div className="text-center py-20">
          <div className="size-20 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mx-auto mb-5 ring-1 ring-emerald-500/20">
            <Sparkles className="size-9 text-emerald-500/70" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">Nenhum produto ainda</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Adicione seu primeiro produto para começar a calcular o custo por dose e descobrir onde economizar.
          </p>
          <a
            href="/#new-product"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all"
          >
            <Wallet className="size-4" />
            Adicionar Primeiro Produto
          </a>
        </div>
      )}
    </div>
  );
}
