import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  console.log('Menghapus data lama...');
  await prisma.sessionExecution.deleteMany();
  await prisma.sessionModule.deleteMany();
  await prisma.session.deleteMany();
  await prisma.masterTestcase.deleteMany();
  await prisma.module.deleteMany();
  await prisma.status.deleteMany();
  await prisma.environment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('Menyemai (Seeding) data baru...');

  // 1. Roles
  const roleLeader = await prisma.role.create({ data: { name: 'Leader' } });
  const roleQA = await prisma.role.create({ data: { name: 'QA Member' } });

  // 2. Users
  const user2 = await prisma.user.create({
    data: { email: 'qa1@coreqa.com', name: 'Alice QA', password: hashedPassword, roleId: roleQA.id },
  });

  // 3. Environment
  const envSIT = await prisma.environment.create({
    data: { name: 'SIT', description: 'System Integration Testing' },
  });

  // 4. Statuses
  const statuses = ['PASSED', 'FAILED', 'PASSED WITH NOTES', 'UNTESTED'];
  const statusRecords: Record<string, any> = {};
  for (const s of statuses) {
    statusRecords[s] = await prisma.status.create({ data: { name: s } });
  }

  // 5. Modules
  const moduleAuth = await prisma.module.create({
    data: { name: 'Authentication Module', description: 'Login and Register flows' },
  });
  const modulePayment = await prisma.module.create({
    data: { name: 'Payment Gateway', description: 'Checkout and Stripe flows' },
  });
  const moduleProfile = await prisma.module.create({
    data: { name: 'User Profile', description: 'Avatar and settings' },
  });

  // 6. Testcases
  for (let i = 1; i <= 20; i++) {
    await prisma.masterTestcase.create({
      data: { moduleId: moduleAuth.id, title: `Auth TC ${i}`, sequence: i },
    });
    await prisma.masterTestcase.create({
      data: { moduleId: modulePayment.id, title: `Payment TC ${i}`, sequence: i },
    });
    await prisma.masterTestcase.create({
      data: { moduleId: moduleProfile.id, title: `Profile TC ${i}`, sequence: i },
    });
  }

  // 7. Session (Fixed UUID agar mudah diakses)
  const SESSION_ID = '123e4567-e89b-12d3-a456-426614174000';
  
  const session = await prisma.session.create({
    data: {
      id: SESSION_ID,
      name: 'Sprint 42 Regression',
      environmentId: envSIT.id,
      isOpen: true,
      sessionModules: {
        create: [
          { moduleId: moduleAuth.id },
          { moduleId: modulePayment.id },
          { moduleId: moduleProfile.id },
        ],
      },
    },
  });

  // 8. Session Executions (Randomized untuk memunculkan variasi di Dashboard)
  const allTestcases = await prisma.masterTestcase.findMany();
  for (const tc of allTestcases) {
    let statusId = statusRecords['UNTESTED'].id;
    
    // Auth: Banyak lulus
    if (tc.moduleId === moduleAuth.id) {
      statusId = Math.random() > 0.15 ? statusRecords['PASSED'].id : statusRecords['FAILED'].id;
    } 
    // Payment: Banyak error!
    else if (tc.moduleId === modulePayment.id) {
      statusId = Math.random() > 0.45 ? statusRecords['FAILED'].id : statusRecords['PASSED WITH NOTES'].id;
    } 
    // Profile: Sempurna
    else {
      statusId = Math.random() > 0.05 ? statusRecords['PASSED'].id : statusRecords['UNTESTED'].id;
    }

    await prisma.sessionExecution.create({
      data: {
        sessionId: session.id,
        testcaseId: tc.id,
        statusId: statusId,
        executedById: user2.id,
        notes: statusId === statusRecords['PASSED WITH NOTES'].id ? 'Slight delay during loading' : null,
      },
    });
  }

  console.log(`\n\n🎉 Seeding berhasil!`);
  console.log(`👉 Silakan buka browser Anda di: http://localhost:3000/dashboard/sessions/${session.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
