import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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
}
