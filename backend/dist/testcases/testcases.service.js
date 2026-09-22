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
let TestcasesService = class TestcasesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const module = await this.prisma.module.findUnique({ where: { id: data.moduleId } });
        if (!module)
            throw new NotFoundException('Module not found');
        const newCount = module.testcaseCount + 1;
        await this.prisma.module.update({
            where: { id: module.id },
            data: { testcaseCount: newCount }
        });
        const paddedCount = String(newCount).padStart(3, '0');
        const testcaseIdStr = `${module.code}-${paddedCount}`;
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
    async findAll(filters) {
        const where = {};
        if (filters.moduleId)
            where.moduleId = filters.moduleId;
        if (filters.createdById)
            where.createdById = filters.createdById;
        if (filters.isDeleted !== undefined)
            where.isDeleted = filters.isDeleted === 'true';
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
    async findOne(id) {
        const tc = await this.prisma.masterTestcase.findUnique({
            where: { id },
            include: {
                steps: { orderBy: { sequence: 'asc' } },
                module: true,
            }
        });
        if (!tc)
            throw new NotFoundException('Testcase not found');
        return tc;
    }
    async update(userId, id, data) {
        const existing = await this.prisma.masterTestcase.findUnique({ where: { id } });
        if (!existing)
            throw new NotFoundException('Testcase not found');
        if (existing.createdById && existing.createdById !== userId) {
            await this.prisma.testcaseNotification.create({
                data: {
                    testcaseId: id,
                    userId: existing.createdById,
                    message: `Your testcase "${existing.testcaseId}" was updated.`,
                }
            });
        }
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
    async remove(userId, userRole, id) {
        const existing = await this.prisma.masterTestcase.findUnique({ where: { id } });
        if (!existing)
            throw new NotFoundException('Testcase not found');
        if (userRole === 'Admin' || userRole === 'Leader') {
            return this.prisma.masterTestcase.delete({ where: { id } });
        }
        else {
            return this.prisma.masterTestcase.update({
                where: { id },
                data: { isDeleted: true, deletedAt: new Date() }
            });
        }
    }
    async revive(userId, id) {
        return this.prisma.masterTestcase.update({
            where: { id },
            data: { isDeleted: false, deletedAt: null }
        });
    }
    async getNotifications(userId) {
        return this.prisma.testcaseNotification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async markNotificationRead(id) {
        return this.prisma.testcaseNotification.update({
            where: { id },
            data: { isRead: true }
        });
    }
};
TestcasesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TestcasesService);
export { TestcasesService };
//# sourceMappingURL=testcases.service.js.map