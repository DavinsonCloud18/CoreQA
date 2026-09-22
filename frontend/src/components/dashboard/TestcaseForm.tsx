'use client';

import { useState, useEffect } from 'react';

export function TestcaseForm({ 
  initialData, 
  modules, 
  onSave, 
  onClose 
}: { 
  initialData?: any, 
  modules: any[], 
  onSave: (data: any) => void, 
  onClose: () => void 
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [moduleId, setModuleId] = useState(initialData?.moduleId || (modules[0]?.id || ''));
  const [description, setDescription] = useState(initialData?.description || '');
  const [precondition, setPrecondition] = useState(initialData?.precondition || '');
  const [expectedResult, setExpectedResult] = useState(initialData?.expectedResult || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Medium');
  const [steps, setSteps] = useState<any[]>(initialData?.steps || []);

  const handleAddStep = () => {
    setSteps([...steps, { sequence: steps.length + 1, action: '', expectedResult: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    // Re-sequence
    newSteps.forEach((s, i) => s.sequence = i + 1);
    setSteps(newSteps);
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({
      title,
      moduleId,
      description,
      precondition,
      expectedResult,
      priority,
      steps: steps.map(s => ({ sequence: s.sequence, action: s.action, expectedResult: s.expectedResult }))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Testcase' : 'Add Testcase'}</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <form id="tcForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Testcase Name *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Module *</label>
                <select 
                  value={moduleId} 
                  onChange={e => setModuleId(e.target.value)} 
                  required 
                  disabled={!!initialData} // Cannot change module on edit
                  className={`w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!!initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="" disabled>Select Module</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.code} - {m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Priority</label>
                <select 
                  value={priority} 
                  onChange={e => setPriority(e.target.value)} 
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">Precondition</label>
              <textarea 
                value={precondition} 
                onChange={e => setPrecondition(e.target.value)} 
                rows={2} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={2} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-white/70">Test Steps</label>
                <button type="button" onClick={handleAddStep} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold hover:bg-indigo-500/30 transition-colors">
                  + Add Step
                </button>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/50 shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <input 
                        type="text" 
                        placeholder="Action" 
                        required
                        value={step.action} 
                        onChange={e => handleStepChange(idx, 'action', e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                      />
                      <input 
                        type="text" 
                        placeholder="Expected Result" 
                        required
                        value={step.expectedResult} 
                        onChange={e => handleStepChange(idx, 'expectedResult', e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                      />
                    </div>
                    <button type="button" onClick={() => handleRemoveStep(idx)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
                {steps.length === 0 && (
                  <div className="text-center p-6 border border-dashed border-white/20 rounded-xl text-white/40 text-sm">
                    No steps added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-bold text-white/70 mb-2">Final Expected Result</label>
              <textarea 
                value={expectedResult} 
                onChange={e => setExpectedResult(e.target.value)} 
                rows={2} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" form="tcForm" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg hover:shadow-indigo-500/50">
            Save Testcase
          </button>
        </div>
      </div>
    </div>
  );
}
