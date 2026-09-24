const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/modules/modules.service.ts';
let content = fs.readFileSync(file, 'utf8');

// Update findAll signature to include sortBy and sortOrder
content = content.replace(
  'async findAll(query: { page?: number, limit?: number, search?: string }) {',
  'async findAll(query: { page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string }) {'
);

// Update orderBy logic
const oldOrderBy = `        orderBy: { createdAt: 'desc' },`;
const newOrderBy = `        orderBy: query.sortBy ? (query.sortBy === 'testcaseCount' ? { testcases: { _count: query.sortOrder || 'desc' } } : { [query.sortBy]: query.sortOrder || 'asc' }) : { createdAt: 'desc' },`;
content = content.replace(oldOrderBy, newOrderBy);

fs.writeFileSync(file, content, 'utf8');
console.log('Backend API updated for sorting');
