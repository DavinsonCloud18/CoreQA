var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExecutionModule } from './execution/execution.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { MasterModule } from './master/master.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { TestcasesModule } from './testcases/testcases.module.js';
import { ModulesModule } from './modules/modules.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [PrismaModule, AuthModule, ExecutionModule, AnalyticsModule, MasterModule, SessionsModule, TestcasesModule, ModulesModule],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map