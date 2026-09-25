const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = '                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Menu</h1>\r\n                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Execute testcases across your selected session</p>';

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

// Try CRLF first
let replaced = content.replace(target, replacement);

if (replaced === content) {
  // Try LF
  const targetLF = '                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Menu</h1>\n                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Execute testcases across your selected session</p>';
  replaced = content.replace(targetLF, replacement);
}

fs.writeFileSync(file, replaced, 'utf8');
console.log(replaced !== content ? 'Successfully replaced!' : 'Failed to replace, string not found');
