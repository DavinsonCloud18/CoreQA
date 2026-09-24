const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the top level container and the search bar area
const oldTop = `    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
      
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 gap-4">
        <div className="flex-1 w-full relative">`;

const newTop = `    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col gap-6">
      
      
      <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">`;
        
content = content.replace(oldTop, newTop);

// 2. Fix the view mode / filters toggle
const oldViewToggle = `        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={\`p-2 rounded-lg transition-colors \${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}\`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={\`p-2 rounded-lg transition-colors \${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}\`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
          {canEdit && (
            <button 
              onClick={() => openForm()}
              className="px-5 py-2.5 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:  text-sm whitespace-nowrap"
            >
              + Add Module
            </button>
          )}
        </div>
      </div>`;

const newViewToggle = `        <div className="flex items-center gap-2 bg-slate-800 border border-slate-800 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
          <div className="pl-3 pr-2 flex items-center gap-2 text-indigo-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            <span className="text-sm font-semibold hidden md:block">View Filter</span>
          </div>
          
          <button
            onClick={() => setViewMode('grid')}
            className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border \${viewMode === 'grid' ? 'bg-indigo-500 border-indigo-400 text-white shadow-sm' : 'bg-black/30 border-slate-700 text-white/70 hover:text-white hover:bg-white/5'}\`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border \${viewMode === 'list' ? 'bg-indigo-500 border-indigo-400 text-white shadow-sm' : 'bg-black/30 border-slate-700 text-white/70 hover:text-white hover:bg-white/5'}\`}
          >
            List
          </button>
        </div>

        {canEdit && (
          <button 
            onClick={() => openForm()}
            className="px-5 py-2.5 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:bg-indigo-500 text-sm whitespace-nowrap transition-colors"
          >
            + Add Module
          </button>
        )}
      </div>`;

content = content.replace(oldViewToggle, newViewToggle);

// 3. Fix the table wrapper
const oldTableWrapper = `<div className="relative z-10 bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden mb-8">`;
const newTableWrapper = `<div className="overflow-x-auto bg-slate-800 border border-slate-800 rounded-2xl shadow-sm relative z-10">`;
content = content.replace(oldTableWrapper, newTableWrapper);

// 4. Fix grid wrapper mb-8
const oldGridWrapper = `<div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">`;
const newGridWrapper = `<div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">`;
content = content.replace(oldGridWrapper, newGridWrapper);


fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
