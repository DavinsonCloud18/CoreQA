import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ExecutionModule } from './execution/execution.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [PrismaModule, ExecutionModule, AnalyticsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
