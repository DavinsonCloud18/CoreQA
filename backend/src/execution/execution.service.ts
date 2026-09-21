import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetTestcasesQueryDto, UpdateExecutionStatusDto } from './execution.dto.js';

@Injectable()
export class ExecutionService {
  constructor(private prisma: PrismaService) {}

  async getSessionExecutions(sessionId: string, query: GetTestcasesQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = { sessionId };
    if (query.moduleId) {
      whereClause.testcase = { moduleId: query.moduleId };
    }
    if (query.statusId) {
      whereClause.statusId = query.statusId;
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.sessionExecution.count({ where: whereClause }),
      this.prisma.sessionExecution.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          session: { select: { name: true } },
          testcase: {
            include: { 
              module: { select: { name: true, code: true } },
              steps: { orderBy: { sequence: 'asc' } }
            }
          },
          stepExecutions: {
            include: { status: true }
          },
          status: true,
          executedBy: { select: { id: true, name: true } }
        },
        orderBy: { testcase: { sequence: 'asc' } }
      })
    ]);

    return {
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data,
    };
  }

  async claimModule(sessionId: string, moduleId: string, userId: string) {
    return await this.prisma.$transaction(async (tx: any) => {
      const session = await tx.session.findUnique({ where: { id: sessionId } });
      if (!session || !session.isOpen) {
        throw new BadRequestException('Session tidak valid atau sudah ditutup.');
      }

      // Allow takeover: invalidate any existing active claim
      await tx.claimHistory.updateMany({
        where: { sessionId, moduleId, isActive: true },
        data: { isActive: false }
      });

      return await tx.claimHistory.create({
        data: {
          sessionId,
          moduleId,
          claimedById: userId,
          isActive: true
        }
      });
    });
  }

  async updateExecutionStatus(
    sessionId: string, 
    testcaseId: string, 
    userId: string, 
    dto: UpdateExecutionStatusDto
  ) {
    const targetStatus = await this.prisma.status.findUnique({
      where: { id: dto.statusId }
    });

    if (!targetStatus) throw new NotFoundException('Status tidak ditemukan.');

    const execution = await this.prisma.sessionExecution.upsert({
      where: {
        sessionId_testcaseId: { sessionId, testcaseId }
      },
      update: {
        statusId: dto.statusId,
        notes: dto.notes,
        executedById: userId,
      },
      create: {
        sessionId,
        testcaseId,
        statusId: dto.statusId,
        notes: dto.notes,
        executedById: userId,
      },
      include: { status: true }
    });

    if (targetStatus.name.toUpperCase() === 'PASSED') {
      const testcase = await this.prisma.masterTestcase.findUnique({
        where: { id: testcaseId },
        include: { steps: true }
      });
      
      if (testcase && testcase.steps.length > 0) {
        for (const step of testcase.steps) {
          await this.prisma.sessionStepExecution.upsert({
            where: {
              sessionExecutionId_stepId: {
                sessionExecutionId: execution.id,
                stepId: step.id
              }
            },
            update: { statusId: dto.statusId },
            create: {
              sessionExecutionId: execution.id,
              stepId: step.id,
              statusId: dto.statusId
            }
          });
        }
      }
    }

    return execution;
  }

  async updateStepExecutionStatus(
    sessionId: string,
    testcaseId: string,
    stepId: string,
    userId: string,
    dto: UpdateExecutionStatusDto
  ) {
    const targetStatus = await this.prisma.status.findUnique({
      where: { id: dto.statusId }
    });

    if (!targetStatus) throw new NotFoundException('Status tidak ditemukan.');

    let execution = await this.prisma.sessionExecution.findUnique({
      where: { sessionId_testcaseId: { sessionId, testcaseId } }
    });

    if (!execution) {
      const todoStatus = await this.prisma.status.findFirst({ where: { name: 'TO DO' } });
      execution = await this.prisma.sessionExecution.create({
        data: {
          sessionId,
          testcaseId,
          statusId: todoStatus!.id,
          executedById: userId
        }
      });
    }

    const stepExecution = await this.prisma.sessionStepExecution.upsert({
      where: {
        sessionExecutionId_stepId: {
          sessionExecutionId: execution.id,
          stepId
        }
      },
      update: { statusId: dto.statusId, notes: dto.notes },
      create: {
        sessionExecutionId: execution.id,
        stepId,
        statusId: dto.statusId,
        notes: dto.notes
      },
      include: { status: true }
    });

    if (['FAILED', 'BLOCKED', 'PASSED WITH NOTES'].includes(targetStatus.name.toUpperCase())) {
      await this.prisma.sessionExecution.update({
        where: { id: execution.id },
        data: { 
          statusId: dto.statusId, 
          executedById: userId,
          ...(dto.notes && { notes: dto.notes })
        }
      });
    } else if (targetStatus.name.toUpperCase() === 'PASSED') {
      const testcase = await this.prisma.masterTestcase.findUnique({
        where: { id: testcaseId },
        include: { steps: true }
      });
      
      const allStepExecutions = await this.prisma.sessionStepExecution.findMany({
        where: { sessionExecutionId: execution.id },
        include: { status: true }
      });

      if (testcase && testcase.steps.length > 0 && allStepExecutions.length === testcase.steps.length) {
        const allPassed = allStepExecutions.every(se => se.status.name.toUpperCase() === 'PASSED');
        if (allPassed) {
          await this.prisma.sessionExecution.update({
            where: { id: execution.id },
            data: { statusId: dto.statusId, executedById: userId }
          });
        }
      }
    }

    return stepExecution;
  }
}
