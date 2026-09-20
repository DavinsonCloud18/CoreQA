import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller.js';
import { ExecutionService } from './execution.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ExecutionController],
  providers: [ExecutionService]
})
export class ExecutionModule {}
