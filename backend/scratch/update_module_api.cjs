const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/backend/src/modules/modules.service.ts';
let content = fs.readFileSync(file, 'utf8');

const oldFind = `      this.prisma.module.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })`;

const newFind = `      this.prisma.module.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { testcases: { where: { isDeleted: false } } } }
        }
      })`;

if (content.includes(oldFind)) {
  content = content.replace(oldFind, newFind);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Backend updated');
} else {
  console.log('Could not find findMany logic in backend');
}
