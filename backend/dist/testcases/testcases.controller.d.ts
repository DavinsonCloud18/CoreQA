import { TestcasesService } from './testcases.service.js';
export declare class TestcasesController {
    private readonly testcasesService;
    constructor(testcasesService: TestcasesService);
    create(req: any, createTestcaseDto: any): Promise<{
        data: {
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
        };
    }>;
    findAll(query: any): Promise<{
        data: ({
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
        })[];
    }>;
    getNotifications(req: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            testcaseId: string;
            userId: string;
            message: string;
            isRead: boolean;
        }[];
    }>;
    markNotificationRead(id: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            testcaseId: string;
            userId: string;
            message: string;
            isRead: boolean;
        };
    }>;
    findOne(id: string): Promise<{
        data: {
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
        };
    }>;
    update(req: any, id: string, updateTestcaseDto: any): Promise<{
        data: {
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
        };
    }>;
    remove(req: any, id: string): Promise<{
        data: {
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
        };
    }>;
    revive(req: any, id: string): Promise<{
        data: {
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
        };
    }>;
}
