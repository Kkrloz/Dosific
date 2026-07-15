import { prisma } from "./prisma"
import type { Session } from "next-auth"

export const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ""
export const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"

export const ADSENSE_SLOTS = {
  // Copie os IDs dos slots criados no Google AdSense console
  sidebar: "", // Ad unit para sidebar (vertical/rectangle 300x250)
  betweenContent: "", // Ad unit entre conteúdo (horizontal/auto)
  inFeed: "", // Ad unit in-feed nativa (responsiva)
  productDetail: "", // Ad unit na página de detalhes do produto (rectangle 300x250)
} as const

export async function shouldShowAds(session: Session | null): Promise<boolean> {
  if (!ADSENSE_ENABLED) return false
  if (!session?.user?.id) return true

  if (session.user.role === "ADMIN") return false

  const sub = await prisma.subscription.findFirst({
    where: { userId: session.user.id, status: "active" },
  })

  return !sub
}
