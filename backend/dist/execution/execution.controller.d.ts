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
                    claimHistories: {
                        id: string;
                        isActive: boolean;
                        moduleId: string;
                        sessionId: string;
                        claimedById: string;
                        claimedAt: Date;
                    }[];
                } & {
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
