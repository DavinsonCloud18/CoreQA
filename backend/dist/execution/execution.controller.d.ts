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
            session: {
                name: string;
            };
            testcase: {
                module: {
                    name: string;
                    code: string;
                };
                steps: {
                    id: string;
                    testcaseId: string;
                    sequence: number;
                    expectedResult: string;
                    action: string;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                moduleId: string;
                description: string | null;
                sequence: number;
                title: string;
                expectedResult: string | null;
            };
            executedBy: {
                id: string;
                name: string;
            } | null;
            stepExecutions: ({
                status: {
                    id: number;
                    name: string;
                };
            } & {
                id: string;
                updatedAt: Date;
                statusId: number;
                notes: string | null;
                sessionExecutionId: string;
                stepId: string;
            })[];
        } & {
            id: string;
            updatedAt: Date;
            statusId: number;
            notes: string | null;
            sessionId: string;
            testcaseId: string;
            executedById: string | null;
            executedAt: Date;
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
            id: string;
            updatedAt: Date;
            statusId: number;
            notes: string | null;
            sessionId: string;
            testcaseId: string;
            executedById: string | null;
            executedAt: Date;
        };
    }>;
    updateStepStatus(sessionId: string, testcaseId: string, stepId: string, dto: UpdateExecutionStatusDto, userId: string): Promise<{
        message: string;
        data: {
            status: {
                id: number;
                name: string;
            };
        } & {
            id: string;
            updatedAt: Date;
            statusId: number;
            notes: string | null;
            sessionExecutionId: string;
            stepId: string;
        };
    }>;
}
