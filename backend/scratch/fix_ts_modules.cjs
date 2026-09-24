const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/modules/modules.service.ts';
let content = fs.readFileSync(file, 'utf8');

const oldOrderBy = `        orderBy: query.sortBy ? (query.sortBy === 'testcaseCount' ? { testcases: { _count: query.sortOrder || 'desc' } } : { [query.sortBy]: query.sortOrder || 'asc' }) : { createdAt: 'desc' },`;
const newOrderBy = `        orderBy: query.sortBy ? (query.sortBy === 'testcaseCount' ? { testcases: { _count: (query.sortOrder === 'asc' ? 'asc' : 'desc') } } : { [query.sortBy]: (query.sortOrder === 'desc' ? 'desc' : 'asc') }) : { createdAt: 'desc' },`;

content = content.replace(oldOrderBy, newOrderBy);

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
