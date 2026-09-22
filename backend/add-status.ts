import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dropped = await prisma.status.findFirst({ where: { name: 'DROPPED' } });
  if (!dropped) {
    await prisma.status.create({ data: { name: 'DROPPED' } });
    console.log('DROPPED status added successfully.');
  } else {
    console.log('DROPPED status already exists.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
