const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/execution/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import for EditSessionButton
if (!content.includes('EditSessionButton')) {
  content = content.replace(/import \{ CompleteSessionButton \} from '@\/components\/dashboard\/CompleteSessionButton';/,
`import { CompleteSessionButton } from '@/components/dashboard/CompleteSessionButton';\nimport { EditSessionButton } from '@/components/dashboard/EditSessionButton';`);
}

const newHeader = `<div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                       <span className="w-2 h-6 bg-amber-500 rounded-full inline-block shadow-[0_0_10px_rgba(245,158,11,0.6)]"></span>
                       Session Summary
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
                       <EditSessionButton session={currentSession} />
                       <CompleteSessionButton 
                         sessionId={resolvedParams.session} 
                         initialStatus={currentSession?.status || 'On Progress'} 
                         isReady={isReady} 
                       />
                     </div>
                   </div>`;

const regex = /<div className="flex justify-between items-center">[\s\S]*?<CompleteSessionButton[\s\S]*?\/>\s*<\/div>/;

content = content.replace(regex, newHeader);

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacement');
