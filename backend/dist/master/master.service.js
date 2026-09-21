var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let MasterService = class MasterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEnvironments() {
        return this.prisma.environment.findMany();
    }
    async getStatuses() {
        return this.prisma.status.findMany();
    }
    async getModules() {
        const modules = await this.prisma.module.findMany({
            include: {
                _count: {
                    select: { testcases: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return modules.map(m => {
            const { _count, ...rest } = m;
            return {
                ...rest,
                testcaseCount: _count.testcases,
            };
        });
    }
    async getUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                role: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: { claimHistories: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }
};
MasterService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], MasterService);
export { MasterService };
//# sourceMappingURL=master.service.js.map