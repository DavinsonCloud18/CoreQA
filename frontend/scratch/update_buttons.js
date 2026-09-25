const fs = require('fs');
const path = require('path');

const updateFile = (filename, replacements) => {
  const filePath = path.join(__dirname, '../src/components/dashboard/', filename);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filename}`);
};

// 1. DeleteSessionButton
updateFile('DeleteSessionButton.tsx', [
  {
    from: /className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors bg-rose-500\/10 hover:bg-rose-500\/20 text-rose-400 hover:text-rose-300 border border-rose-500\/30"/,
    to: 'className="flex items-center justify-center gap-2 px-4 h-10 rounded-xl text-sm font-bold transition-colors bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30"'
  }
]);

// 2. EditSessionButton
updateFile('EditSessionButton.tsx', [
  {
    from: /className="px-4 py-2 bg-indigo-500\/10 hover:bg-indigo-500\/20 text-indigo-400 font-bold rounded-xl transition-colors border border-indigo-500\/20 shadow-sm flex items-center gap-2"/,
    to: 'className="flex items-center justify-center gap-2 px-4 h-10 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold rounded-xl transition-colors border border-indigo-500/30 shadow-sm"'
  }
]);

// 3. CloneSessionButton
updateFile('CloneSessionButton.tsx', [
  {
    from: /className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors\s*\${isCloning\s*\?\s*'bg-indigo-500\/10 text-indigo-500\/50 cursor-not-allowed border border-indigo-500\/10'\s*:\s*'bg-indigo-500\/10 hover:bg-indigo-500\/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500\/30'\s*}`}/,
    to: 'className={`flex items-center justify-center gap-2 px-4 h-10 rounded-xl text-sm font-bold transition-colors ${isCloning ? \'bg-purple-500/10 text-purple-500/50 cursor-not-allowed border border-purple-500/10\' : \'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 border border-purple-500/30\'}`}'
  }
]);

// 4. CompleteSessionButton (has 3 buttons we need to adjust: "Session Finished", "Reopen", "Complete Session")
updateFile('CompleteSessionButton.tsx', [
  {
    from: /className="bg-emerald-500\/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500\/30 shadow-\[0_0_15px_rgba\(16,185,129,0\.15\)\] flex items-center gap-2"/,
    to: 'className="bg-emerald-500/10 text-emerald-400 px-4 h-10 rounded-xl text-sm font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2"'
  },
  {
    from: /className="bg-slate-500\/20 hover:bg-slate-500\/40 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold  flex items-center gap-2"/,
    to: 'className="bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 hover:text-slate-300 border border-slate-500/30 px-4 h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"'
  },
  {
    from: /className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2\s*\${!isReady\s*\?\s*'bg-slate-800 text-slate-500 cursor-not-allowed'\s*:\s*'bg-emerald-500 hover:bg-emerald-400 text-white shadow-\[0_0_15px_rgba\(16,185,129,0\.2\)\]'\s*}`}/,
    to: 'className={`px-4 h-10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${!isReady ? \'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50\' : \'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]\'}`}'
  }
]);

console.log('All replacements processed.');
