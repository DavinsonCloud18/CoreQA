'use client';

import { useState, useEffect } from 'react';

export function ImportExportTC() {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [sessionModuleIds, setSessionModuleIds] = useState<string[] | null>(null);
  
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    message: string;
    errors: {row: number, message: string}[];
  }>({ isOpen: false, type: 'success', message: '', errors: [] });

  useEffect(() => {
    if (activeTab === 'export') {
      fetchModulesAndSessions();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedSessionId) {
      fetchSessionModules(selectedSessionId);
    } else {
      setSessionModuleIds(null);
    }
  }, [selectedSessionId]);

  const fetchModulesAndSessions = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 'Authorization': `Bearer ${authData.access_token}` };
      
      const [mRes, sRes] = await Promise.all([
        fetch(`${baseUrl}/modules?limit=1000`, { headers }), // get all modules for export
        fetch(`${baseUrl}/sessions`, { headers })
      ]);
      
      if (mRes.ok) setModules((await mRes.json()).data || []);
      if (sRes.ok) setSessions((await sRes.json()).data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSessionModules = async (sessionId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${baseUrl}/sessions/${sessionId}/modules`, {
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessionModuleIds(data.data.map((sm: any) => sm.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10 MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Silakan pilih file terlebih dahulu.');
      return;
    }
    
    setIsUploading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${baseUrl}/testcases/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.access_token}`
        },
        body: formData
      });

      const result = await res.json();
      if (res.ok) {
        setResultModal({
          isOpen: true,
          type: 'success',
          message: `Berhasil import ${result.data?.importedCount || 0} test cases.`,
          errors: []
        });
        setFile(null);
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          setResultModal({
            isOpen: true,
            type: 'error',
            message: 'Gagal melakukan import. Ditemukan error pada baris-baris berikut:',
            errors: result.errors
          });
        } else {
          setResultModal({
            isOpen: true,
            type: 'error',
            message: `Gagal import: ${result.message || 'Terjadi kesalahan'}`,
            errors: []
          });
        }
      }
    } catch (e: any) {
      setResultModal({
        isOpen: true,
        type: 'error',
        message: 'Gagal mengunggah file. Pastikan server aktif.',
        errors: []
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter(m => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleExport = async () => {
    if (selectedModules.length === 0) {
      alert('Pilih setidaknya satu modul untuk diexport.');
      return;
    }

    setIsExporting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');

      const res = await fetch(`${baseUrl}/testcases/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moduleIds: selectedModules })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Gagal export: ${errorData.message || 'Terjadi kesalahan'}`);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Testcases_Export.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setResultModal({
        isOpen: true,
        type: 'success',
        message: 'Berhasil melakukan export data testcase.',
        errors: []
      });
    } catch (e: any) {
      setResultModal({
        isOpen: true,
        type: 'error',
        message: 'Gagal melakukan export.',
        errors: []
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
      

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('import')} className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'import' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>Import</button>
          <button onClick={() => setActiveTab('export')} className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'export' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>Export</button>
        </div>
      </div>

      <div className="relative z-10">
        {activeTab === 'import' && (
          <div className="w-full mx-auto">
            <h2 className="text-3xl font-black text-white mb-6">Import Test Case</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Contoh Format Excel (Baris Pertama)</h3>
              <div className="overflow-x-auto border border-slate-700 rounded-xl bg-slate-800">
                <table className="w-full text-xs text-left text-white/80">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3 border-r border-slate-800">TC ID</th>
                      <th className="px-4 py-3 border-r border-slate-800">Modul ID</th>
                      <th className="px-4 py-3 border-r border-slate-800">Title</th>
                      <th className="px-4 py-3 border-r border-slate-800">Description</th>
                      <th className="px-4 py-3 border-r border-slate-800">Precondition</th>
                      <th className="px-4 py-3 border-r border-slate-800">Expected Result</th>
                      <th className="px-4 py-3 border-r border-slate-800">Priority</th>
                      <th className="px-4 py-3 border-r border-slate-800">Severity</th>
                      <th className="px-4 py-3 border-r border-slate-800">Action</th>
                      <th className="px-4 py-3">Step Expected Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="px-4 py-3 border-r border-slate-800">TC-001</td>
                      <td className="px-4 py-3 border-r border-slate-800">MDL-01</td>
                      <td className="px-4 py-3 border-r border-slate-800">Login Berhasil</td>
                      <td className="px-4 py-3 border-r border-slate-800">Menguji login dengan kredensial valid</td>
                      <td className="px-4 py-3 border-r border-slate-800">User telah terdaftar dan berada di halaman login</td>
                      <td className="px-4 py-3 border-r border-slate-800">Berhasil masuk ke dashboard utama</td>
                      <td className="px-4 py-3 border-r border-slate-800">High</td>
                      <td className="px-4 py-3 border-r border-slate-800">Critical</td>
                      <td className="px-4 py-3 border-r border-slate-800">Buka aplikasi dan masukkan email</td>
                      <td className="px-4 py-3">Halaman login terbuka dan email terisi</td>
                    </tr>
                    <tr className="border-b border-slate-800 bg-white/5">
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800 text-white/30 italic">-</td>
                      <td className="px-4 py-3 border-r border-slate-800">Masukkan password dan klik submit</td>
                      <td className="px-4 py-3">Password terisi dan loading selesai</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center mb-6 hover:bg-black/30 transition-colors group">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              
              <label className="cursor-pointer bg-indigo-600 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-xl shadow-sm  mb-4">
                {file ? file.name : 'Pilih File'}
                <input type="file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
              </label>

              <p className="text-white/60 font-medium mb-1">xlsx only</p>
              <p className="text-white/40 text-sm mb-4">Ukuran file maksimal 10 MB</p>
              <p className="text-indigo-200/80 text-sm italic font-medium mb-4">Gunakan format yang telah disediakan</p>
              
              <a href="/Template Testcase.xlsx" download className="text-cyan-400 hover:text-cyan-300 underline font-bold transition-colors">
                Unduh Template
              </a>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6">
              <h4 className="text-rose-300 font-bold mb-2">Informasi Tambahan</h4>
              <p className="text-rose-200/70 text-sm">- Format kolom tidak boleh diubah</p>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleImport}
                disabled={isUploading || !file}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-sm "
              >
                {isUploading ? 'Mengunggah...' : 'Import Data'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="w-full mx-auto">
            <h2 className="text-3xl font-black text-white mb-6">Export Test Case</h2>
            <p className="text-white/60 mb-8">Pilih modul yang ingin di-export. Setiap modul akan dibuatkan sheet terpisah di dalam file Excel.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Cari modul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex-1 sm:max-w-xs relative">
                <button
                  type="button"
                  onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                  className="w-full text-left bg-slate-800 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedSessionId 
                      ? sessions.find(s => s.id === selectedSessionId)?.name || 'Session Terpilih' 
                      : 'Semua Session'}
                  </span>
                  <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                {isSessionDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-2 border-b border-slate-800 bg-slate-800">
                      <input 
                        type="text"
                        placeholder="Cari session..."
                        value={sessionSearchQuery}
                        onChange={(e) => setSessionSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                      <li 
                        className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-indigo-500/20 ${!selectedSessionId ? 'bg-indigo-500/10 text-indigo-300' : 'text-white'}`}
                        onClick={() => { setSelectedSessionId(''); setIsSessionDropdownOpen(false); setSessionSearchQuery(''); }}
                      >
                        Semua Session
                      </li>
                      {sessions
                        .filter(s => s.name.toLowerCase().includes(sessionSearchQuery.toLowerCase()))
                        .map(s => (
                        <li 
                          key={s.id}
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-indigo-500/20 truncate ${selectedSessionId === s.id ? 'bg-indigo-500/10 text-indigo-300 font-bold' : 'text-white'}`}
                          onClick={() => { setSelectedSessionId(s.id); setIsSessionDropdownOpen(false); setSessionSearchQuery(''); }}
                        >
                          {s.name}
                        </li>
                      ))}
                      {sessions.filter(s => s.name.toLowerCase().includes(sessionSearchQuery.toLowerCase())).length === 0 && (
                        <li className="px-4 py-3 text-sm text-white/50 text-center italic">Session tidak ditemukan</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-800 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                {modules
                  .filter(m => sessionModuleIds ? sessionModuleIds.includes(m.id) : true)
                  .filter(m => (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.code.toLowerCase().includes(searchQuery.toLowerCase())))
                  .map(mod => (
                  <label key={mod.id} className="flex items-center gap-3 p-4 border border-slate-800 bg-white/5 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                      checked={selectedModules.includes(mod.id)}
                      onChange={() => toggleModule(mod.id)}
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{mod.name}</span>
                      <span className="text-xs text-white/40">{mod.code}</span>
                    </div>
                  </label>
                ))}
                {modules.length === 0 && (
                  <p className="text-white/40 italic col-span-3 text-center py-4">Belum ada modul yang tersedia.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleExport}
                disabled={isExporting || selectedModules.length === 0}
                className="bg-indigo-600 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-sm "
              >
                {isExporting ? 'Mengekspor...' : 'Export Terpilih'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {resultModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4   ">
          <div className="bg-[#0f1117] border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-sm relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${resultModal.type === 'success' ? 'from-emerald-500 to-emerald-400' : 'from-rose-500 to-rose-400'}`}></div>
            
            <div className="flex items-center gap-4 mb-4 shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${resultModal.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                {resultModal.type === 'success' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {resultModal.type === 'success' ? 'Berhasil!' : 'Gagal!'}
                </h3>
                <p className="text-sm text-white/60 mt-0.5">{resultModal.message}</p>
              </div>
            </div>

            {resultModal.errors && resultModal.errors.length > 0 && (
              <div className="flex-1 overflow-y-auto min-h-0 bg-rose-950/20 border border-rose-900/30 rounded-xl p-4 mb-6">
                <ul className="space-y-3">
                  {Object.entries(resultModal.errors.reduce((acc, curr) => {
                    if (!acc[curr.message]) acc[curr.message] = [];
                    acc[curr.message].push(curr.row);
                    return acc;
                  }, {} as Record<string, number[]>)).map(([msg, rows], i) => (
                    <li key={i} className="text-rose-200 text-sm flex flex-col gap-2 bg-rose-950/40 p-3 rounded-lg border border-rose-900/50">
                      <span className="font-semibold leading-snug">{msg}</span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-xs text-rose-400 font-medium mr-1">Baris:</span>
                        {rows.slice(0, 20).map(r => (
                          <span key={r} className="bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300 text-xs">{r}</span>
                        ))}
                        {rows.length > 20 && (
                          <span className="bg-rose-500/10 px-1.5 py-0.5 rounded text-rose-400/80 text-xs italic">...dan {rows.length - 20} lainnya</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end shrink-0 mt-4">
              <button 
                onClick={() => setResultModal({ ...resultModal, isOpen: false })}
                className="px-6 py-2.5 bg-slate-900 hover:bg-white/20 text-white rounded-xl font-bold  text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
