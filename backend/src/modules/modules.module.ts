import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller.js';
import { ModulesService } from './modules.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
