import { PrismaService } from '../prisma/prisma.service.js';
export declare class TestcasesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: any): Promise<{
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
    }>;
    findAll(filters: any): Promise<({
        module: {
            name: string;
            code: string;
        };
        createdBy: {
            name: string;
        } | null;
        updatedBy: {
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
    })[]>;
    findOne(id: string): Promise<{
        module: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            testcaseCount: number;
        };
        steps: {
            id: string;
            testcaseId: string;
            expectedResult: string;
            sequence: number;
            action: string;
        }[];
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
    }>;
    update(userId: string, id: string, data: any): Promise<{
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
    }>;
    remove(userId: string, userRole: string, id: string): Promise<{
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
    }>;
    revive(userId: string, id: string): Promise<{
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
    }>;
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        testcaseId: string;
        userId: string;
        message: string;
        isRead: boolean;
    }[]>;
    markNotificationRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        testcaseId: string;
        userId: string;
        message: string;
        isRead: boolean;
    }>;
}
