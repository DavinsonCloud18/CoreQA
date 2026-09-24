const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/EditSessionModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<h2 className="text-2xl font-bold text-white">Create New Session<\/h2>/g, 
                          '<h2 className="text-2xl font-bold text-white">Edit Session</h2>');
                          
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed EditSessionModal title');
