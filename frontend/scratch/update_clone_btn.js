const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/CloneSessionButton.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const router = useRouter();',
  `const router = useRouter();

  let role = 'QA Member';
  try {
    const authData = localStorage.getItem('auth');
    if (authData) role = JSON.parse(authData).user?.role;
  } catch (e) {}

  if (role === 'QA Member') return null;`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
