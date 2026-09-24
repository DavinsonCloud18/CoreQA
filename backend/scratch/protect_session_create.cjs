const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.controller.ts';
let content = fs.readFileSync(file, 'utf8');

// Add ForbiddenException to imports if not there
if (!content.includes('ForbiddenException')) {
  content = content.replace(/import \{ Controller, Get, Post, Patch, Body, Param, UseGuards, Request \} from '@nestjs\/common';/, 
                            "import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';");
}

// Update POST method
const oldPost = `  @Post()
  async createSession(@Body() dto: CreateSessionDto) {
    const data = await this.sessionsService.createSession(dto);
    return { message: 'Session created successfully', data };
  }`;

const newPost = `  @UseGuards(JwtAuthGuard)
  @Post()
  async createSession(@Request() req: any, @Body() dto: CreateSessionDto) {
    if (req.user?.role === 'QA Member') {
      throw new ForbiddenException('Only Admin or Leader can create sessions');
    }
    const data = await this.sessionsService.createSession(dto);
    return { message: 'Session created successfully', data };
  }`;

if (content.includes(oldPost)) {
  content = content.replace(oldPost, newPost);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Backend updated');
} else {
  console.log('Could not find POST in backend');
}
