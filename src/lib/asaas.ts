const BASE_URL = process.env.ASAAS_SANDBOX === "true"
  ? "https://sandbox.asaas.com/api/v3"
  : "https://api.asaas.com/v3"

const API_KEY = process.env.ASAAS_API_KEY ?? ""

interface AsaasCustomerInput {
  name: string
  email: string
  cpfCnpj?: string
  phone?: string
}

interface AsaasCreditCard {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
}

interface AsaasCreditCardHolderInfo {
  name: string
  email: string
  cpfCnpj: string
  postalCode?: string
  addressNumber?: string
  phone?: string
}

type BillingType = "BOLETO" | "CREDIT_CARD" | "PIX"

async function asaasFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: API_KEY,
      ...(options.headers as Record<string, string> ?? {}),
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.description ?? data.error ?? "Asaas error")
  }

  return data
}

export async function createCustomer(input: AsaasCustomerInput) {
  return asaasFetch("/customers", {
    method: "POST",
    body: JSON.stringify(input),
  }) as Promise<{ id: string; name: string; email: string }>
}

export async function createSubscription(input: {
  customer: string
  billingType: BillingType
  value: number
  nextDueDate: string
  cycle: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "BIMONTHLY" | "QUARTERLY" | "SEMIANNUALLY" | "YEARLY"
  description?: string
  creditCard?: AsaasCreditCard
  creditCardHolderInfo?: AsaasCreditCardHolderInfo
}) {
  return asaasFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify(input),
  }) as Promise<{ id: string; status: string; nextDueDate: string }>
}

export async function cancelSubscription(id: string) {
  return asaasFetch(`/subscriptions/${id}`, {
    method: "DELETE",
  }) as Promise<{ id: string; status: string }>
}

export async function getSubscription(id: string) {
  return asaasFetch(`/subscriptions/${id}`) as Promise<{
    id: string
    customer: string
    status: string
    value: number
    nextDueDate: string
    billingType: string
    cycle: string
  }>
}

export async function getOrCreateCustomer(user: { id: string; name: string | null; email: string; asaasCustomerId: string | null }) {
  if (user.asaasCustomerId) {
    return user.asaasCustomerId
  }
  const customer = await createCustomer({
    name: user.name ?? user.email.split("@")[0],
    email: user.email,
  })
  return customer.id
}

export function parseWebhookPayload(body: Record<string, unknown>) {
  const event = body.event as string
  const payment = body.payment as {
    id: string
    subscription: string
    status: string
    value: number
    dueDate: string
    billingType: string
    customer: string
  } | undefined

  if (!event || !payment) {
    throw new Error("Invalid webhook payload")
  }

  return { event, payment }
}

export type { BillingType, AsaasCreditCard, AsaasCreditCardHolderInfo }
