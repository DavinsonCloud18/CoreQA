import { Controller, Get, UseGuards } from '@nestjs/common';
import { MasterService } from './master.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get('environments')
  async getEnvironments() {
    const data = await this.masterService.getEnvironments();
    return { data };
  }

  @Get('statuses')
  async getStatuses() {
    const data = await this.masterService.getStatuses();
    return { data };
  }

  @Get('modules')
  async getModules() {
    const data = await this.masterService.getModules();
    return { data };
  }

  @Get('users')
  async getUsers() {
    const data = await this.masterService.getUsers();
    return { data };
  }
}
