const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/analytics/analytics.service.ts';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `    // Group by user
    const userAssignmentsMap = new Map();
    claimHistories.forEach(ch => {
      const userId = ch.claimedBy.id;
      if (!userAssignmentsMap.has(userId)) {
        userAssignmentsMap.set(userId, {
          user: ch.claimedBy,
          modules: []
        });
      }
      userAssignmentsMap.get(userId).modules.push({
        module: ch.module,
        session: ch.session
      });
    });`;

const newLogic = `    // Fetch executions to get status breakdown per module
    const sessionExecutions = await this.prisma.sessionExecution.findMany({
      where: { ...whereClause, testcase: { isDeleted: false } },
      include: {
        status: { select: { name: true } },
        testcase: { select: { moduleId: true } }
      }
    });

    const moduleStats = new Map();
    sessionExecutions.forEach(se => {
      const key = \`\${se.sessionId}_\${se.testcase.moduleId}\`;
      if (!moduleStats.has(key)) moduleStats.set(key, {});
      const stats = moduleStats.get(key);
      const sName = se.status.name;
      stats[sName] = (stats[sName] || 0) + 1;
    });

    // Group by user
    const userAssignmentsMap = new Map();
    claimHistories.forEach(ch => {
      const userId = ch.claimedBy.id;
      if (!userAssignmentsMap.has(userId)) {
        userAssignmentsMap.set(userId, {
          user: ch.claimedBy,
          modules: []
        });
      }
      userAssignmentsMap.get(userId).modules.push({
        module: ch.module,
        session: ch.session,
        stats: moduleStats.get(\`\${ch.sessionId}_\${ch.moduleId}\`) || {}
      });
    });`;

content = content.replace(oldLogic, newLogic);

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
