const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldBtn = `{currentUser?.role !== 'QA Member' && (`;
const newBtn = `{(currentUser && currentUser.role !== 'QA Member') && (`;

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Sidebar fixed');
} else {
  console.log('Could not find Sidebar button check');
}
