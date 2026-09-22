export declare class CreateSessionDto {
    name: string;
    environmentId: number;
    moduleIds: string[];
    startDate?: string;
    endDate?: string;
    assignments?: Record<string, string>;
}
