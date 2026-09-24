const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/TaskManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldGrid = 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"';
const newGrid = 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"';

if (content.includes(oldGrid)) {
  content = content.replace(oldGrid, newGrid);
  fs.writeFileSync(file, content, 'utf8');
  console.log('TaskManagement grid updated');
} else {
  console.log('Could not find grid class');
}
