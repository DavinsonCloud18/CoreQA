import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('sessions/:sessionId/analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(@Param('sessionId') sessionId: string) {
    const data = await this.analyticsService.getSessionAnalytics(sessionId);
    return { message: 'Analytics retrieved', data };
  }
}
