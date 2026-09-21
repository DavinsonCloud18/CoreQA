import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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

  @Get(':sessionId/modules')
  async getSessionModules(@Param('sessionId') sessionId: string) {
    const data = await this.sessionsService.getSessionModules(sessionId);
    return { data };
  }
}
