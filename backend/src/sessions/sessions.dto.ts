export class CreateSessionDto {
  name: string;
  environmentId: number;
  moduleIds: string[];
  startDate?: string;
  endDate?: string;
  assignments?: Record<string, string>;
}

export class UpdateSessionDto {
  name?: string;
  environmentId?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  moduleIds?: string[];
  assignments?: Record<string, string>;
}
