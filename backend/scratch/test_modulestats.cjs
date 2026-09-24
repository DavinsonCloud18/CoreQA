const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const claimHistories = await prisma.claimHistory.findMany({ include: { module: true, session: true } });
  const sessionExecutions = await prisma.sessionExecution.findMany({ include: { status: true, testcase: true } });
  const moduleStats = new Map();
  sessionExecutions.forEach(se => {
    const key = `${se.sessionId}_${se.testcase.moduleId}`;
    if (!moduleStats.has(key)) moduleStats.set(key, {});
    const stats = moduleStats.get(key);
    stats[se.status.name] = (stats[se.status.name] || 0) + 1;
  });
  console.log('ModuleStats keys:', Array.from(moduleStats.keys()));
  claimHistories.forEach(ch => {
    const key = `${ch.sessionId}_${ch.moduleId}`;
    console.log('Claim key:', key, 'Stats:', moduleStats.get(key));
  });
}
run();
