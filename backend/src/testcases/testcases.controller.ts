import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put, Query, Patch } from '@nestjs/common';
import { TestcasesService } from './testcases.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('testcases')
@UseGuards(JwtAuthGuard)
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}

  @Post()
  async create(@Request() req: any, @Body() createTestcaseDto: any) {
    return { data: await this.testcasesService.create(req.user.id, createTestcaseDto) };
  }

  @Get()
  async findAll(@Query() query: any) {
    return { data: await this.testcasesService.findAll(query) };
  }

  @Get('notifications')
  async getNotifications(@Request() req: any) {
    return { data: await this.testcasesService.getNotifications(req.user.id) };
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(@Param('id') id: string) {
    return { data: await this.testcasesService.markNotificationRead(id) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.testcasesService.findOne(id) };
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateTestcaseDto: any) {
    return { data: await this.testcasesService.update(req.user.id, id, updateTestcaseDto) };
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return { data: await this.testcasesService.remove(req.user.id, req.user.role, id) };
  }

  @Post(':id/revive')
  async revive(@Request() req: any, @Param('id') id: string) {
    return { data: await this.testcasesService.revive(req.user.id, id) };
  }
}
