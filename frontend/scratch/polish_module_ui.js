const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// The new sorting logic to render the exact header from SessionsTable
const sortHeaderLogic = `  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <svg className="w-3 h-3 text-slate-600 group-hover:text-slate-500 transition-colors" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L10 5.414 6.707 8.707a1 1 0 01-1.414-1.414l4-4A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 14.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 17z" clipRule="evenodd" /></svg>;
    if (sortOrder === 'asc') return <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
    return <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
  };

  const SortHeader = ({ label, sortKey, align = 'left' }: { label: string, sortKey: string, align?: 'left' | 'center' }) => {
    return (
      <th 
        className={\`py-4 px-6 text-indigo-200 font-semibold cursor-pointer hover:bg-slate-700/50 transition-colors select-none group \${align === 'center' ? 'text-center' : 'text-left'}\`}
        onClick={() => handleSort(sortKey)}
      >
        <div className={\`flex items-center gap-2 \${align === 'center' ? 'justify-center' : ''}\`}>
          {label}
          <div className="flex flex-col items-center">
            {renderSortIcon(sortKey)}
          </div>
        </div>
      </th>
    );
  };`;

// Find the old renderSortIcon logic
content = content.replace(/const renderSortIcon = \(field: string\) => \{[\s\S]*?\};\n/g, '');
content = content.replace(/const handleSort = \(field: string\) => \{[\s\S]*?\}\s*\};/g, `const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };\n\n${sortHeaderLogic}`);

// Replace the container and search bar
const oldSearchBarContainer = `<div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col gap-6">
      
      
      <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-indigo-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-black/30 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-800 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
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

const newSearchBarContainer = `<div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col gap-6">
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-72">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={\`p-1.5 rounded-lg transition-colors \${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}\`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={\`p-1.5 rounded-lg transition-colors \${viewMode === 'list' ? 'bg-indigo-500 text-white shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}\`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
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
        </div>
      </div>`;
content = content.replace(oldSearchBarContainer, newSearchBarContainer);

// Replace the table wrapping div and headers
const oldTableWrapper = `<div className="overflow-x-auto bg-slate-800 border border-slate-800 rounded-2xl shadow-sm relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-white/5 select-none">
                <th className="py-4 px-6 text-indigo-200 font-semibold w-16 text-center">No</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-32 cursor-pointer hover:text-indigo-100 group transition-colors" onClick={() => handleSort('code')}>
                  <div className="flex items-center gap-1">Code {renderSortIcon('code')}</div>
                </th>
                <th className="py-4 px-6 text-indigo-200 font-semibold cursor-pointer hover:text-indigo-100 group transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Name {renderSortIcon('name')}</div>
                </th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-1/4 cursor-pointer hover:text-indigo-100 group transition-colors" onClick={() => handleSort('description')}>
                  <div className="flex items-center gap-1">Description {renderSortIcon('description')}</div>
                </th>
                <th className="py-4 px-6 text-indigo-200 font-semibold text-center w-36 cursor-pointer hover:text-indigo-100 group transition-colors" onClick={() => handleSort('testcaseCount')}>
                  <div className="flex items-center justify-center gap-1">Jumlah Testcase {renderSortIcon('testcaseCount')}</div>
                </th>
                {canEdit && <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Actions</th>}
              </tr>
            </thead>`;
            
const newTableWrapper = `<div className="relative z-10 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="py-4 px-6 text-indigo-200 font-semibold w-16 text-center">No</th>
                <SortHeader label="Code" sortKey="code" />
                <SortHeader label="Name" sortKey="name" />
                <SortHeader label="Description" sortKey="description" />
                <SortHeader label="Jumlah Testcase" sortKey="testcaseCount" align="center" />
                {canEdit && <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Actions</th>}
              </tr>
            </thead>`;
content = content.replace(oldTableWrapper, newTableWrapper);

// Fix tr hover colors
const oldTr = `                  <tr 
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className="border-b border-slate-800 hover:bg-white/5 cursor-pointer transition-colors"
                  >`;
const newTr = `                  <tr 
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className="border-b border-slate-800/50 hover:bg-white/5 cursor-pointer transition-colors group"
                  >`;
content = content.replace(/<tr\s+key=\{mod\.id\}[\s\S]*?className="border-b border-slate-800 hover:bg-white\/5 cursor-pointer transition-colors"\s*>/g, newTr);

fs.writeFileSync(file, content, 'utf8');
console.log('Final polish complete');
