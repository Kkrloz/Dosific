import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const plans = [
    {
      name: "Free",
      slug: "free",
      description: "Para quem quer testar a plataforma",
      price: 0,
      cycle: "MONTHLY",
      maxProducts: 3,
      affiliate: false,
      featured: false,
      priority: 0,
    },
    {
      name: "PRO",
      slug: "pro",
      description: "Para quem leva a suplementação a sério",
      price: 29.9,
      cycle: "MONTHLY",
      maxProducts: -1,
      affiliate: true,
      featured: false,
      priority: 1,
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "Para lojas e criadores de conteúdo",
      price: 99.9,
      cycle: "MONTHLY",
      maxProducts: -1,
      affiliate: true,
      featured: true,
      priority: 2,
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    })
  }

  const categories = [
    "Creatina",
    "Whey Protein",
    "Pré-Treino",
    "BCAA",
    "Vitaminas",
    "Ômega 3",
    "Colágeno",
    "Termogênicos",
    "Multivitamínicos",
    "Outros",
  ]

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: { name },
      create: { name },
    })
  }

  const categoryMap = new Map<string, string>()
  const allCategories = await prisma.category.findMany()
  for (const cat of allCategories) {
    categoryMap.set(cat.name, cat.id)
  }

  const affiliateParams = "matt_tool=95231484&matt_word=goncalvescarlo20230414132440"

  const products: {
    name: string
    category: string
    price: number
    weight: number
    unit: string
    dose: number
    doseUnit: string
    url: string
  }[] = [
    { name: "Creatina Creapure 250g", category: "Creatina", price: 112.90, weight: 250, unit: "g", dose: 3, doseUnit: "g", url: "https://www.mercadolivre.com.br/creatina-creapure-250g-growth-supplements-sem-sabor-em-po-suplemento-esportivo/p/MLB18726360" },
    { name: "Creatina Monohidratada 500g", category: "Creatina", price: 59.90, weight: 500, unit: "g", dose: 3, doseUnit: "g", url: "https://www.mercadolivre.com.br/creatina-monohidratada-500g-growth-supplements-sem-sabor-em-po/p/MLB66637233" },
    { name: "100% Whey Concentrado 900g", category: "Whey Protein", price: 166.90, weight: 900, unit: "g", dose: 30, doseUnit: "g", url: "https://www.mercadolivre.com.br/100-whey-concentrado-900g-growth-supplements/up/MLBU3892868634" },
    { name: "Haze Hardcore 300g", category: "Pré-Treino", price: 89.90, weight: 300, unit: "g", dose: 10, doseUnit: "g", url: "https://produto.mercadolivre.com.br/MLB-2655275554-haze-hardcore-pre-treino-300g-growth-supplements-_JM" },
    { name: "Creatina Hardcore 1kg", category: "Creatina", price: 297, weight: 1000, unit: "g", dose: 3, doseUnit: "g", url: "https://www.mercadolivre.com.br/creatina-100-pura-pouch-1kg-integralmedica/p/MLB18552153" },
    { name: "Whey 100% Pure 900g", category: "Whey Protein", price: 149, weight: 900, unit: "g", dose: 30, doseUnit: "g", url: "https://www.mercadolivre.com.br/whey-100-pure-pote-900g-chocolate-integralmedica/p/MLB12702739" },
    { name: "Évora PW 300g", category: "Pré-Treino", price: 139, weight: 300, unit: "g", dose: 10, doseUnit: "g", url: "https://www.mercadolivre.com.br/evora-pre-treino-frutas-vermelhas-300g-darkness/p/MLB18724257" },
    { name: "Creatina Pura 500g Dark Lab", category: "Creatina", price: 79.90, weight: 500, unit: "g", dose: 3, doseUnit: "g", url: "https://www.mercadolivre.com.br/creatina-monohidratada-pura-500g-dark-lab-unidade/p/MLB26796581" },
    { name: "100% Whey Max Titanium 900g", category: "Whey Protein", price: 129.90, weight: 900, unit: "g", dose: 30, doseUnit: "g", url: "https://www.mercadolivre.com.br/100-whey-max-titanium-proteinas-proteinas-sabor-baunilha-x-900g-pote/p/MLB18418074" },
    { name: "Creatina Monohidratada 300g", category: "Creatina", price: 97, weight: 300, unit: "g", dose: 3, doseUnit: "g", url: "https://www.mercadolivre.com.br/creatina-100-pura-300g-integralmedica-forca-e-performance/p/MLB6204289" },
    { name: "Whey Gourmet 800g", category: "Whey Protein", price: 139.90, weight: 800, unit: "g", dose: 30, doseUnit: "g", url: "https://produto.mercadolivre.com.br/MLB-5563352278-whey-protein-gourmet-concentrado-chef-whey-800g-_JM" },
    { name: "Pré-Treino Core 150g", category: "Pré-Treino", price: 49.90, weight: 150, unit: "g", dose: 7.5, doseUnit: "g", url: "https://www.mercadolivre.com.br/pre-treino-core-150g-growth-supplements/up/MLBU3977269801" },
  ]

  let count = 0
  for (const p of products) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.warn(`Categoria não encontrada: ${p.category}`)
      continue
    }
    const existing = await prisma.product.findFirst({ where: { name: p.name } })
    if (existing) {
      console.log(`Produto já existe: ${p.name}`)
      continue
    }
    const affiliateLink = `${p.url}?${affiliateParams}`

    await prisma.product.create({
      data: {
        name: p.name,
        categoryId,
        packageWeight: p.weight,
        unit: p.unit,
        doseSize: p.dose,
        doseUnit: p.doseUnit,
        lastPrice: p.price,
        url: p.url,
        affiliateLink,
        status: "APPROVED",
        prices: { create: { price: p.price } },
      },
    })
    count++
  }

  console.log(`${count} produtos adicionados com sucesso!`)
  console.log("Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
