const fs = require('fs');

const svcFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/trash/trash.service.ts';
let svcContent = fs.readFileSync(svcFile, 'utf8');

const permDelete = `
  async permanentlyDelete(type: string, ids: string[]) {
    if (!ids || ids.length === 0) return { count: 0 };
    
    if (type === 'users') {
      return this.prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    if (type === 'modules') {
      return this.prisma.$transaction(async (tx) => {
        await tx.sessionModule.deleteMany({ where: { moduleId: { in: ids } } });
        await tx.claimHistory.deleteMany({ where: { moduleId: { in: ids } } });
        const testcases = await tx.masterTestcase.findMany({ where: { moduleId: { in: ids } } });
        const tcIds = testcases.map((t: any) => t.id);
        if (tcIds.length > 0) {
           await tx.sessionExecution.deleteMany({ where: { testcaseId: { in: tcIds } } });
           await tx.masterTestcase.deleteMany({ where: { id: { in: tcIds } } });
        }
        return tx.module.deleteMany({ where: { id: { in: ids } } });
      });
    }
    if (type === 'sessions') {
      return this.prisma.$transaction(async (tx) => {
        await tx.sessionExecution.deleteMany({ where: { sessionId: { in: ids } } });
        await tx.claimHistory.deleteMany({ where: { sessionId: { in: ids } } });
        await tx.sessionModule.deleteMany({ where: { sessionId: { in: ids } } });
        return tx.session.deleteMany({ where: { id: { in: ids } } });
      });
    }
    if (type === 'testcases') {
      return this.prisma.$transaction(async (tx) => {
        await tx.sessionExecution.deleteMany({ where: { testcaseId: { in: ids } } });
        return tx.masterTestcase.deleteMany({ where: { id: { in: ids } } });
      });
    }
    throw new BadRequestException('Invalid type');
  }
`;

svcContent = svcContent.replace('export class TrashService {', 'export class TrashService {' + permDelete);
fs.writeFileSync(svcFile, svcContent, 'utf8');

const ctrlFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/trash/trash.controller.ts';
let ctrlContent = fs.readFileSync(ctrlFile, 'utf8');

const endpoint = `
  @Put('delete-permanent')
  async permanentlyDelete(@Body() body: { type: string, ids: string[] }) {
    const data = await this.trashService.permanentlyDelete(body.type, body.ids);
    return { message: 'Data permanently deleted', data };
  }
`;

ctrlContent = ctrlContent.replace('export class TrashController {', 'export class TrashController {' + endpoint);
fs.writeFileSync(ctrlFile, ctrlContent, 'utf8');

console.log('Backend Updated');
