const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<Link href="\/dashboard\/sessions" className="w-12 h-12 bg-white\/5 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-colors">[\s\S]*?<\/Link>/,
  '<BackButton />'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed execution page');
