import { PrismaService } from '../prisma/prisma.service.js';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSessionAnalytics(sessionId: string): Promise<{
        summary: {
            total: number;
        };
        topFailedModules: unknown;
    }>;
}
