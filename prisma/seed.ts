import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Whey Protein",
  "Creatina",
  "Café",
  "Ração",
  "Pré-treino",
  "Vitaminas",
  "Outros",
];

async function main() {
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
