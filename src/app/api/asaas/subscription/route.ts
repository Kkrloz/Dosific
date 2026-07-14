import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCustomer, createSubscription, cancelSubscription } from "@/lib/asaas"
import type { BillingType, AsaasCreditCard, AsaasCreditCardHolderInfo } from "@/lib/asaas"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const { planId, billingType, creditCard, creditCardHolderInfo } = body as {
    planId: string
    billingType: BillingType
    creditCard?: AsaasCreditCard
    creditCardHolderInfo?: AsaasCreditCardHolderInfo
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan || !plan.active) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 })
  }

  if (plan.price === 0) {
    const sub = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, planId: plan.id, status: "active" },
      update: { planId: plan.id, status: "active" },
    })
    return NextResponse.json({ subscriptionId: sub.id, plan: plan.slug })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  let asaasCustomerId = user.asaasCustomerId
  if (!asaasCustomerId) {
    const customer = await createCustomer({
      name: user.name ?? user.email.split("@")[0],
      email: user.email,
    })
    asaasCustomerId = customer.id
    await prisma.user.update({
      where: { id: user.id },
      data: { asaasCustomerId },
    })
  }

  const nextDueDate = new Date()
  nextDueDate.setDate(nextDueDate.getDate() + 1)

  const subscription = await createSubscription({
    customer: asaasCustomerId,
    billingType,
    value: plan.price,
    nextDueDate: nextDueDate.toISOString().split("T")[0],
    cycle: "MONTHLY",
    description: `Dosific - ${plan.name}`,
    creditCard: billingType === "CREDIT_CARD" ? creditCard : undefined,
    creditCardHolderInfo: billingType === "CREDIT_CARD" ? creditCardHolderInfo : undefined,
  })

  const periodStart = new Date()
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 1)

  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      planId: plan.id,
      status: subscription.status === "ACTIVE" ? "active" : "pending",
      billingType,
      asaasCustomerId,
      asaasSubscriptionId: subscription.id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
    update: {
      planId: plan.id,
      status: subscription.status === "ACTIVE" ? "active" : "pending",
      billingType,
      asaasCustomerId,
      asaasSubscriptionId: subscription.id,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  })

  return NextResponse.json({
    subscriptionId: subscription.id,
    status: subscription.status,
    nextDueDate: subscription.nextDueDate,
  })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!sub) {
    return NextResponse.json({ error: "Nenhuma assinatura ativa" }, { status: 404 })
  }

  if (sub.asaasSubscriptionId) {
    await cancelSubscription(sub.asaasSubscriptionId)
  }

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "cancelled" },
  })

  return NextResponse.json({ success: true })
}
