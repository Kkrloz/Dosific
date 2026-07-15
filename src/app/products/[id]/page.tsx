import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/product-detail";
import { auth } from "@/lib/auth";
import { shouldShowAds, ADSENSE_SLOTS } from "@/lib/adsense";
import { AdBanner } from "@/components/ad-banner";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { name: true } },
      prices: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!product) notFound();

  const showAds = await shouldShowAds(await auth())

  return (
    <>
      <AdBanner slot={ADSENSE_SLOTS.productDetail} format="horizontal" show={showAds} className="mb-6" />
      <ProductDetail product={product} />
    </>
  );
}
