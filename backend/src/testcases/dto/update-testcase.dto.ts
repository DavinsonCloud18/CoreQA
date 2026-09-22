import { PartialType } from '@nestjs/mapped-types';
import { CreateTestcaseDto } from './create-testcase.dto.js';

export class UpdateTestcaseDto extends PartialType(CreateTestcaseDto) {}
