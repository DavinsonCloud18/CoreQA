import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.environment.findUnique({
    where: { name: 'DEV' }
  });
  if (!existing) {
    await prisma.environment.create({
      data: { name: 'DEV', description: 'Development Environment' }
    });
    console.log('DEV environment added.');
  } else {
    console.log('DEV environment already exists.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
