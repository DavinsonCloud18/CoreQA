const fs = require('fs');

const frontendFile = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/TrashManagement.tsx';
let content = fs.readFileSync(frontendFile, 'utf8');

const targetButtons = `        <div className="text-sm text-white/70">
          <span className="font-bold text-white">{selectedIds.length}</span> item(s) selected
        </div>
        <button 
          onClick={handleRestore}
          disabled={selectedIds.length === 0}
          className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Restore Selected
        </button>`;

const replacementButtons = `        <div className="text-sm text-white/70">
          <span className="font-bold text-white">{selectedIds.length}</span> item(s) selected
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePermanentDelete}
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
          </button>
        </div>`;

content = content.replace(targetButtons, replacementButtons);

const targetFn = `  const handleRestore = async () => {`;

const replacementFn = `  const handlePermanentDelete = async () => {
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
  };

  const handleRestore = async () => {`;

content = content.replace(targetFn, replacementFn);

fs.writeFileSync(frontendFile, content, 'utf8');
console.log('UI updated');
