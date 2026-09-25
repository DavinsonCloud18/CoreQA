const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = '                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Menu</h1>\n                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Execute testcases across your selected session</p>';

const replacement = `                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                    {currentSession ? currentSession.name : 'Execution Menu'}
                  </h1>
                  <div className="text-indigo-200 font-medium text-sm mt-1.5 flex items-center gap-2">
                    {currentSession ? (
                      <>
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30 uppercase font-bold tracking-wider">
                          {currentSession.environment?.name || 'Session'}
                        </span>
                        <span>Manage execution and update testcases</span>
                      </>
                    ) : (
                      <span>Execute testcases across your selected session</span>
                    )}
                  </div>`;

content = content.replace(target, replacement);

// ALSO fix the same issue for /dashboard/sessions/[sessionId]/execution/page.tsx
const testcaseFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/sessions/[sessionId]/execution/page.tsx';
if (fs.existsSync(testcaseFile)) {
    let tcContent = fs.readFileSync(testcaseFile, 'utf8');
    
    // We need to fetch the session name inside this page.
    // Let's see if we can just pass the name via API or fetch it.
    // Wait, the user specifically mentioned "melihat execution log, kalau dia saat ini lagi kerjain session apa".
    // I should just update Execution Menu for now since that's what they asked for.
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
