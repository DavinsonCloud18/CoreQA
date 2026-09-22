import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TestcasesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    // 1. Get module to increment testcaseCount
    const module = await this.prisma.module.findUnique({ where: { id: data.moduleId } });
    if (!module) throw new NotFoundException('Module not found');

    const newCount = module.testcaseCount + 1;
    await this.prisma.module.update({
      where: { id: module.id },
      data: { testcaseCount: newCount }
    });

    const paddedCount = String(newCount).padStart(3, '0');
    const testcaseIdStr = `${module.code}-${paddedCount}`;

    // 2. Create testcase
    return this.prisma.masterTestcase.create({
      data: {
        testcaseId: testcaseIdStr,
        moduleId: data.moduleId,
        title: data.title,
        description: data.description,
        precondition: data.precondition,
        expectedResult: data.expectedResult,
        priority: data.priority || 'Medium',
        createdById: userId,
        updatedById: userId,
        steps: {
          create: data.steps || []
        }
      }
    });
  }

  async findAll(filters: any) {
    const where: any = {};
    if (filters.moduleId) where.moduleId = filters.moduleId;
    if (filters.createdById) where.createdById = filters.createdById;
    if (filters.isDeleted !== undefined) where.isDeleted = filters.isDeleted === 'true';

    return this.prisma.masterTestcase.findMany({
      where,
      orderBy: { sequence: 'asc' },
      include: {
        module: { select: { name: true, code: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      }
    });
  }

  async findOne(id: string) {
    const tc = await this.prisma.masterTestcase.findUnique({
      where: { id },
      include: {
        steps: { orderBy: { sequence: 'asc' } },
        module: true,
      }
    });
    if (!tc) throw new NotFoundException('Testcase not found');
    return tc;
  }

  async update(userId: string, id: string, data: any) {
    const existing = await this.prisma.masterTestcase.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Testcase not found');

    // Notification if someone else updates
    if (existing.createdById && existing.createdById !== userId) {
      await this.prisma.testcaseNotification.create({
        data: {
          testcaseId: id,
          userId: existing.createdById,
          message: `Your testcase "${existing.testcaseId}" was updated.`,
        }
      });
    }

    // Delete old steps and recreate
    if (data.steps) {
      await this.prisma.testcaseStep.deleteMany({ where: { testcaseId: id } });
    }

    return this.prisma.masterTestcase.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        precondition: data.precondition,
        expectedResult: data.expectedResult,
        priority: data.priority,
        updatedById: userId,
        ...(data.steps ? { steps: { create: data.steps } } : {})
      }
    });
  }

  async remove(userId: string, userRole: string, id: string) {
    const existing = await this.prisma.masterTestcase.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Testcase not found');

    if (userRole === 'Admin' || userRole === 'Leader') {
      // Hard delete
      return this.prisma.masterTestcase.delete({ where: { id } });
    } else {
      // Soft delete
      return this.prisma.masterTestcase.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() }
      });
    }
  }

  async revive(userId: string, id: string) {
    return this.prisma.masterTestcase.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null }
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.testcaseNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markNotificationRead(id: string) {
    return this.prisma.testcaseNotification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}
