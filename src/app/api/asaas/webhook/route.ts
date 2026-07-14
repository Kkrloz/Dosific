import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { parseWebhookPayload } from "@/lib/asaas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, payment } = parseWebhookPayload(body)

    if (!payment.subscription) {
      return NextResponse.json({ received: true })
    }

    const subscription = await prisma.subscription.findFirst({
      where: { asaasSubscriptionId: payment.subscription },
      include: { plan: true },
    })

    if (!subscription) {
      return NextResponse.json({ received: true })
    }

    switch (event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED":
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "active",
            currentPeriodEnd: new Date(payment.dueDate),
          },
        })
        break

      case "PAYMENT_OVERDUE":
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "overdue" },
        })
        break

      case "PAYMENT_DELETED":
      case "SUBSCRIPTION_CANCELLED":
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "cancelled" },
        })
        break
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
