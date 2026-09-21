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
        code: string;
        description: string | null;
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
}
