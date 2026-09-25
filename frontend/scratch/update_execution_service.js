const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/execution/execution.service.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `                  claimHistories: { where: { isActive: true } }`;
const replacement = `                  claimHistories: { where: { isActive: true }, include: { claimedBy: { select: { id: true, name: true } } } }`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated execution.service.ts to include claimedBy');
