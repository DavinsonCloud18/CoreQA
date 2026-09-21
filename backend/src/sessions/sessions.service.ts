import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './sessions.dto.js';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(dto: CreateSessionDto) {
    const defaultStatus = await this.prisma.status.findFirst({
      where: { name: 'TO DO' }
    });

    // Fallback if 'TO DO' doesn't exist, try 'UNTESTED'
    const fallbackStatus = await this.prisma.status.findFirst({
      where: { name: 'UNTESTED' }
    });

    const initialStatusId = defaultStatus?.id || fallbackStatus?.id;
    if (!initialStatusId) {
      throw new NotFoundException('Default execution status not found in database');
    }

    return this.prisma.$transaction(async (tx: any) => {
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
          const executions = testcases.map((tc: any) => ({
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

  async getSessionModules(sessionId: string) {
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

    return sessionModules.map((sm: any) => {
      const { module } = sm;
      const claim = claims.find((c: any) => c.moduleId === module.id);
      
      const moduleExecutions = executions.filter(e => e.testcase.moduleId === module.id);
      const statusBreakdown: Record<string, number> = {};
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
}
