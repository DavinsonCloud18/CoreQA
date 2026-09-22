'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function ExecutionTable({ sessionId, sessionStatus }: { sessionId: string, sessionStatus?: string }) {
  const [testcases, setTestcases] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const isSessionLocked = sessionStatus === 'Finished';
  
  const searchParams = useSearchParams();
  const initialModuleId = searchParams.get('moduleId') || '';
  
  const [filterModuleId, setFilterModuleId] = useState(initialModuleId);
  const [filterStatusId, setFilterStatusId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notesModal, setNotesModal] = useState<{
    isOpen: boolean;
    type: 'TESTCASE' | 'STEP';
    testcaseId: string;
    stepId?: string;
    statusId: number;
    notes: string;
  }>({ isOpen: false, type: 'TESTCASE', testcaseId: '', statusId: 0, notes: '' });
  const [restrictionModal, setRestrictionModal] = useState<{isOpen: boolean, message: string}>({ isOpen: false, message: '' });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      setCurrentUser(JSON.parse(authData).user);
    }
      
    // Fetch filter data
    const authStr = JSON.parse(localStorage.getItem('auth') || '{}');
    const headers = { 'Authorization': `Bearer ${authStr.access_token}` };
    
    Promise.all([
      fetch(`${baseUrl}/sessions/${sessionId}/modules`, { headers, cache: 'no-store' }).then(res => res.json()),
      fetch(`${baseUrl}/master/statuses`, { headers, cache: 'no-store' }).then(res => res.json())
    ]).then(([modData, statData]) => {
      setModules(modData.data || []);
      setStatuses(statData.data || []);
    });
  }, [sessionId]);

  useEffect(() => {
    fetchTestcases();
  }, [sessionId, filterModuleId, filterStatusId]);

  const fetchTestcases = async () => {
    let url = `${baseUrl}/sessions/${sessionId}/testcases?limit=100`;
    if (filterModuleId) url += `&moduleId=${filterModuleId}`;
    if (filterStatusId) url += `&statusId=${filterStatusId}`;
    
    try {
      const authStr = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 'Authorization': `Bearer ${authStr.access_token}` };
      const res = await fetch(url, { headers, cache: 'no-store' });
      const json = await res.json();
      setTestcases(json.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const submitStatusUpdate = async (type: 'TESTCASE' | 'STEP', tcId: string, stepId: string | undefined, statusId: number, notes: string) => {
    if (!currentUser) return alert("User data not loaded yet. Please try again.");

    const url = type === 'TESTCASE' 
      ? `${baseUrl}/sessions/${sessionId}/testcases/${tcId}/status`
      : `${baseUrl}/sessions/${sessionId}/testcases/${tcId}/steps/${stepId}/status`;

    try {
      const authStr = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStr.access_token}`
        },
        body: JSON.stringify({ statusId, notes, userId: currentUser.id })
      });
      
      if (res.ok) {
        fetchTestcases();
        setNotesModal(prev => ({ ...prev, isOpen: false }));
      } else {
        const err = await res.json();
        if (res.status === 400 && err.message?.toLowerCase().includes('claim')) {
          setRestrictionModal({ isOpen: true, message: err.message });
        } else {
          alert(err.message || 'Failed to update status');
        }
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while updating status');
    }
  };

  const handleStatusChange = async (tc: any, statusId: number, currentStatusId: number) => {
    if (statusId === currentStatusId) return;

    // Check frontend claim
    const claim = tc.testcase?.module?.claimHistories?.find((c: any) => c.sessionId === sessionId);
    if (!claim || claim.claimedById !== currentUser?.id) {
      setRestrictionModal({ 
        isOpen: true, 
        message: !claim ? 'Module harus di-claim sebelum testcase dapat dieksekusi.' : 'Hanya user yang melakukan claim pada module ini yang dapat mengeksekusi testcase-nya.'
      });
      return;
    }

    const status = statuses.find(s => s.id === statusId);
    if (status && ['PASSED WITH NOTES', 'FAILED', 'DROPPED'].includes(status.name.toUpperCase())) {
      setNotesModal({
        isOpen: true,
        type: 'TESTCASE',
        testcaseId: tc.testcaseId,
        statusId,
        notes: ''
      });
      return;
    }

    await submitStatusUpdate('TESTCASE', tc.testcaseId, undefined, statusId, '');
  };

  const handleStepStatusChange = async (tc: any, stepId: string, statusId: number, currentStatusId: number) => {
    if (statusId === currentStatusId) return;

    // Check frontend claim
    const claim = tc.testcase?.module?.claimHistories?.find((c: any) => c.sessionId === sessionId);
    if (!claim || claim.claimedById !== currentUser?.id) {
      setRestrictionModal({ 
        isOpen: true, 
        message: !claim ? 'Module harus di-claim sebelum testcase dapat dieksekusi.' : 'Hanya user yang melakukan claim pada module ini yang dapat mengeksekusi testcase-nya.'
      });
      return;
    }

    const status = statuses.find(s => s.id === statusId);
    if (status && ['PASSED WITH NOTES', 'FAILED', 'DROPPED'].includes(status.name.toUpperCase())) {
      setNotesModal({
        isOpen: true,
        type: 'STEP',
        testcaseId: tc.testcaseId,
        stepId,
        statusId,
        notes: ''
      });
      return;
    }

    await submitStatusUpdate('STEP', tc.testcaseId, stepId, statusId, '');
  };

  const getUniqueTcId = (tc: any) => {
    const moduleCode = tc.testcase?.module?.code || 'MOD';
    const seq = String(tc.testcase?.sequence || 0).padStart(3, '0');
    return `${moduleCode}-${seq}`;
  };

  const filteredTestcases = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return testcases;
    
    return testcases.filter((tc: any) => 
      tc.testcase.title.toLowerCase().includes(query) || 
      getUniqueTcId(tc).toLowerCase().includes(query)
    );
  }, [testcases, searchQuery]);

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-indigo-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search testcase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-black/20 border border-white/10 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
          <div className="pl-3 pr-2 flex items-center gap-2 text-indigo-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            <span className="text-sm font-semibold hidden md:block">Filters</span>
          </div>
          <select 
            value={filterModuleId}
            onChange={(e) => setFilterModuleId(e.target.value)}
            className="bg-black/30 border border-white/20 rounded-lg px-4 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none min-w-[150px] text-sm"
          >
            <option value="" className="bg-slate-900">All Modules</option>
            {modules.map(m => (
              <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>
            ))}
          </select>
          <select 
            value={filterStatusId}
            onChange={(e) => setFilterStatusId(e.target.value)}
            className="bg-black/30 border border-white/20 rounded-lg px-4 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none min-w-[150px] text-sm"
          >
            <option value="" className="bg-slate-900">All Statuses</option>
            {statuses.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-black/20 border border-white/10 rounded-2xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-4 px-6 text-indigo-200 font-semibold w-32">TC ID</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold">Title</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold w-1/3">Expected Result</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold w-48">Status</th>
              <th className="py-4 px-6 text-indigo-200 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestcases.map((tc: any) => (
              <Fragment key={tc.id}>
                <tr 
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${expandedRowId === tc.id ? 'bg-white/5' : ''}`}
                  onClick={() => toggleRow(tc.id)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <svg className={`w-4 h-4 text-indigo-400 transition-transform ${expandedRowId === tc.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                      <div>
                        <div className="font-bold text-white whitespace-nowrap">{getUniqueTcId(tc)}</div>
                        <div className="text-xs text-indigo-300/50 font-mono mt-1" title="Unique Execution ID">#{tc.id.substring(0, 6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{tc.testcase.title}</div>
                    {tc.testcase.description && <div className="text-sm text-indigo-200/70 mt-1">{tc.testcase.description}</div>}
                  </td>
                  <td className="py-4 px-6 text-white/80 text-sm">{tc.testcase.expectedResult}</td>
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={tc.statusId}
                      onChange={(e) => handleStatusChange(tc, Number(e.target.value), tc.statusId)}
                      disabled={isSessionLocked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-slate-900 ${
                        tc.status.name.toUpperCase() === 'PASSED' ? 'border-emerald-500/50 text-emerald-400' :
                        tc.status.name.toUpperCase() === 'FAILED' ? 'border-rose-500/50 text-rose-400' :
                        tc.status.name.toUpperCase() === 'PASSED WITH NOTES' ? 'border-amber-500/50 text-amber-400' :
                        tc.status.name.toUpperCase() === 'BLOCKED' ? 'border-slate-500/50 text-slate-400' :
                        tc.status.name.toUpperCase() === 'DROPPED' ? 'border-zinc-500/50 text-zinc-400' :
                        'border-white/20 text-white/70'
                      }`}
                    >
                      {statuses.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-white/70 text-sm max-w-[200px] truncate" title={tc.notes}>
                    {tc.notes || '-'}
                  </td>
                </tr>
                {expandedRowId === tc.id && (
                  <tr className="bg-black/40 border-b border-white/10">
                    <td colSpan={5} className="p-0">
                      <div className="p-6 m-4 ml-12 rounded-xl border border-indigo-500/20 bg-indigo-950/20 shadow-inner ">
                        <h4 className="text-indigo-200 font-bold mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                          Test Steps
                        </h4>
                        {tc.testcase.steps?.length > 0 ? (
                          <ul className="border border-indigo-500/20 rounded-lg overflow-hidden bg-black/20">
                            <li className="grid grid-cols-12 gap-4 p-2.5 border-b border-indigo-500/20 bg-indigo-500/10 text-indigo-200 text-[11px] font-bold uppercase tracking-wider">
                              <div className="col-span-1 text-center">Step</div>
                              <div className="col-span-5">Action</div>
                              <div className="col-span-4">Expected Result</div>
                              <div className="col-span-2 text-center">Status</div>
                            </li>
                            {tc.testcase.steps.map((step: any, index: number) => {
                              const stepExec = tc.stepExecutions?.find((se: any) => se.stepId === step.id);
                              const stepStatusId = stepExec?.statusId || statuses.find(s => s.name === 'TO DO')?.id || '';
                              const stepStatusName = stepExec?.status?.name || 'TO DO';

                              return (
                                <li key={step.id} className={`grid grid-cols-12 gap-4 p-3 items-center hover:bg-white/5 transition-colors ${index !== tc.testcase.steps.length - 1 ? 'border-b border-white/5' : ''}`}>
                                  <div className="col-span-1 flex justify-center">
                                    <div className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono">
                                      {step.sequence}
                                    </div>
                                  </div>
                                  <div className="col-span-5 text-white/90 text-sm leading-snug">{step.action}</div>
                                  <div className="col-span-4 text-emerald-300/80 text-sm leading-snug">{step.expectedResult}</div>
                                  <div className="col-span-2 flex justify-center">
                                    <select
                                      value={stepStatusId}
                                      onChange={(e) => handleStepStatusChange(tc, step.id, Number(e.target.value), stepStatusId)}
                                      disabled={isSessionLocked}
                                      className={`px-2 py-1 rounded-md text-[10px] font-bold border cursor-pointer focus:outline-none appearance-none bg-slate-900 w-full text-center ${
                                        stepStatusName.toUpperCase() === 'PASSED' ? 'border-emerald-500/50 text-emerald-400' :
                                        stepStatusName.toUpperCase() === 'FAILED' ? 'border-rose-500/50 text-rose-400' :
                                        stepStatusName.toUpperCase() === 'PASSED WITH NOTES' ? 'border-amber-500/50 text-amber-400' :
                                        stepStatusName.toUpperCase() === 'BLOCKED' ? 'border-slate-500/50 text-slate-400' :
                                        stepStatusName.toUpperCase() === 'DROPPED' ? 'border-zinc-500/50 text-zinc-400' :
                                        'border-white/20 text-white/70'
                                      }`}
                                    >
                                      {statuses.map(s => (
                                        <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <div className="text-white/40 text-sm flex items-center justify-center py-6 italic bg-white/5 rounded-xl border border-white/5">
                            No detailed steps have been defined for this testcase.
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filteredTestcases.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-white/50 bg-white/5">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>No testcases found matching your criteria.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes Modal */}
      {notesModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl relative overflow-hidden">
            {/* Dynamic Styling based on Status */}
            {(() => {
              const statusName = statuses.find(s => s.id === notesModal.statusId)?.name?.toUpperCase() || '';
              const isFailed = statusName === 'FAILED';
              const isDropped = statusName === 'DROPPED';
              const gradientClass = isFailed ? 'from-rose-500 to-rose-400' : (isDropped ? 'from-zinc-500 to-zinc-400' : 'from-amber-500 to-amber-400');
              const ringClass = isFailed ? 'focus:ring-rose-500/50' : (isDropped ? 'focus:ring-zinc-500/50' : 'focus:ring-amber-500/50');
              const btnClass = isFailed ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]' : (isDropped ? 'bg-zinc-500 hover:bg-zinc-400 text-white shadow-[0_0_15px_rgba(113,113,122,0.2)]' : 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]');
              const badgeClass = isFailed ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : (isDropped ? 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30');

              return (
                <>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass}`}></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-white">Add Notes</h3>
                    <span className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold border ${badgeClass}`}>
                      {statusName}
                    </span>
                  </div>

                  <textarea
                    value={notesModal.notes}
                    onChange={(e) => setNotesModal({ ...notesModal, notes: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        submitStatusUpdate(notesModal.type, notesModal.testcaseId, notesModal.stepId, notesModal.statusId, notesModal.notes);
                      }
                    }}
                    placeholder="Optional details (Cmd/Ctrl + Enter to save)..."
                    className={`w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 resize-none transition-all ${ringClass}`}
                    autoFocus
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => setNotesModal({ ...notesModal, isOpen: false })}
                      className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => submitStatusUpdate(notesModal.type, notesModal.testcaseId, notesModal.stepId, notesModal.statusId, notesModal.notes)}
                      className={`px-5 py-2 rounded-lg font-bold transition-all text-sm ${btnClass}`}
                    >
                      Save
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Restriction Modal */}
      {restrictionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f1117] border border-rose-500/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400"></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Access Denied</h3>
                <p className="text-sm text-rose-200/70 mt-0.5">Claim Restriction</p>
              </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-6 bg-rose-950/20 p-4 rounded-xl border border-rose-900/30">
              {restrictionModal.message}
            </p>

            <div className="flex justify-end">
              <button 
                onClick={() => setRestrictionModal({ isOpen: false, message: '' })}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
