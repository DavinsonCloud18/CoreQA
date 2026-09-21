import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessionDto } from './sessions.dto.js';
export declare class SessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(dto: CreateSessionDto): Promise<any>;
    getSessions(): Promise<({
        environment: {
            id: number;
            name: string;
            description: string | null;
        };
        _count: {
            executions: number;
            sessionModules: number;
        };
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        environmentId: number;
        isOpen: boolean;
        startDate: Date;
        endDate: Date | null;
    })[]>;
    getSessionModules(sessionId: string): Promise<{
        id: any;
        name: any;
        description: any;
        testcaseCount: any;
        claimedBy: string | null;
        claimedById: string | null;
        isClaimed: boolean;
        statusBreakdown: Record<string, number>;
    }[]>;
}
