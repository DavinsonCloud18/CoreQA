const fs = require('fs');

function updateModal(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace select dropdown with pills using Regex
  const regex = /<select[\s\S]*?value=\{environmentId\}[\s\S]*?<\/select>/;

  const newSelect = `<div className="flex flex-wrap gap-2 mt-1">
                {environments.map(env => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => setEnvironmentId(String(env.id))}
                    className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-all \${
                      environmentId === String(env.id) 
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300'
                    }\`}
                  >
                    {env.name}
                  </button>
                ))}
              </div>`;

  if (content.match(regex)) {
    content = content.replace(regex, newSelect);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  } else {
    console.log('Could not find select in ' + filePath);
  }
}

updateModal('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/EditSessionModal.tsx');
updateModal('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/CreateSessionModal.tsx');
