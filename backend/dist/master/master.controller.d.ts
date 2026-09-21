import { MasterService } from './master.service.js';
export declare class MasterController {
    private readonly masterService;
    constructor(masterService: MasterService);
    getEnvironments(): Promise<{
        data: {
            id: number;
            name: string;
            description: string | null;
        }[];
    }>;
    getStatuses(): Promise<{
        data: {
            id: number;
            name: string;
        }[];
    }>;
    getModules(): Promise<{
        data: {
            testcaseCount: number;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            description: string | null;
        }[];
    }>;
    getUsers(): Promise<{
        data: {
            role: {
                name: string;
            };
            email: string;
            id: string;
            name: string;
            isActive: boolean;
            _count: {
                claimHistories: number;
            };
        }[];
    }>;
}
