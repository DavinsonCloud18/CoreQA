import { Controller, Get, Put, Query, Body, UseGuards } from '@nestjs/common';
import { TrashService } from './trash.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get()
  async getTrash(@Query('type') type: string) {
    const data = await this.trashService.getTrash(type);
    return { data };
  }

  @Put('restore')
  async restore(@Body() body: { type: string, ids: string[] }) {
    const data = await this.trashService.restore(body.type, body.ids);
    return { message: 'Data restored successfully', data };
  }
}
