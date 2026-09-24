const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/analytics/analytics.service.ts';
let content = fs.readFileSync(file, 'utf8');

const oldInclude = `      include: {
        claimedBy: { select: { id: true, name: true, email: true } },
        module: { select: { id: true, name: true } },
        session: { select: { id: true, name: true } }
      }`;

const newInclude = `      include: {
        claimedBy: { select: { id: true, name: true, email: true } },
        module: { 
          select: { 
            id: true, 
            name: true,
            _count: { select: { testcases: { where: { isDeleted: false } } } }
          } 
        },
        session: { select: { id: true, name: true } }
      }`;

content = content.replace(oldInclude, newInclude);

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
