const fs = require('fs');
const path = require('path');

const srcPath = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/CreateSessionModal.tsx';
const dstPath = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/EditSessionModal.tsx';

let content = fs.readFileSync(srcPath, 'utf8');

content = content.replace(/CreateSessionModal/g, 'EditSessionModal');
content = content.replace(/export function EditSessionModal\({ isOpen, onClose }: \{ isOpen: boolean; onClose: \(\) => void \}\) {/,
'export function EditSessionModal({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: any }) {');

// We need to set initial values based on session
const useEffectInitCode = `
  useEffect(() => {
    if (session && isOpen) {
      setName(session.name || '');
      setEnvironmentId(session.environmentId ? String(session.environmentId) : '');
      if (session.startDate) setStartDate(new Date(session.startDate).toISOString().split('T')[0]);
      if (session.endDate) setEndDate(new Date(session.endDate).toISOString().split('T')[0]);
      // fetch active modules for this session
      fetch(process.env.NEXT_PUBLIC_API_URL + '/sessions/' + session.id + '/modules', {
        headers: { 'Authorization': \`Bearer \${JSON.parse(localStorage.getItem('auth') || '{}').access_token}\` }
      })
      .then(res => res.json())
      .then(data => {
         const mids = (data.data || []).map((m: any) => m.id || m.moduleId);
         setSelectedModules(new Set(mids));
         
         // extract claims
         const assigns: Record<string, string> = {};
         (data.data || []).forEach((m: any) => {
            if (m.isClaimed && m.claimedById) {
               assigns[m.id || m.moduleId] = m.claimedById;
            }
         });
         setAssignments(assigns);
      })
      .catch(console.error);
    }
  }, [session, isOpen]);
`;

content = content.replace(/useEffect\(\(\) => \{\s*if \(isOpen\) \{\s*fetchMasterData\(\);\s*\}\s*\}, \[isOpen\]\);/,
`useEffect(() => {
    if (isOpen) {
      fetchMasterData();
    }
  }, [isOpen]);
${useEffectInitCode}`);

// Replace API call to use PATCH
content = content.replace(/const res = await fetch\(\`\$\{baseUrl\}\/sessions\`\, \{/, `const res = await fetch(\`\${baseUrl}/sessions/\${session.id}\`, {`);
content = content.replace(/method: 'POST',/, `method: 'PATCH',`);
content = content.replace(/Create Testing Session/, 'Edit Testing Session');
content = content.replace(/router.push\(\`\/dashboard\/sessions\/\$\{data\.data\.id\}\`\);/, 'window.location.reload();');
content = content.replace(/router\.push\(\`\/dashboard\/sessions\/\$\{data\.data\.id\}\/execution\`\);/, '');

fs.writeFileSync(dstPath, content, 'utf8');
console.log('EditSessionModal created');
