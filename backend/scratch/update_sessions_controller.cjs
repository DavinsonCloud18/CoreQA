const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/sessions/sessions.controller.ts';
let content = fs.readFileSync(file, 'utf8');

const logicToInject = `
  @UseGuards(JwtAuthGuard)
  @Post(':id/clone')
  async cloneSession(
    @Request() req: any,
    @Param('id') id: string
  ) {
    if (req.user?.role === 'QA Member') {
      throw new ForbiddenException('Only Admin or Leader can clone sessions');
    }
    const data = await this.sessionsService.cloneSession(id);
    return { message: 'Session cloned successfully', data };
  }
`;

const insertPoint = content.indexOf('  @Get()');
if (insertPoint === -1) {
    console.error('Could not find Get()');
    process.exit(1);
}
content = content.slice(0, insertPoint) + logicToInject + '\n' + content.slice(insertPoint);

fs.writeFileSync(file, content, 'utf8');
console.log('sessions.controller.ts updated');
