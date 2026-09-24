const fs = require('fs');

// 1. Update DTO
const dtoFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.dto.ts';
let dtoContent = fs.readFileSync(dtoFile, 'utf8');
if (!dtoContent.includes('UpdateSessionDto')) {
  dtoContent += `\nexport class UpdateSessionDto {
  name?: string;
  environmentId?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  moduleIds?: string[];
  assignments?: Record<string, string>;
}\n`;
  fs.writeFileSync(dtoFile, dtoContent, 'utf8');
}

// 2. Update Controller
const ctrlFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.controller.ts';
let ctrlContent = fs.readFileSync(ctrlFile, 'utf8');
if (!ctrlContent.includes('updateSession(')) {
  const patchCode = `
  @Patch(':id')
  async updateSession(
    @Param('id') id: string,
    @Body() dto: any
  ) {
    const data = await this.sessionsService.updateSession(id, dto);
    return { message: 'Session updated successfully', data };
  }
`;
  ctrlContent = ctrlContent.replace(/}\s*$/, patchCode + '}\n');
  fs.writeFileSync(ctrlFile, ctrlContent, 'utf8');
}

// 3. Update Service
const svcFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.service.ts';
let svcContent = fs.readFileSync(svcFile, 'utf8');
if (!svcContent.includes('async updateSession(')) {
  const svcCode = `
  async updateSession(id: string, dto: any) {
    const defaultStatus = await this.prisma.status.findFirst({
      where: { name: 'TO DO' }
    });
    const fallbackStatus = await this.prisma.status.findFirst({
      where: { name: 'UNTESTED' }
    });
    const initialStatusId = defaultStatus?.id || fallbackStatus?.id;

    return this.prisma.$transaction(async (tx: any) => {
      const updateData: any = {};
      if (dto.name) updateData.name = dto.name;
      if (dto.environmentId) updateData.environmentId = Number(dto.environmentId);
      if (dto.startDate) updateData.startDate = new Date(dto.startDate);
      if (dto.endDate !== undefined) updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;

      const session = await tx.session.update({
        where: { id },
        data: updateData
      });

      if (dto.moduleIds) {
        const existingModules = await tx.sessionModule.findMany({ where: { sessionId: id } });
        const existingModuleIds = existingModules.map((m: any) => m.moduleId);
        
        const toRemove = existingModuleIds.filter((mid: string) => !dto.moduleIds.includes(mid));
        const toAdd = dto.moduleIds.filter((mid: string) => !existingModuleIds.includes(mid));

        if (toRemove.length > 0) {
          await tx.sessionModule.deleteMany({ where: { sessionId: id, moduleId: { in: toRemove } } });
          const testcasesToRemove = await tx.masterTestcase.findMany({ where: { moduleId: { in: toRemove } } });
          const tcIds = testcasesToRemove.map((tc: any) => tc.id);
          if (tcIds.length > 0) {
            await tx.sessionExecution.deleteMany({ where: { sessionId: id, testcaseId: { in: tcIds } } });
          }
          await tx.claimHistory.deleteMany({ where: { sessionId: id, moduleId: { in: toRemove } } });
        }

        if (toAdd.length > 0) {
          const newSessionModules = toAdd.map((moduleId: string) => ({ sessionId: id, moduleId }));
          await tx.sessionModule.createMany({ data: newSessionModules });
          const testcasesToAdd = await tx.masterTestcase.findMany({ where: { moduleId: { in: toAdd }, isDeleted: false } });
          if (testcasesToAdd.length > 0 && initialStatusId) {
            const executionsToAdd = testcasesToAdd.map((tc: any) => ({
              sessionId: id,
              testcaseId: tc.id,
              statusId: initialStatusId
            }));
            await tx.sessionExecution.createMany({ data: executionsToAdd });
          }
        }
      }
      
      // Update assignments for existing and new modules
      if (dto.assignments) {
        for (const [moduleId, userId] of Object.entries(dto.assignments)) {
          // Find existing active claim
          const existingClaim = await tx.claimHistory.findFirst({
            where: { sessionId: id, moduleId, isActive: true }
          });
          
          if (userId) {
            if (!existingClaim || existingClaim.claimedById !== userId) {
               if (existingClaim) {
                 await tx.claimHistory.update({ where: { id: existingClaim.id }, data: { isActive: false } });
               }
               await tx.claimHistory.create({
                 data: { sessionId: id, moduleId, claimedById: userId, isActive: true }
               });
            }
          } else {
             if (existingClaim) {
               await tx.claimHistory.update({ where: { id: existingClaim.id }, data: { isActive: false } });
             }
          }
        }
      }

      return session;
    });
  }
`;
  svcContent = svcContent.replace(/async getSessions\(\) \{/, svcCode + '\n  async getSessions() {');
  fs.writeFileSync(svcFile, svcContent, 'utf8');
}

console.log('Backend update session implemented');
