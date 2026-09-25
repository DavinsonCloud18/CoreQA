const fs = require('fs');

function fixHydration(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace synchronous localStorage call with useEffect
  if (content.includes("let role = 'QA Member';")) {
    // For CloneSessionButton
    const oldRoleCheck = `  let role = 'QA Member';
  try {
    const authData = localStorage.getItem('auth');
    if (authData) role = JSON.parse(authData).user?.role;
  } catch (e) {}

  if (role === 'QA Member') return null;`;

    const newRoleCheck = `  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) setRole(JSON.parse(authData).user?.role || 'QA Member');
      else setRole('QA Member');
    } catch (e) {
      setRole('QA Member');
    }
  }, []);

  if (role === null || role === 'QA Member') return null;`;

    // Make sure useEffect is imported
    if (!content.includes('useEffect')) {
      content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
    }

    content = content.replace(oldRoleCheck, newRoleCheck);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  } else if (content.includes("let role = 'QA Member';")) {
    // Wait, let's just make it robust
  }
}

// Fix CloneSessionButton
fixHydration('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/CloneSessionButton.tsx');

// Fix DeleteSessionButton
let delPath = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/DeleteSessionButton.tsx';
let delContent = fs.readFileSync(delPath, 'utf8');
const oldDelCheck = `  let role = 'QA Member';
  try {
    const authData = localStorage.getItem('auth');
    if (authData) role = JSON.parse(authData).user?.role;
  } catch (e) {}

  if (!session || role === 'QA Member') return null;`;

const newDelCheck = `  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) setRole(JSON.parse(authData).user?.role || 'QA Member');
      else setRole('QA Member');
    } catch (e) {
      setRole('QA Member');
    }
  }, []);

  if (!session || role === null || role === 'QA Member') return null;`;

if (!delContent.includes('useEffect')) {
  delContent = delContent.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}
delContent = delContent.replace(oldDelCheck, newDelCheck);
fs.writeFileSync(delPath, delContent, 'utf8');
console.log('Fixed DeleteSessionButton');
