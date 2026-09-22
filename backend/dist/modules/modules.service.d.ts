import { PrismaService } from '../prisma/prisma.service.js';
export declare class ModulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        code: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        testcaseCount: number;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        metadata: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            testcaseCount: number;
        }[];
    }>;
    findOne(id: string): Promise<{
        testcases: ({
            createdBy: {
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            moduleId: string;
            testcaseId: string;
            title: string;
            description: string | null;
            precondition: string | null;
            expectedResult: string | null;
            sequence: number;
            priority: string;
            createdById: string | null;
            updatedById: string | null;
            isDeleted: boolean;
            deletedAt: Date | null;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        testcaseCount: number;
    }>;
    update(id: string, data: {
        name?: string;
        code?: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        testcaseCount: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        testcaseCount: number;
    }>;
}
