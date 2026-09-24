const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.controller.ts';
let content = fs.readFileSync(file, 'utf8');

const oldPatch = `  @Patch(':id')
  async updateSession(
    @Param('id') id: string,
    @Body() dto: any
  ) {
    const data = await this.sessionsService.updateSession(id, dto);
    return { message: 'Session updated successfully', data };
  }`;

const newPatch = `  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateSession(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: any
  ) {
    if (req.user?.role === 'QA Member') {
      throw new ForbiddenException('Only Admin or Leader can edit sessions');
    }
    const data = await this.sessionsService.updateSession(id, dto);
    return { message: 'Session updated successfully', data };
  }`;

if (content.includes(oldPatch)) {
  content = content.replace(oldPatch, newPatch);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Backend edit restriction applied');
} else {
  console.log('Could not find PATCH method');
}
