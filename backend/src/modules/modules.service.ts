import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string, code: string, description?: string }) {
    return this.prisma.module.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
      }
    });
  }

  async findAll(query: { page?: number, limit?: number, search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
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

  async findOne(id: string) {
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
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  async update(id: string, data: { name?: string, code?: string, description?: string }) {
    return this.prisma.module.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.module.delete({
      where: { id }
    });
  }
}
