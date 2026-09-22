import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MasterService {
  constructor(private prisma: PrismaService) {}

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

  async getUserRole(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });
    return user?.role?.name;
  }

  async createUser(data: any) {
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

  async updateUser(id: string, data: any) {
    const updateData: any = { ...data };
    if (updateData.roleId) updateData.roleId = Number(updateData.roleId);
    if (typeof updateData.password === 'string' && updateData.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getRoles() {
    return this.prisma.role.findMany({ orderBy: { id: 'asc' } });
  }

  async createRole(data: any) {
    return this.prisma.role.create({ data });
  }

  async updateRole(id: number, data: any) {
    return this.prisma.role.update({ where: { id }, data });
  }

  async deleteRole(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }

  async createStatus(data: any) {
    return this.prisma.status.create({ data });
  }

  async updateStatus(id: number, data: any) {
    return this.prisma.status.update({ where: { id }, data });
  }

  async deleteStatus(id: number) {
    return this.prisma.status.delete({ where: { id } });
  }
}
