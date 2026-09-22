import { Module } from '@nestjs/common';
import { TestcasesController } from './testcases.controller.js';
import { TestcasesService } from './testcases.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TestcasesController],
  providers: [TestcasesService],
})
export class TestcasesModule {}
