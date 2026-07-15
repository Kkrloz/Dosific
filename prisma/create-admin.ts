import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] ?? "admin@dosific.app"
  const passwordRaw = process.argv[3] ?? "admin123"

  if (passwordRaw.length < 8) {
    console.error("Senha deve ter no mínimo 8 caracteres")
    process.exit(1)
  }

  const password = await bcrypt.hash(passwordRaw, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      name: "Admin",
      email,
      password,
      role: "ADMIN",
    },
  })

  console.log(`✓ Admin: ${user.email} (${user.role})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
