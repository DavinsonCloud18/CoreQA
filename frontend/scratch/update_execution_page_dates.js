const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const displayDates = `
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-white flex items-center gap-2">
                     <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block shadow-[0_0_10px_rgba(99,102,241,0.6)]"></span>
                     Execution Progress
                   </h2>
                   
                   {currentSession && (
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                         Start: {new Date(currentSession.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                       </span>
                       {currentSession.endDate && (
                         <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                           End: {new Date(currentSession.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                         </span>
                       )}
                       <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                         {currentSession.status}
                       </span>
                     </div>
                   )}
                   
                   <div className="flex items-center gap-3">
`;

content = content.replace(/<div className="flex justify-between items-center mb-6">\s*<h2 className="text-xl font-bold text-white flex items-center gap-2">\s*<span className="w-2 h-6 bg-indigo-500 rounded-full inline-block shadow-\[0_0_10px_rgba\(99,102,241,0\.6\)\]"><\/span>\s*Execution Progress\s*<\/h2>\s*<div className="flex items-center gap-3">/g, displayDates);

fs.writeFileSync(file, content, 'utf8');
console.log('Execution page updated with dates');
