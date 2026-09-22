import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { MasterService } from './master.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('master')
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles('Admin')
  @Post('statuses')
  async createStatus(@Body() data: any) {
    const result = await this.masterService.createStatus(data);
    return { data: result };
  }

  @Roles('Admin')
  @Put('statuses/:id')
  async updateStatus(@Param('id') id: string, @Body() data: any) {
    const result = await this.masterService.updateStatus(Number(id), data);
    return { data: result };
  }

  @Roles('Admin')
  @Delete('statuses/:id')
  async deleteStatus(@Param('id') id: string) {
    const result = await this.masterService.deleteStatus(Number(id));
    return { data: result };
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

  @Roles('Admin', 'Leader')
  @Post('users')
  async createUser(@Body() data: any, @Request() req: any) {
    if (req.user.roleName === 'Leader') {
      const roles = await this.masterService.getRoles();
      const qaRole = roles.find((r: any) => r.name === 'QA Member');
      if (!qaRole || Number(data.roleId) !== qaRole.id) {
        throw new ForbiddenException('Leaders can only create QA Member');
      }
    }
    const result = await this.masterService.createUser(data);
    return { data: result };
  }

  @Roles('Admin', 'Leader')
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    let allowedData = data;
    if (req.user.roleName === 'Leader') {
      const targetRole = await this.masterService.getUserRole(id);
      if (targetRole !== 'QA Member') {
        throw new ForbiddenException('Leaders can only edit QA Member');
      }
      allowedData = { isActive: data.isActive };
    }
    const result = await this.masterService.updateUser(id, allowedData);
    return { data: result };
  }

  @Roles('Admin', 'Leader')
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    if (req.user.roleName === 'Leader') {
      const targetRole = await this.masterService.getUserRole(id);
      if (targetRole !== 'QA Member') {
        throw new ForbiddenException('Leaders can only delete QA Member');
      }
    }
    const result = await this.masterService.deleteUser(id);
    return { data: result };
  }

  @Get('roles')
  async getRoles() {
    const data = await this.masterService.getRoles();
    return { data };
  }

  @Roles('Admin')
  @Post('roles')
  async createRole(@Body() data: any) {
    const result = await this.masterService.createRole(data);
    return { data: result };
  }

  @Roles('Admin')
  @Put('roles/:id')
  async updateRole(@Param('id') id: string, @Body() data: any) {
    const result = await this.masterService.updateRole(Number(id), data);
    return { data: result };
  }

  @Roles('Admin')
  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    const result = await this.masterService.deleteRole(Number(id));
    return { data: result };
  }
}
