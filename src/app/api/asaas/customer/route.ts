import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCustomer } from "@/lib/asaas"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  if (user.asaasCustomerId) {
    return NextResponse.json({ customerId: user.asaasCustomerId })
  }

  const customer = await createCustomer({
    name: user.name ?? user.email.split("@")[0],
    email: user.email,
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { asaasCustomerId: customer.id },
  })

  return NextResponse.json({ customerId: customer.id })
}
