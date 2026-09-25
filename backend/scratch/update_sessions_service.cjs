const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.service.ts';
let content = fs.readFileSync(file, 'utf8');

const logicToInject = `
  async cloneSession(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        sessionModules: true,
        claims: { where: { isActive: true } }
      }
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const defaultStatus = await this.prisma.status.findFirst({ where: { name: 'TO DO' } });
    const fallbackStatus = await this.prisma.status.findFirst({ where: { name: 'UNTESTED' } });
    const initialStatusId = defaultStatus?.id || fallbackStatus?.id;
    if (!initialStatusId) {
      throw new NotFoundException('Default execution status not found in database');
    }

    return this.prisma.$transaction(async (tx: any) => {
      const clonedSession = await tx.session.create({
        data: {
          name: session.name + ' (Clone)',
          environmentId: session.environmentId,
          status: 'TO DO',
          startDate: new Date(),
          endDate: session.endDate,
        }
      });

      if (session.sessionModules.length > 0) {
        const moduleIds = session.sessionModules.map(sm => sm.moduleId);
        const newSessionModules = moduleIds.map(moduleId => ({
          sessionId: clonedSession.id,
          moduleId
        }));
        await tx.sessionModule.createMany({ data: newSessionModules });

        const testcases = await tx.masterTestcase.findMany({
          where: { 
            moduleId: { in: moduleIds },
            isDeleted: false
          }
        });

        if (testcases.length > 0) {
          const executions = testcases.map((tc: any) => ({
            sessionId: clonedSession.id,
            testcaseId: tc.id,
            statusId: initialStatusId,
          }));
          await tx.sessionExecution.createMany({ data: executions });
        }

        if (session.claims.length > 0) {
          const claims = session.claims.map(claim => ({
            sessionId: clonedSession.id,
            moduleId: claim.moduleId,
            claimedById: claim.claimedById,
            isActive: true,
          }));
          await tx.claimHistory.createMany({ data: claims });
        }
      }

      return clonedSession;
    });
  }
`;

const insertPoint = content.indexOf('async updateSession');
if (insertPoint === -1) {
    console.error('Could not find async updateSession');
    process.exit(1);
}
content = content.slice(0, insertPoint) + logicToInject + '\n  ' + content.slice(insertPoint);

fs.writeFileSync(file, content, 'utf8');
console.log('sessions.service.ts updated');
