const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleList.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will just replace the entire return JSX inside ModuleList
// Wait, I can't easily parse and replace just the return. I'll rewrite the component.
