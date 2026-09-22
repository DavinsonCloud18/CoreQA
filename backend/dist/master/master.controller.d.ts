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
    createStatus(data: any): Promise<{
        data: {
            id: number;
            name: string;
        };
    }>;
    updateStatus(id: string, data: any): Promise<{
        data: {
            id: number;
            name: string;
        };
    }>;
    deleteStatus(id: string): Promise<{
        data: {
            id: number;
            name: string;
        };
    }>;
    getModules(): Promise<{
        data: {
            testcaseCount: number;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
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
    createUser(data: any, req: any): Promise<{
        data: {
            email: string;
            password: string;
            id: string;
            name: string;
            roleId: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateUser(id: string, data: any, req: any): Promise<{
        data: {
            email: string;
            password: string;
            id: string;
            name: string;
            roleId: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    deleteUser(id: string, req: any): Promise<{
        data: {
            email: string;
            password: string;
            id: string;
            name: string;
            roleId: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getRoles(): Promise<{
        data: {
            id: number;
            name: string;
        }[];
    }>;
    createRole(data: any): Promise<{
        data: {
            id: number;
            name: string;
        };
    }>;
    updateRole(id: string, data: any): Promise<{
        data: {
            id: number;
            name: string;
        };
    }>;
    deleteRole(id: string): Promise<{
        data: {
            id: number;
            name: string;
        };
    }>;
}
