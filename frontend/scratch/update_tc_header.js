const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/sessions/[sessionId]/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update fetch to get full session
const oldFetch = `async function fetchSessionStatus(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(\`\${baseUrl}/sessions/\${sessionId}/analytics\`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.session?.status;
}`;

const newFetch = `async function fetchSessionInfo(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(\`\${baseUrl}/sessions\`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data || []).find((s: any) => s.id === sessionId) || null;
}`;
content = content.replace(oldFetch, newFetch);

content = content.replace('const status = await fetchSessionStatus(resolvedParams.sessionId);', 'const session = await fetchSessionInfo(resolvedParams.sessionId);\n  const status = session?.status;');

const oldHeader = `                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Menu</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Execute testcases and update statuses</p>`;

const newHeader = `                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                    {session ? session.name : 'Execution Menu'}
                  </h1>
                  <div className="text-indigo-200 font-medium text-sm mt-1.5 flex items-center gap-2">
                    {session ? (
                      <>
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30 uppercase font-bold tracking-wider">
                          {session.environment?.name || 'Session'}
                        </span>
                        <span>Execute testcases and update statuses</span>
                      </>
                    ) : (
                      <span>Execute testcases and update statuses</span>
                    )}
                  </div>`;
content = content.replace(oldHeader, newHeader);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
