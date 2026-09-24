const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('EditSessionButton')) {
  content = content.replace(/import { CompleteSessionButton } from '@\/components\/dashboard\/CompleteSessionButton';/,
`import { CompleteSessionButton } from '@/components/dashboard/CompleteSessionButton';\nimport { EditSessionButton } from '@/components/dashboard/EditSessionButton';`);
}

// Add button next to CompleteSessionButton
content = content.replace(/<CompleteSessionButton sessionId=\{resolvedParams.session\} isReady=\{isReady\} \/>/, 
`<EditSessionButton session={currentSession} />\n                <CompleteSessionButton sessionId={resolvedParams.session} isReady={isReady} />`);

fs.writeFileSync(file, content, 'utf8');
console.log('Execution page updated');
