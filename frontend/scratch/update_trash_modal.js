const fs = require('fs');

const frontendFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/TrashManagement.tsx';
let content = fs.readFileSync(frontendFile, 'utf8');

// Add modal state
const stateTarget = `  const [isLoading, setIsLoading] = useState(false);`;
const stateReplacement = `  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);`;

content = content.replace(stateTarget, stateReplacement);

// Change handlePermanentDelete
const fnTarget = `  const handlePermanentDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm('Are you absolutely sure? This action will permanently erase the selected data and cannot be undone.')) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(\`\${baseUrl}/trash/delete-permanent\`, {
        method: 'PUT',
        headers: { 
          'Authorization': \`Bearer \${authData.access_token}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: activeTab, ids: selectedIds })
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        alert(\`Failed to delete: \${json.message}\`);
      } else {
        fetchTrashData();
      }
    } catch (err) {
      alert('An error occurred during deletion');
    }
  };`;

const fnReplacement = `  const executePermanentDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(\`\${baseUrl}/trash/delete-permanent\`, {
        method: 'PUT',
        headers: { 
          'Authorization': \`Bearer \${authData.access_token}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: activeTab, ids: selectedIds })
      });
      
      if (res.ok) {
        fetchTrashData();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };`;

content = content.replace(fnTarget, fnReplacement);

// Update button onClick
const btnTarget = `onClick={handlePermanentDelete}`;
const btnReplacement = `onClick={() => setIsDeleteModalOpen(true)}`;
content = content.replace(btnTarget, btnReplacement);

// Import createPortal if not imported
if (!content.includes('createPortal')) {
  content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");
}

// Add modal HTML at the end
const endTarget = `    </div>\n  );\n}\n`;

const modalHtml = `
      {isDeleteModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl shadow-rose-900/20 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-rose-500/20">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white text-center mb-2 tracking-tight">Permanently Delete?</h3>
            <p className="text-slate-400 text-center mb-8 font-medium leading-relaxed">
              You are about to permanently delete <strong className="text-rose-400">{selectedIds.length} item(s)</strong>. This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={executePermanentDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
`;

content = content.replace(endTarget, modalHtml + endTarget);

fs.writeFileSync(frontendFile, content, 'utf8');
console.log('Modal added to TrashManagement');
