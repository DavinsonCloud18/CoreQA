import { ExecutionService } from './execution.service.js';
import { GetTestcasesQueryDto, UpdateExecutionStatusDto } from './execution.dto.js';
export declare class ExecutionController {
    private readonly executionService;
    constructor(executionService: ExecutionService);
    getExecutions(sessionId: string, query: GetTestcasesQueryDto): Promise<{
        metadata: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: ({
            status: {
                id: number;
                name: string;
            };
            testcase: {
                moduleId: string;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                sequence: number;
                title: string;
                description: string | null;
                expectedResult: string | null;
            };
            executedBy: {
                id: string;
                name: string;
            } | null;
        } & {
            statusId: number;
            notes: string | null;
            id: string;
            sessionId: string;
            testcaseId: string;
            executedById: string | null;
            executedAt: Date;
            updatedAt: Date;
        })[];
    }>;
    claimModule(sessionId: string, moduleId: string, userId: string): Promise<{
        message: string;
        data: any;
    }>;
    updateStatus(sessionId: string, testcaseId: string, dto: UpdateExecutionStatusDto, userId: string): Promise<{
        message: string;
        data: {
            status: {
                id: number;
                name: string;
            };
        } & {
            statusId: number;
            notes: string | null;
            id: string;
            sessionId: string;
            testcaseId: string;
            executedById: string | null;
            executedAt: Date;
            updatedAt: Date;
        };
    }>;
}
