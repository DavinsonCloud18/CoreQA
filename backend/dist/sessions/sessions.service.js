var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let SessionsService = class SessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(dto) {
        const defaultStatus = await this.prisma.status.findFirst({
            where: { name: 'TO DO' }
        });
        const fallbackStatus = await this.prisma.status.findFirst({
            where: { name: 'UNTESTED' }
        });
        const initialStatusId = defaultStatus?.id || fallbackStatus?.id;
        if (!initialStatusId) {
            throw new NotFoundException('Default execution status not found in database');
        }
        return this.prisma.$transaction(async (tx) => {
            const session = await tx.session.create({
                data: {
                    name: dto.name,
                    environmentId: Number(dto.environmentId),
                    status: 'TO DO',
                }
            });
            if (dto.moduleIds && dto.moduleIds.length > 0) {
                const sessionModules = dto.moduleIds.map(moduleId => ({
                    sessionId: session.id,
                    moduleId
                }));
                await tx.sessionModule.createMany({ data: sessionModules });
                const testcases = await tx.masterTestcase.findMany({
                    where: { moduleId: { in: dto.moduleIds } }
                });
                if (testcases.length > 0) {
                    const executions = testcases.map((tc) => ({
                        sessionId: session.id,
                        testcaseId: tc.id,
                        statusId: initialStatusId,
                    }));
                    await tx.sessionExecution.createMany({ data: executions });
                }
            }
            return session;
        });
    }
    async getSessions() {
        return this.prisma.session.findMany({
            include: {
                environment: true,
                _count: {
                    select: { sessionModules: true, executions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getSessionModules(sessionId) {
        const sessionModules = await this.prisma.sessionModule.findMany({
            where: { sessionId },
            include: {
                module: {
                    include: {
                        _count: {
                            select: { testcases: true }
                        }
                    }
                }
            }
        });
        const claims = await this.prisma.claimHistory.findMany({
            where: { sessionId, isActive: true },
            include: { claimedBy: true }
        });
        const executions = await this.prisma.sessionExecution.findMany({
            where: { sessionId },
            include: { testcase: true, status: true }
        });
        return sessionModules.map((sm) => {
            const { module } = sm;
            const claim = claims.find((c) => c.moduleId === module.id);
            const moduleExecutions = executions.filter(e => e.testcase.moduleId === module.id);
            const statusBreakdown = {};
            moduleExecutions.forEach(e => {
                const sName = e.status.name;
                statusBreakdown[sName] = (statusBreakdown[sName] || 0) + 1;
            });
            return {
                id: module.id,
                name: module.name,
                description: module.description,
                testcaseCount: module._count.testcases,
                claimedBy: claim ? claim.claimedBy.name : null,
                claimedById: claim ? claim.claimedById : null,
                isClaimed: !!claim,
                statusBreakdown
            };
        });
    }
};
SessionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SessionsService);
export { SessionsService };
//# sourceMappingURL=sessions.service.js.map