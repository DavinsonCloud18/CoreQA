const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { CloneSessionButton } from '@/components/dashboard/CloneSessionButton';",
  "import { CloneSessionButton } from '@/components/dashboard/CloneSessionButton';\nimport { DeleteSessionButton } from '@/components/dashboard/DeleteSessionButton';"
);

content = content.replace(
  '<CloneSessionButton sessionId={currentSession.id} />',
  '<DeleteSessionButton session={currentSession} />\n                       <CloneSessionButton sessionId={currentSession.id} />'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
