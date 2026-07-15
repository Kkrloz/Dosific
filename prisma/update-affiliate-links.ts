import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const AFFILIATE_PARAMS = "matt_tool=95231484&matt_word=goncalvescarlo20230414132440"

const productLinks: { name: string; url: string }[] = [
  {
    name: "Creatina Creapure 250g",
    url: "https://www.mercadolivre.com.br/creatina-creapure-250g-growth-supplements-sem-sabor-em-po-suplemento-esportivo/p/MLB18726360",
  },
  {
    name: "Creatina Monohidratada 500g",
    url: "https://www.mercadolivre.com.br/creatina-monohidratada-500g-growth-supplements-sem-sabor-em-po/p/MLB66637233",
  },
  {
    name: "100% Whey Concentrado 900g",
    url: "https://www.mercadolivre.com.br/100-whey-concentrado-900g-growth-supplements/up/MLBU3892868634",
  },
  {
    name: "Haze Hardcore 300g",
    url: "https://produto.mercadolivre.com.br/MLB-2655275554-haze-hardcore-pre-treino-300g-growth-supplements-_JM",
  },
  {
    name: "Creatina Hardcore 1kg",
    url: "https://www.mercadolivre.com.br/creatina-100-pura-pouch-1kg-integralmedica/p/MLB18552153",
  },
  {
    name: "Whey 100% Pure 900g",
    url: "https://www.mercadolivre.com.br/whey-100-pure-pote-900g-chocolate-integralmedica/p/MLB12702739",
  },
  {
    name: "Évora PW 300g",
    url: "https://www.mercadolivre.com.br/evora-pre-treino-frutas-vermelhas-300g-darkness/p/MLB18724257",
  },
  {
    name: "Creatina Pura 500g Dark Lab",
    url: "https://www.mercadolivre.com.br/creatina-monohidratada-pura-500g-dark-lab-unidade/p/MLB26796581",
  },
  {
    name: "100% Whey Max Titanium 900g",
    url: "https://www.mercadolivre.com.br/100-whey-max-titanium-proteinas-proteinas-sabor-baunilha-x-900g-pote/p/MLB18418074",
  },
  {
    name: "Creatina Monohidratada 300g",
    url: "https://www.mercadolivre.com.br/creatina-100-pura-300g-integralmedica-forca-e-performance/p/MLB6204289",
  },
  {
    name: "Whey Gourmet 800g",
    url: "https://produto.mercadolivre.com.br/MLB-5563352278-whey-protein-gourmet-concentrado-chef-whey-800g-_JM",
  },
  {
    name: "Pré-Treino Core 150g",
    url: "https://www.mercadolivre.com.br/pre-treino-core-150g-growth-supplements/up/MLBU3977269801",
  },
]

async function main() {
  let updated = 0
  let notFound = 0

  for (const product of productLinks) {
    const affiliateLink = `${product.url}?${AFFILIATE_PARAMS}`

    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    })

    if (!existing) {
      console.warn(`Produto não encontrado: ${product.name}`)
      notFound++
      continue
    }

    await prisma.product.update({
      where: { id: existing.id },
      data: {
        url: product.url,
        affiliateLink,
      },
    })

    console.log(`✓ ${product.name}`)
    updated++
  }

  console.log(`\n${updated} produtos atualizados com links de afiliado.`)
  if (notFound > 0) {
    console.warn(`${notFound} produtos não encontrados no banco.`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
