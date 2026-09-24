const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variables
content = content.replace(
  "const [moduleToDelete, setModuleToDelete] = useState<any>(null);",
  "const [moduleToDelete, setModuleToDelete] = useState<any>(null);\n  const [sortBy, setSortBy] = useState('createdAt');\n  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');"
);

// 2. Update useEffect dependency
content = content.replace(
  "}, [searchQuery, page]);",
  "}, [searchQuery, page, sortBy, sortOrder]);"
);

// 3. Update fetchData
content = content.replace(
  "const res = await fetch(`${baseUrl}/modules?page=${page}&limit=12&search=${encodeURIComponent(searchQuery)}`, {",
  "const res = await fetch(`${baseUrl}/modules?page=${page}&limit=12&search=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {"
);

// 4. Add handleSort
const handleSortStr = `
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <svg className="w-4 h-4 opacity-0 group-hover:opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>;
    if (sortOrder === 'asc') return <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>;
    return <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
  };
`;
content = content.replace(
  "const fetchData = async () => {",
  handleSortStr + "\n  const fetchData = async () => {"
);

// 5. Update table headers
const oldThead = `            <thead>
              <tr className="border-b border-slate-800 bg-white/5">
                <th className="py-4 px-6 text-indigo-200 font-semibold w-16 text-center">No</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-32">Code</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold">Name</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-1/4">Description</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold text-center w-32">Jumlah Testcase</th>
                {canEdit && <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Actions</th>}
              </tr>
            </thead>`;

const newThead = `            <thead>
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
            
content = content.replace(oldThead, newThead);

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
