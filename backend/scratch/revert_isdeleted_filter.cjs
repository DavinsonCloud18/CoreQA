const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/analytics/analytics.service.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the testcase: { isDeleted: false } condition from sessionExecution.findMany
const oldWhere = `    const sessionExecutions = await this.prisma.sessionExecution.findMany({
      where: { ...whereClause, testcase: { isDeleted: false } },
      include: {`;
const newWhere = `    const sessionExecutions = await this.prisma.sessionExecution.findMany({
      where: whereClause,
      include: {`;
content = content.replace(oldWhere, newWhere);

fs.writeFileSync(file, content, 'utf8');
console.log('Backend updated successfully');
