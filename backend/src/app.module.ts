import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExecutionModule } from './execution/execution.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { MasterModule } from './master/master.module.js';
import { SessionsModule } from './sessions/sessions.module.js';

@Module({
  imports: [PrismaModule, AuthModule, ExecutionModule, AnalyticsModule, MasterModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
