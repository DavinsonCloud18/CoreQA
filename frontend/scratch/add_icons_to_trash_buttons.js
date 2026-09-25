const fs = require('fs');

const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/TrashManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetButtons = `<button 
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold hover:bg-rose-600/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Permanently Delete
          </button>
          <button 
            onClick={handleRestore}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Restore Selected
          </button>`;

const replacementButtons = `<button 
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold hover:bg-rose-600/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Permanently Delete
          </button>
          <button 
            onClick={handleRestore}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Restore Selected
          </button>`;

content = content.replace(targetButtons, replacementButtons);
fs.writeFileSync(file, content, 'utf8');
console.log('Icons added');
