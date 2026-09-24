const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/UserAssignments.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update the badge in the row to calculate sum from stats instead of _count
// In line 83: {assignment.modules.reduce((sum: number, m: any) => sum + (m.module._count?.testcases || 0), 0)} TCs
// Change to: {assignment.modules.reduce((sum: number, m: any) => sum + Object.values(m.stats || {}).reduce((a: any, b: any) => a + b, 0), 0)} TCs
const oldRowBadge = `{assignment.modules.reduce((sum: number, m: any) => sum + (m.module._count?.testcases || 0), 0)} TCs`;
const newRowBadge = `{assignment.modules.reduce((sum: number, m: any) => sum + (Object.values(m.stats || {}).reduce((a: any, b: any) => a + (b as number), 0) as number), 0)} TCs`;
content = content.replace(oldRowBadge, newRowBadge);

// Update the module detail badge
// In line 113: {mod._count?.testcases || 0} TCs
// Change to: {Object.values(mod.stats || {}).reduce((a: any, b: any) => a + (b as number), 0) as number} TCs
const oldDetailBadge = `{mod._count?.testcases || 0} TCs`;
const newDetailBadge = `{Object.values(mod.stats || {}).reduce((a: any, b: any) => a + (b as number), 0) as number} TCs`;
content = content.replace(oldDetailBadge, newDetailBadge);

fs.writeFileSync(file, content, 'utf8');
console.log('Frontend updated successfully');
