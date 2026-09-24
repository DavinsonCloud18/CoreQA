const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-8">/, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">');

fs.writeFileSync(file, content, 'utf8');
console.log('updated page.tsx');
