const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/TrashManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// The outer div has: className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden"
// We will change it to just "relative"
content = content.replace('className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden"', 'className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative"');

// And to be absolutely safe that the modal is on top and clickable, we can move the modal OUTSIDE the container using a Fragment
const returnTarget = `  return (
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative">`;

const returnReplacement = `  return (
    <>
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative">`;

content = content.replace(returnTarget, returnReplacement);

const endTarget = `      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">`;

// Wait, the modal HTML is currently at the bottom inside the div
content = content.replace('      {isDeleteModalOpen && (', '    </div>\n      {isDeleteModalOpen && (');
content = content.replace('      )}\n    </div>\n  );\n}', '      )}\n    </>\n  );\n}');

// Let's make sure z-index is super high just in case
content = content.replace('z-50', 'z-[9999]');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed clipping and z-index issues');
