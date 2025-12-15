import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Hash Password (passwordnya: 123456)
  const password = await bcrypt.hash('123456', 10)

  // 2. Buat Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@laundry.com' },
    update: {},
    create: {
      email: 'admin@laundry.com',
      name: 'Super Admin',
      password: password,
      role: 'ADMIN', // Ingat, kita pakai String sekarang
      phone: '081234567890'
    },
  })

  // 3. Buat Customer Dummy
  const customer = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      name: 'Customer',
      password: password,
      role: 'CUSTOMER',
      phone: '089876543210'
    },
  })

  // 4. Buat Beberapa Mesin Dummy
  await prisma.machine.createMany({
    data: [
      { name: 'Washer A1', type: 'Washer', capacity: 10, status: 'AVAILABLE' },
      { name: 'Washer A2', type: 'Washer', capacity: 10, status: 'BUSY' },
      { name: 'Dryer B1', type: 'Dryer', capacity: 8, status: 'AVAILABLE' },
    ]
  })

  console.log({ admin, customer })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })