const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldBtn = `<button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 mb-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-sm  hover:  "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Session
        </button>`;

const newBtn = `{currentUser?.role !== 'QA Member' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 mb-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-sm  hover:bg-indigo-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Session
        </button>
        )}`;

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Sidebar updated');
} else {
  console.log('Could not find New Session button in Sidebar');
}
