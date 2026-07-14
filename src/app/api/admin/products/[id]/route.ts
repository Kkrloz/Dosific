import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body as { status: "APPROVED" | "REJECTED" }

  const product = await prisma.product.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(product)
}
