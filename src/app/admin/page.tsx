import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Check, X, ExternalLink, Package, Users, Crown } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/")

  const pendingProducts = await prisma.product.findMany({
    where: { status: "PENDING" },
    include: { category: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  const productCount = await prisma.product.count()
  const userCount = await prisma.user.count()
  const subscriptionCount = await prisma.subscription.count({
    where: { status: "active" },
  })

  async function approveProduct(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    await prisma.product.update({ where: { id }, data: { status: "APPROVED" } })
    redirect("/admin")
  }

  async function rejectProduct(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    await prisma.product.update({ where: { id }, data: { status: "REJECTED" } })
    redirect("/admin")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie produtos, usuários e planos</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Package className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Produtos</span>
          </div>
          <p className="text-2xl font-bold">{productCount}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Users className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuários</span>
          </div>
          <p className="text-2xl font-bold">{userCount}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Crown className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assinantes</span>
          </div>
          <p className="text-2xl font-bold">{subscriptionCount}</p>
        </div>
      </div>

      {pendingProducts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Package className="size-4 text-yellow-500" />
            Produtos Pendentes ({pendingProducts.length})
          </h2>
          {pendingProducts.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border/40 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {p.category.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  por {p.user?.name ?? p.user?.email ?? "Anônimo"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <form action={approveProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <Check className="size-4" />
                  </button>
                </form>
                <form action={rejectProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer">
                    <X className="size-4" />
                  </button>
                </form>
                {p.affiliateLink && (
                  <a
                    href={p.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-card border border-border/40 rounded-xl">
          <Check className="size-8 mx-auto mb-2 text-emerald-500/50" />
          <p className="text-sm">Nenhum produto pendente</p>
        </div>
      )}
    </div>
  )
}
