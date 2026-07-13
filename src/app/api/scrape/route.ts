import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/scraper";

export async function POST() {
  const products = await prisma.product.findMany({
    where: { url: { not: null } },
  });

  const results: { product: string; success: boolean; price?: number; error?: string }[] = [];

  for (const product of products) {
    if (!product.url) continue;

    const result = await scrapeProduct(product.url);
    if (result.price !== null) {
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          price: result.price,
        },
      });
      await prisma.product.update({
        where: { id: product.id },
        data: { lastPrice: result.price },
      });
      results.push({ product: product.name, success: true, price: result.price });
    } else {
      results.push({ product: product.name, success: false, error: result.error });
    }
  }

  return NextResponse.json({
    scraped: results.length,
    results,
  });
}
