import { AnalyticsService } from './analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getGlobalAnalytics(sessionId?: string): Promise<{
        message: string;
        data: {
            summary: {
                total: number;
            };
            userAssignments: any[];
        };
    }>;
    getAnalytics(sessionId: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
