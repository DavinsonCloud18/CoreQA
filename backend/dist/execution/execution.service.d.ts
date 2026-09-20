import { PrismaService } from '../prisma/prisma.service.js';
import { GetTestcasesQueryDto, UpdateExecutionStatusDto } from './execution.dto.js';
export declare class ExecutionService {
    private prisma;
    constructor(prisma: PrismaService);
    getSessionExecutions(sessionId: string, query: GetTestcasesQueryDto): Promise<{
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
    claimModule(sessionId: string, moduleId: string, userId: string): Promise<any>;
    updateExecutionStatus(sessionId: string, testcaseId: string, userId: string, dto: UpdateExecutionStatusDto): Promise<{
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
    }>;
}
