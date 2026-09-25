const fs = require('fs');
const frontendFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/TrashManagement.tsx';
let content = fs.readFileSync(frontendFile, 'utf8');

// Replace createPortal logic with inline rendering
content = content.replace('{isDeleteModalOpen && createPortal(', '{isDeleteModalOpen && (');
content = content.replace('        document.body\n      )}', '      )}');

// Also, the import for createPortal can stay, it won't hurt, but we removed its usage.
fs.writeFileSync(frontendFile, content, 'utf8');
console.log('Removed createPortal from TrashManagement');
