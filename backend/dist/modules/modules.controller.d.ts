import { ModulesService } from './modules.service.js';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    create(req: any, createModuleDto: any): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            testcaseCount: number;
        };
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            testcaseCount: number;
        }[];
        metadata: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        data: {
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
        };
    }>;
    update(req: any, id: string, updateModuleDto: any): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            testcaseCount: number;
        };
    }>;
    remove(req: any, id: string): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            testcaseCount: number;
        };
    }>;
}
