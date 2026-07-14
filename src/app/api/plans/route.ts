import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { priority: "asc" },
  })
  return NextResponse.json(plans)
}
