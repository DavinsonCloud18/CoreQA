import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'lead@coreqa.com';
  const plainPassword = 'CoreQA_2026!Sec';
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!user) {
    console.log(`User ${email} NOT FOUND.`);
    return;
  }

  console.log(`User found: ${user.email} (Role: ${user.role?.name})`);
  const isMatch = await bcrypt.compare(plainPassword, user.password);
  console.log(`Password matches: ${isMatch}`);
  console.log(`Is Active: ${user.isActive}`);
  console.log(`Is Deleted: ${user.isDeleted}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
