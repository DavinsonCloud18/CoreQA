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
import * as bcrypt from 'bcrypt';
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
    async getUserRole(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        return user?.role?.name;
    }
    async createUser(data) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                roleId: Number(data.roleId),
                isActive: data.isActive ?? true,
            }
        });
    }
    async updateUser(id, data) {
        const updateData = { ...data };
        if (updateData.roleId)
            updateData.roleId = Number(updateData.roleId);
        if (typeof updateData.password === 'string' && updateData.password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }
        else {
            delete updateData.password;
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async getRoles() {
        return this.prisma.role.findMany({ orderBy: { id: 'asc' } });
    }
    async createRole(data) {
        return this.prisma.role.create({ data });
    }
    async updateRole(id, data) {
        return this.prisma.role.update({ where: { id }, data });
    }
    async deleteRole(id) {
        return this.prisma.role.delete({ where: { id } });
    }
    async createStatus(data) {
        return this.prisma.status.create({ data });
    }
    async updateStatus(id, data) {
        return this.prisma.status.update({ where: { id }, data });
    }
    async deleteStatus(id) {
        return this.prisma.status.delete({ where: { id } });
    }
};
MasterService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], MasterService);
export { MasterService };
//# sourceMappingURL=master.service.js.map