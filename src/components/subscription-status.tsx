"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Crown, Loader2, XCircle, AlertTriangle } from "lucide-react"

interface SubscriptionInfo {
  plan: { name: string; slug: string; price: number }
  status: string
  billingType: string | null
  currentPeriodEnd: string | null
}

export function SubscriptionStatus() {
  const { data: session } = useSession()
  const [sub, setSub] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }
    fetch("/api/asaas/subscription")
      .then((r) => r.json().catch(() => null))
      .then((data) => setSub(data))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [session])

  const [showConfirm, setShowConfirm] = useState(false)

  async function handleCancel() {
    setCancelling(true)
    try {
      const res = await fetch("/api/asaas/subscription", { method: "DELETE" })
      if (res.ok) {
        toast.success("Assinatura cancelada")
        setSub(null)
      } else {
        toast.error("Erro ao cancelar")
      }
    } catch {
      toast.error("Erro ao cancelar")
    }
    setCancelling(false)
  }

  if (loading || !session?.user) return null

  const isActive = sub?.status === "active"
  const planName = sub?.plan?.name ?? "Grátis"

  return (
    <div className={`flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1.5 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
        : "bg-muted/50 text-muted-foreground border border-border/40"
    }`}>
      {isActive ? (
        <Crown className="size-3.5" />
      ) : (
        <Loader2 className="size-3.5" />
      )}
      <span>{isActive ? planName : "Grátis"}</span>

      {isActive && (
        <>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={cancelling}
            className="ml-1.5 p-0.5 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
            title="Cancelar assinatura"
            aria-label="Cancelar assinatura"
          >
            <XCircle className="size-3.5" />
          </button>
          {showConfirm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="size-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">Cancelar assinatura</h3>
                    <p className="text-xs text-muted-foreground">Tem certeza? Você perderá os benefícios do plano.</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-full border border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false)
                      handleCancel()
                    }}
                    disabled={cancelling}
                    className="px-4 py-2 text-xs font-semibold rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {cancelling ? "Cancelando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
