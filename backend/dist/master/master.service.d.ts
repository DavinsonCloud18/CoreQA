import { PrismaService } from '../prisma/prisma.service.js';
export declare class MasterService {
    private prisma;
    constructor(prisma: PrismaService);
    getEnvironments(): Promise<{
        id: number;
        name: string;
        description: string | null;
    }[]>;
    getStatuses(): Promise<{
        id: number;
        name: string;
    }[]>;
    getModules(): Promise<{
        testcaseCount: number;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
    }[]>;
    getUsers(): Promise<{
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
    }[]>;
    getUserRole(userId: string): Promise<string | undefined>;
    createUser(data: any): Promise<{
        email: string;
        password: string;
        id: string;
        name: string;
        roleId: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, data: any): Promise<{
        email: string;
        password: string;
        id: string;
        name: string;
        roleId: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        email: string;
        password: string;
        id: string;
        name: string;
        roleId: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRoles(): Promise<{
        id: number;
        name: string;
    }[]>;
    createRole(data: any): Promise<{
        id: number;
        name: string;
    }>;
    updateRole(id: number, data: any): Promise<{
        id: number;
        name: string;
    }>;
    deleteRole(id: number): Promise<{
        id: number;
        name: string;
    }>;
    createStatus(data: any): Promise<{
        id: number;
        name: string;
    }>;
    updateStatus(id: number, data: any): Promise<{
        id: number;
        name: string;
    }>;
    deleteStatus(id: number): Promise<{
        id: number;
        name: string;
    }>;
}
