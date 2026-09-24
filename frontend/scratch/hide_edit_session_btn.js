const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/EditSessionButton.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `import { useState } from 'react';
import { EditSessionModal } from './EditSessionModal';

export function EditSessionButton({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!session || session.status === 'Finished' || session.status === 'Done') return null;`;

const newCode = `import { useState, useEffect } from 'react';
import { EditSessionModal } from './EditSessionModal';

export function EditSessionButton({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        setCurrentUser(JSON.parse(authData).user);
      } catch (e) {}
    }
  }, []);

  if (!session || session.status === 'Finished' || session.status === 'Done' || currentUser?.role === 'QA Member') return null;`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(file, content, 'utf8');
  console.log('EditSessionButton updated');
} else {
  console.log('Could not find code block in EditSessionButton');
}
