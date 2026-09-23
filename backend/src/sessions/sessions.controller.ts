import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';
import { CreateSessionDto } from './sessions.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async createSession(@Body() dto: CreateSessionDto) {
    const data = await this.sessionsService.createSession(dto);
    return { message: 'Session created successfully', data };
  }

  @Get()
  async getSessions() {
    const data = await this.sessionsService.getSessions();
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tasks')
  async getMyTasks(@Request() req: any) {
    const data = await this.sessionsService.getMyTasks(req.user.id);
    return { data };
  }

  @Get(':sessionId/modules')
  async getSessionModules(@Param('sessionId') sessionId: string) {
    const data = await this.sessionsService.getSessionModules(sessionId);
    return { data };
  }

  @Patch(':sessionId/status')
  async updateSessionStatus(
    @Param('sessionId') sessionId: string,
    @Body('status') status: string
  ) {
    const data = await this.sessionsService.updateSessionStatus(sessionId, status);
    return { message: 'Session status updated', data };
  }
}
