const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/sessions/[sessionId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const displayDates = `
          {data?.session && (
             <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 px-6 py-4 rounded-[2rem] shadow-sm">
                <div className="flex-1">
                   <h2 className="text-xl font-bold text-white">{data.session.name}</h2>
                   <div className="flex items-center gap-2 mt-2">
                     <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                       Start: {new Date(data.session.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                     </span>
                     {data.session.endDate && (
                       <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                         End: {new Date(data.session.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                       </span>
                     )}
                     <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                       {data.session.status}
                     </span>
                   </div>
                </div>
             </div>
          )}
          <SummaryCards summary={data.summary} />
`;

content = content.replace(/<SummaryCards summary=\{data\.summary\} \/>/, displayDates);

fs.writeFileSync(file, content, 'utf8');
console.log('Session detail page updated');
