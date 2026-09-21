import { Module } from '@nestjs/common';
import { MasterController } from './master.controller.js';
import { MasterService } from './master.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MasterController],
  providers: [MasterService],
})
export class MasterModule {}
