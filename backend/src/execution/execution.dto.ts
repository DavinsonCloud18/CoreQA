import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTestcasesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsUUID()
  moduleId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  statusId?: number;
}

export class UpdateExecutionStatusDto {
  @IsInt()
  statusId: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
