const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/SessionsTable.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update initial sorts state
const stateTarget = '  const [sorts, setSorts] = useState<SortConfig[]>([]);';
const stateReplacement = `  const [sorts, setSorts] = useState<SortConfig[]>([{ key: 'status', direction: 'asc' }]);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Update statusWeight
const weightTarget = `    const statusWeight: Record<string, number> = {
      'To Do': 1,
      'On Progress': 2,
      'Finished': 3,
      'Done': 3
    };`;

const weightReplacement = `    const statusWeight: Record<string, number> = {
      'On Progress': 1,
      'To Do': 2,
      'Finished': 3,
      'Done': 3
    };`;
content = content.replace(weightTarget, weightReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated SessionsTable sorting');
