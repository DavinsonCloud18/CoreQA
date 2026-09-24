const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/modules/modules.controller.ts';
let content = fs.readFileSync(file, 'utf8');

const oldFindAll = `  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    const query = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
      search
    };`;

const newFindAll = `  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string, @Query('sortBy') sortBy?: string, @Query('sortOrder') sortOrder?: string) {
    const query = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
      search,
      sortBy,
      sortOrder
    };`;

content = content.replace(oldFindAll, newFindAll);

fs.writeFileSync(file, content, 'utf8');
console.log('Controller updated');
