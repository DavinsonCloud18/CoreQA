import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('analytics')
  async getGlobalAnalytics(@Query('sessionId') sessionId?: string) {
    const data = await this.analyticsService.getGlobalAnalytics(sessionId);
    return { message: 'Analytics retrieved', data };
  }

  @Get('sessions/:sessionId/analytics')
  async getAnalytics(@Param('sessionId') sessionId: string) {
    const data = await this.analyticsService.getSessionAnalytics(sessionId);
    return { message: 'Analytics retrieved', data };
  }
}
