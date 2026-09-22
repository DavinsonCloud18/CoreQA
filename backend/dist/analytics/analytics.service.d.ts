import { PrismaService } from '../prisma/prisma.service.js';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getGlobalAnalytics(sessionId?: string): Promise<{
        summary: {
            total: number;
        };
        userAssignments: any[];
    }>;
    getSessionAnalytics(sessionId: string): Promise<{
        session: {
            status: string;
            id: string;
            name: string;
            isOpen: boolean;
        } | null;
        summary: {
            total: number;
        };
        topFailedModules: unknown;
    }>;
}
