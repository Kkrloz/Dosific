"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X, Sparkles } from "lucide-react"
import { PaymentForm } from "./payment-form"

interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  cycle: string
  maxProducts: number
  affiliate: boolean
  featured: boolean
  priority: number
}

export function PlanSelector() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then(setPlans)
      .catch(() => toast.error("Erro ao carregar planos"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubscribe(plan: Plan) {
    if (plan.price === 0) {
      setSubscribing(true)
      try {
        const res = await fetch("/api/asaas/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan.id, billingType: "BOLETO" }),
        })
        if (res.ok) {
          toast.success(`Plano ${plan.name} ativado!`)
        } else {
          const data = await res.json()
          toast.error(data.error || "Erro ao ativar plano")
        }
      } catch {
        toast.error("Erro ao ativar plano")
      }
      setSubscribing(false)
      return
    }
    setSelectedPlan(plan)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-card border rounded-xl p-5 flex flex-col ${
              plan.featured
                ? "border-emerald-500/30 ring-1 ring-emerald-500/20"
                : "border-border/40"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="size-3" />
                MAIS POPULAR
              </div>
            )}

            <div className="mb-4 mt-1">
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="mb-5">
              <span className="text-3xl font-extrabold text-foreground">
                {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}`}
              </span>
              {plan.price > 0 && (
                <span className="text-xs text-muted-foreground ml-1">/mês</span>
              )}
            </div>

            <ul className="space-y-2 text-sm mb-6 flex-1">
              <li className="flex items-center gap-2 text-foreground">
                <Check className="size-4 text-emerald-500 shrink-0" />
                {plan.maxProducts === -1
                  ? "Produtos ilimitados"
                  : `Até ${plan.maxProducts} produtos`}
              </li>
              <li className="flex items-center gap-2 text-foreground">
                {plan.affiliate ? (
                  <Check className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <X className="size-4 text-muted-foreground/50 shrink-0" />
                )}
                Links de afiliado
              </li>
              <li className="flex items-center gap-2 text-foreground">
                {plan.featured ? (
                  <Check className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <X className="size-4 text-muted-foreground/50 shrink-0" />
                )}
                Produto em destaque
              </li>
            </ul>

            <Button
              onClick={() => handleSubscribe(plan)}
              disabled={subscribing || !session}
              className={
                plan.featured
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full"
                  : "bg-muted hover:bg-muted/80 text-foreground font-semibold w-full"
              }
            >
              {subscribing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : plan.price === 0 ? (
                "Começar Grátis"
              ) : (
                "Assinar"
              )}
            </Button>

            {!session && (
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Faça login para assinar
              </p>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentForm
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  )
}
