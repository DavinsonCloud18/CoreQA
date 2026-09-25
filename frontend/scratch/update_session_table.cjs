const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/SessionsTable.tsx';
let content = fs.readFileSync(file, 'utf8');

const cloneFunc = `
  const handleClone = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to clone this session? All modules and user assignments will be duplicated.')) return;
    
    try {
      const authStr = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/sessions/\${sessionId}/clone\`, {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${authStr.access_token}\` }
      });
      if (res.ok) {
        alert('Session cloned successfully!');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to clone session');
      }
    } catch (err) {
      alert('An error occurred while cloning the session.');
    }
  };
`;

content = content.replace('  const handleRowClick', cloneFunc + '\n  const handleRowClick');

content = content.replace(
  '<SortHeader label="% Passed" sortKey="passed" />\n            </tr>',
  '<SortHeader label="% Passed" sortKey="passed" />\n              <th className="py-4 px-6 text-indigo-200 font-semibold text-center w-24">Actions</th>\n            </tr>'
);

const rowEnd = `
                  <td className="py-4 px-6">
                    <button 
                      onClick={(e) => handleClone(e, session.id)}
                      className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 transition-colors flex items-center justify-center mx-auto"
                      title="Clone Session"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  </td>
                </tr>
`;

content = content.replace(
  '</span>\n                  </td>\n                </tr>',
  '</span>\n                  </td>' + rowEnd
);

content = content.replace('colSpan={7}', 'colSpan={8}');

fs.writeFileSync(file, content, 'utf8');
console.log('SessionsTable.tsx updated');
