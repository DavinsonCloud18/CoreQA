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
let ModulesService = class ModulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.module.create({
            data: {
                name: data.name,
                code: data.code,
                description: data.description,
            }
        });
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { code: { contains: query.search, mode: 'insensitive' } }
            ];
        }
        const [total, data] = await this.prisma.$transaction([
            this.prisma.module.count({ where }),
            this.prisma.module.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return {
            metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
            data,
        };
    }
    async findOne(id) {
        const module = await this.prisma.module.findUnique({
            where: { id },
            include: {
                testcases: {
                    where: { isDeleted: false },
                    orderBy: { sequence: 'asc' },
                    include: {
                        createdBy: { select: { name: true } }
                    }
                }
            }
        });
        if (!module)
            throw new NotFoundException('Module not found');
        return module;
    }
    async update(id, data) {
        return this.prisma.module.update({
            where: { id },
            data
        });
    }
    async remove(id) {
        return this.prisma.module.delete({
            where: { id }
        });
    }
};
ModulesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ModulesService);
export { ModulesService };
//# sourceMappingURL=modules.service.js.map