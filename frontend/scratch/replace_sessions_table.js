const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/sessions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Insert import if not exists
if (!content.includes('import { SessionsTable }')) {
  content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { SessionsTable } from '@/components/dashboard/SessionsTable';");
}

// Replace the table with SessionsTable
const regex = /<div className="overflow-x-auto">[\s\S]*?<\/div>/;
content = content.replace(regex, '<SessionsTable initialSessions={sessionsWithAnalytics} />');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed sessions page');
