"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "./auth";
import { prisma } from "./prisma";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  price: z.number().positive("Preço deve ser positivo"),
  packageWeight: z.number().positive("Peso deve ser positivo"),
  unit: z.enum(["g", "kg", "ml", "L"]),
  doseSize: z.number().positive("Dose deve ser positiva"),
  doseUnit: z.enum(["g", "ml"]),
  bonus: z.number().min(0).optional().nullable(),
  url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  affiliateLink: z.string().url("Link de afiliado inválido").optional().nullable().or(z.literal("")),
});

async function getUserPlan(userId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  })
  return sub?.plan ?? null
}

export async function createProduct(formData: FormData) {
  const session = await auth()

  if (session?.user?.id) {
    const plan = await getUserPlan(session.user.id)
    const maxProducts = plan?.maxProducts ?? 3
    if (maxProducts !== -1) {
      const count = await prisma.product.count({
        where: { userId: session.user.id },
      })
      if (count >= maxProducts) {
        return {
          success: false,
          errors: {
            name: [`Limite de ${maxProducts} produtos. Faça upgrade para o PRO.`],
          },
        }
      }
    }
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price") ? parseFloat(formData.get("price") as string) : undefined,
    packageWeight: formData.get("packageWeight") ? parseFloat(formData.get("packageWeight") as string) : undefined,
    unit: formData.get("unit"),
    doseSize: formData.get("doseSize") ? parseFloat(formData.get("doseSize") as string) : undefined,
    doseUnit: formData.get("doseUnit"),
    bonus: formData.get("bonus") ? parseFloat(formData.get("bonus") as string) : null,
    url: formData.get("url") || null,
    affiliateLink: formData.get("affiliateLink") || null,
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { name, categoryId, price, packageWeight, unit, doseSize, doseUnit, bonus, url, affiliateLink: rawAffiliateLink } = parsed.data;

  let affiliateLink = rawAffiliateLink

  if (rawAffiliateLink && session?.user?.id) {
    const plan = await getUserPlan(session.user.id)
    if (!plan?.affiliate) {
      affiliateLink = null
    }
  }

  if (rawAffiliateLink && !session?.user?.id) {
    affiliateLink = null
  }
  const newCategory = formData.get("newCategory") as string | null;

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
      url: url || null,
      affiliateLink: affiliateLink || null,
      lastPrice: price,
      userId: session?.user?.id ?? null,
      status: "APPROVED",
      prices: {
        create: { price },
      },
    },
  });

  revalidatePath("/");
  return { success: true, productId: product.id };
}

export async function updatePrice(productId: string, price: number) {
  const parsed = z.number().positive("Preço deve ser positivo").safeParse(price);
  if (!parsed.success) {
    return { success: false, errors: { price: ["Preço inválido"] } };
  }

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
    where: { status: "APPROVED" },
    include: { category: true, user: { select: { name: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { name: true } },
      prices: { orderBy: { createdAt: "asc" } },
    },
  });
}
