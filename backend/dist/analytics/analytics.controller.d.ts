import { AnalyticsService } from './analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAnalytics(sessionId: string): Promise<{
        message: string;
        data: {
            summary: {
                total: number;
            };
            topFailedModules: unknown;
        };
    }>;
}
