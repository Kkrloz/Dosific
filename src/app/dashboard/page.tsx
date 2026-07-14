import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Package, BarChart3, ExternalLink, Crown, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    include: { plan: true },
  })

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    include: { category: true, _count: { select: { clicks: true } } },
    orderBy: { createdAt: "desc" },
  })

  const totalClicks = products.reduce((sum, p) => sum + p._count.clicks, 0)
  const plan = subscription?.plan

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meu Painel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus produtos e links de afiliado
          </p>
        </div>
        {plan && plan.price > 0 && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
            <Crown className="size-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{plan.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Package className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Produtos</span>
          </div>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <BarChart3 className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliques</span>
          </div>
          <p className="text-2xl font-bold">{totalClicks}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Crown className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plano</span>
          </div>
          <p className="text-xl font-bold">{plan?.name ?? "Grátis"}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Você ainda não adicionou nenhum produto.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Seus Produtos</h2>
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border/40 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : p.status === "PENDING"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                    {p.status === "APPROVED" ? "Aprovado" : p.status === "PENDING" ? "Pendente" : "Rejeitado"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.category.name} · {p._count.clicks} cliques
                </p>
              </div>
              {p.affiliateLink && (
                <a
                  href={p.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
