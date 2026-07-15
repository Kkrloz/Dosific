"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2, CreditCard, QrCode, Barcode } from "lucide-react"

interface Plan {
  id: string
  name: string
  price: number
}

interface PaymentFormProps {
  plan: Plan
  onClose: () => void
}

type BillingType = "CREDIT_CARD" | "PIX" | "BOLETO"

export function PaymentForm({ plan, onClose }: PaymentFormProps) {
  const [billingType, setBillingType] = useState<BillingType>("CREDIT_CARD")
  const [loading, setLoading] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<Record<string, string> | null>(null)

  const billingOptions: { type: BillingType; label: string; icon: typeof CreditCard }[] = [
    { type: "CREDIT_CARD", label: "Cartão de Crédito", icon: CreditCard },
    { type: "PIX", label: "PIX", icon: QrCode },
    { type: "BOLETO", label: "Boleto", icon: Barcode },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const body: Record<string, unknown> = {
      planId: plan.id,
      billingType,
    }

    if (billingType === "CREDIT_CARD") {
      body.creditCard = {
        holderName: formData.get("holderName"),
        number: formData.get("number"),
        expiryMonth: formData.get("expiryMonth"),
        expiryYear: formData.get("expiryYear"),
        ccv: formData.get("ccv"),
      }
      body.creditCardHolderInfo = {
        name: formData.get("holderName"),
        email: formData.get("email"),
        cpfCnpj: formData.get("cpfCnpj"),
      }
    }

    try {
      const res = await fetch("/api/asaas/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Assinatura ${plan.name} realizada!`)
        setPaymentInfo({ status: data.status })
        setTimeout(onClose, 2000)
      } else {
        toast.error(data.error || "Erro ao processar pagamento")
      }
    } catch {
      toast.error("Erro ao processar pagamento")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">Assinar {plan.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            R$ {plan.price.toFixed(2)}/mês
          </p>
        </div>

        {paymentInfo ? (
          <div className="text-center py-8">
            <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <div className="size-6 text-emerald-500">
                <Loader2 className="size-6 animate-spin" />
              </div>
            </div>
            <p className="text-sm font-semibold">Assinatura processada!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {paymentInfo.status === "PENDING" ? "Pendente" : "Ativa"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              {billingOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setBillingType(opt.type)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    billingType === opt.type
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <opt.icon className="size-4" />
                  {opt.label}
                </button>
              ))}
            </div>

            {billingType === "CREDIT_CARD" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Nome no Cartão</Label>
                  <Input name="holderName" placeholder="Como está no cartão" required className="bg-background/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Número do Cartão</Label>
                  <Input name="number" placeholder="0000 0000 0000 0000" required className="bg-background/50" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Mês</Label>
                    <Input name="expiryMonth" placeholder="MM" required className="bg-background/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Ano</Label>
                    <Input name="expiryYear" placeholder="AAAA" required className="bg-background/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">CVV</Label>
                    <Input name="ccv" placeholder="123" required className="bg-background/50" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">CPF</Label>
                  <Input name="cpfCnpj" placeholder="000.000.000-00" required className="bg-background/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                  <Input name="email" type="email" placeholder="seu@email.com" required className="bg-background/50" />
                </div>
              </>
            )}

            {billingType === "PIX" && (
              <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                Após confirmar, você receberá o QR Code PIX para pagamento.
              </p>
            )}

            {billingType === "BOLETO" && (
              <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                O boleto será gerado e poderá ser pago em qualquer banco.
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-9"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `Assinar - R$ ${plan.price.toFixed(2)}`
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
