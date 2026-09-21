var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGlobalAnalytics(sessionId) {
        const whereClause = sessionId ? { sessionId } : {};
        const statusCounts = await this.prisma.sessionExecution.groupBy({
            by: ['statusId'],
            where: whereClause,
            _count: { statusId: true },
        });
        const statuses = await this.prisma.status.findMany();
        let totalExecutions = 0;
        const summary = statuses.reduce((acc, status) => {
            const count = statusCounts.find((sc) => sc.statusId === status.id)?._count.statusId || 0;
            acc[status.name] = count;
            totalExecutions += count;
            return acc;
        }, {});
        const claimHistories = await this.prisma.claimHistory.findMany({
            where: sessionId ? { sessionId, isActive: true } : { isActive: true },
            include: {
                claimedBy: { select: { id: true, name: true, email: true } },
                module: { select: { id: true, name: true } },
                session: { select: { id: true, name: true } }
            }
        });
        const userAssignmentsMap = new Map();
        claimHistories.forEach(ch => {
            const userId = ch.claimedBy.id;
            if (!userAssignmentsMap.has(userId)) {
                userAssignmentsMap.set(userId, {
                    user: ch.claimedBy,
                    modules: []
                });
            }
            userAssignmentsMap.get(userId).modules.push({
                module: ch.module,
                session: ch.session
            });
        });
        const userAssignments = Array.from(userAssignmentsMap.values());
        return {
            summary: { ...summary, total: totalExecutions },
            userAssignments
        };
    }
    async getSessionAnalytics(sessionId) {
        const statusCounts = await this.prisma.sessionExecution.groupBy({
            by: ['statusId'],
            where: { sessionId },
            _count: { statusId: true },
        });
        const statuses = await this.prisma.status.findMany();
        let totalExecutions = 0;
        const summary = statuses.reduce((acc, status) => {
            const count = statusCounts.find((sc) => sc.statusId === status.id)?._count.statusId || 0;
            acc[status.name] = count;
            totalExecutions += count;
            return acc;
        }, {});
        const topFailedModules = await this.prisma.$queryRaw `
      SELECT 
        m.name as "moduleName",
        COUNT(se.id)::int as "totalTestcases",
        SUM(CASE WHEN s.name = 'FAILED' THEN 1 ELSE 0 END)::int as "failedCount",
        ROUND((SUM(CASE WHEN s.name = 'FAILED' THEN 1 ELSE 0 END)::decimal / NULLIF(COUNT(se.id), 0)::decimal) * 100, 2)::float as "failedRate"
      FROM session_executions se
      JOIN master_testcases mt ON se."testcaseId" = mt.id
      JOIN modules m ON mt."moduleId" = m.id
      JOIN statuses s ON se."statusId" = s.id
      WHERE se."sessionId" = CAST(${sessionId} AS UUID)
      GROUP BY mt."moduleId", m.name
      HAVING SUM(CASE WHEN s.name = 'FAILED' THEN 1 ELSE 0 END) > 0
      ORDER BY "failedRate" DESC
      LIMIT 5;
    `;
        return {
            summary: { ...summary, total: totalExecutions },
            topFailedModules,
        };
    }
};
AnalyticsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map