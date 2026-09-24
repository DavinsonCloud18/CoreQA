const fs = require('fs');

function replaceBackLink(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if not exists
  if (!content.includes("import { BackButton }")) {
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { BackButton } from '@/components/dashboard/BackButton';");
  }

  // Replace the Link block
  const regex = /<Link href=\{?`?\/dashboard[^>]+? className="w-12 h-12 bg-white\/5[^>]+?>[\s\S]*?<\/Link>/;
  content = content.replace(regex, "<BackButton />");

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceBackLink('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/sessions/[sessionId]/execution/page.tsx');
replaceBackLink('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx');

console.log('Replaced Links with BackButton.');
