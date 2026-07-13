"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const categoryId = formData.get("categoryId") as string;
  const newCategory = formData.get("newCategory") as string;
  const price = parseFloat(formData.get("price") as string);
  const packageWeight = parseFloat(formData.get("packageWeight") as string);
  const unit = formData.get("unit") as string;
  const doseSize = parseFloat(formData.get("doseSize") as string);
  const doseUnit = formData.get("doseUnit") as string;
  const bonus = formData.get("bonus") ? parseFloat(formData.get("bonus") as string) : null;

  let finalCategoryId = categoryId;

  if (newCategory) {
    const cat = await prisma.category.create({ data: { name: newCategory } });
    finalCategoryId = cat.id;
  }

  const product = await prisma.product.create({
    data: {
      name,
      categoryId: finalCategoryId,
      packageWeight,
      unit,
      doseSize,
      doseUnit,
      bonus,
      lastPrice: price,
      prices: {
        create: { price },
      },
    },
  });

  revalidatePath("/");
  return { success: true, productId: product.id };
}

export async function updatePrice(productId: string, price: number) {
  await prisma.priceHistory.create({
    data: {
      productId,
      price,
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { lastPrice: price },
  });

  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      prices: { orderBy: { createdAt: "asc" } },
    },
  });
}
