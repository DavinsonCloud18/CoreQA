const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/EditSessionButton.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLine = `if (!session || session.status === 'Finished' || session.status === 'Done' || currentUser?.role === 'QA Member') return null;`;
// We want to hide it if currentUser is NOT YET known OR if currentUser is QA member.
// So if (!currentUser) return null;
const newLine = `if (!session || session.status === 'Finished' || session.status === 'Done' || !currentUser || currentUser.role === 'QA Member') return null;`;

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  fs.writeFileSync(file, content, 'utf8');
  console.log('EditSessionButton fixed');
} else {
  console.log('Could not find EditSessionButton button check');
}
