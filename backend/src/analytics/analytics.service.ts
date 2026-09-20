import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSessionAnalytics(sessionId: string) {
    const statusCounts = await this.prisma.sessionExecution.groupBy({
      by: ['statusId'],
      where: { sessionId },
      _count: { statusId: true },
    });

    const statuses = await this.prisma.status.findMany();
    let totalExecutions = 0;
    
    const summary = statuses.reduce((acc: Record<string, number>, status: any) => {
      const count = statusCounts.find((sc: any) => sc.statusId === status.id)?._count.statusId || 0;
      acc[status.name] = count;
      totalExecutions += count;
      return acc;
    }, {} as Record<string, number>);

    const topFailedModules = await this.prisma.$queryRaw`
      SELECT 
        m.name as "moduleName",
        COUNT(se.id)::int as "totalTestcases",
        SUM(CASE WHEN s.name = 'FAILED' THEN 1 ELSE 0 END)::int as "failedCount",
        ROUND((SUM(CASE WHEN s.name = 'FAILED' THEN 1 ELSE 0 END)::decimal / NULLIF(COUNT(se.id), 0)::decimal) * 100, 2)::float as "failedRate"
      FROM session_executions se
      JOIN master_testcases mt ON se."testcaseId" = mt.id
      JOIN modules m ON mt."moduleId" = m.id
      JOIN statuses s ON se."statusId" = s.id
      WHERE se."sessionId" = ${sessionId}
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
}
