const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const helper = `
function renderWorkingDays(days: number) {
  if (days < 0) {
    return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-rose-600/30 text-rose-300 border border-rose-500/40 shadow-[0_0_8px_rgba(225,29,72,0.3)]">{Math.abs(days)} Working Days Overdue</span>;
  } else if (days <= 2) {
    return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_5px_rgba(225,29,72,0.2)]">{days} Working Days Left</span>;
  } else if (days <= 5) {
    return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_5px_rgba(245,158,11,0.2)]">{days} Working Days Left</span>;
  }
  return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{days} Working Days Left</span>;
}
`;

content = content.replace(/export default async function GlobalDashboardPage/, helper + '\nexport default async function GlobalDashboardPage');

const regex1 = /const days = getWorkingDaysLeft\(session\.endDate\);\s*if \(days < 0\) \{\s*return <span[^>]*>\{Math\.abs\(days\)\} Working Days Overdue<\/span>;\s*\}\s*return <span[^>]*>\{days\} Working Days Left<\/span>;/s;
content = content.replace(regex1, 'return renderWorkingDays(getWorkingDaysLeft(session.endDate));');

const regex2 = /const days = getWorkingDaysLeft\(s\.endDate\);\s*if \(days < 0\) \{\s*return <span[^>]*>\{Math\.abs\(days\)\} Working Days Overdue<\/span>;\s*\}\s*return <span[^>]*>\{days\} Working Days Left<\/span>;/s;
content = content.replace(regex2, 'return renderWorkingDays(getWorkingDaysLeft(s.endDate));');

// Change grid-cols-1 lg:grid-cols-2 to grid-cols-1 lg:grid-cols-12
content = content.replace(/<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">/, '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">');
// Update the sections inside it
content = content.replace(/<section className="bg-slate-900  border border-slate-700 p-8 rounded-\[2rem\] shadow-sm relative overflow-hidden flex flex-col items-center justify-center">/, '<section className="lg:col-span-5 bg-slate-900  border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col items-center justify-center">');
content = content.replace(/<section className="bg-slate-900  border border-slate-700 p-8 rounded-\[2rem\] shadow-sm relative overflow-hidden">/, '<section className="lg:col-span-7 bg-slate-900  border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">');


fs.writeFileSync(file, content, 'utf8');
console.log('updated page.tsx');
