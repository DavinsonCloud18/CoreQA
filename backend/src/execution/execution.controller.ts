import { Controller, Get, Post, Patch, Body, Param, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ExecutionService } from './execution.service.js';
import { GetTestcasesQueryDto, UpdateExecutionStatusDto } from './execution.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('sessions/:sessionId')
@UseGuards(JwtAuthGuard)
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Get('testcases')
  async getExecutions(
    @Param('sessionId') sessionId: string,
    @Query() query: GetTestcasesQueryDto
  ) {
    return await this.executionService.getSessionExecutions(sessionId, query);
  }

  @Post('modules/:moduleId/claim')
  @HttpCode(HttpStatus.OK)
  async claimModule(
    @Param('sessionId') sessionId: string,
    @Param('moduleId') moduleId: string,
    @Body('userId') userId: string 
  ) {
    const claim = await this.executionService.claimModule(sessionId, moduleId, userId);
    return { message: 'Module berhasil diklaim', data: claim };
  }

  @Patch('testcases/:testcaseId/status')
  async updateStatus(
    @Param('sessionId') sessionId: string,
    @Param('testcaseId') testcaseId: string,
    @Body() dto: UpdateExecutionStatusDto,
    @Body('userId') userId: string 
  ) {
    const result = await this.executionService.updateExecutionStatus(sessionId, testcaseId, userId, dto);
    return { message: 'Status eksekusi berhasil diupdate', data: result };
  }
}
