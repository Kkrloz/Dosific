import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
  }

  const targetUrl = product.affiliateLink || product.url
  if (!targetUrl) {
    return NextResponse.json({ error: "Sem link disponível" }, { status: 400 })
  }

  if (product.userId) {
    await prisma.click.create({
      data: {
        productId: product.id,
        affiliateId: product.userId,
      },
    })

    await prisma.product.update({
      where: { id: product.id },
      data: { clickCount: { increment: 1 } },
    })
  }

  return NextResponse.redirect(targetUrl, 307)
}
