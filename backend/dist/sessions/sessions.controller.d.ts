import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    createSession(dto: CreateSessionDto): Promise<{
        message: string;
        data: any;
    }>;
    getSessions(): Promise<{
        data: ({
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
        })[];
    }>;
    getSessionModules(sessionId: string): Promise<{
        data: {
            id: any;
            name: any;
            description: any;
            testcaseCount: any;
            claimedBy: string | null;
            claimedById: string | null;
            isClaimed: boolean;
            statusBreakdown: Record<string, number>;
        }[];
    }>;
    updateSessionStatus(sessionId: string, status: string): Promise<{
        message: string;
        data: {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            environmentId: number;
            isOpen: boolean;
            startDate: Date;
            endDate: Date | null;
        };
    }>;
}
