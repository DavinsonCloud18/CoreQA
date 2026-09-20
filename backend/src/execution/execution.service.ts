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
          testcase: true,
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

    if (targetStatus.name === 'PASSED WITH NOTES' && (!dto.notes || dto.notes.trim() === '')) {
      throw new BadRequestException('Notes wajib diisi untuk status PASSED WITH NOTES.');
    }

    return await this.prisma.sessionExecution.upsert({
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
  }
}
