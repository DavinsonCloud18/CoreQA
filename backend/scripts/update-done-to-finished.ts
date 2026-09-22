import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.session.updateMany({
    where: { status: 'Done' },
    data: { status: 'Finished' },
  });
  
  console.log(`Updated ${result.count} sessions from 'Done' to 'Finished'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
