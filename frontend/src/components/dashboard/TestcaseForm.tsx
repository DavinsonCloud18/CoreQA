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
  const [expectedResult, setExpectedResult] = useState(initialData?.expectedResult || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Sedang');
  const [severity, setSeverity] = useState(initialData?.severity || 'Minor');
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
      expectedResult,
      priority,
      severity,
      steps: steps.map(s => ({ sequence: s.sequence, action: s.action, expectedResult: s.expectedResult }))
    });
  };

  return (
    <div data-testid="testcase-form-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-sm overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">{initialData?.id ? 'Edit Testcase' : 'Add Testcase'}</h2>
          <button id="tc-form-close-btn" data-testid="tc-form-close-btn" onClick={onClose} className="text-white/50 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <form id="tcForm" data-testid="testcase-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tc-form-title-input" className="block text-sm font-bold text-white/70 mb-2">Testcase Name *</label>
                <input 
                  id="tc-form-title-input"
                  data-testid="tc-form-title-input"
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                  className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div>
                <label htmlFor="tc-form-module-select" className="block text-sm font-bold text-white/70 mb-2">Module *</label>
                <select 
                  id="tc-form-module-select"
                  data-testid="tc-form-module-select"
                  value={moduleId} 
                  onChange={e => setModuleId(e.target.value)} 
                  required 
                  disabled={!!initialData?.id} // Cannot change module on edit
                  className={`w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!!initialData?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="" disabled>Select Module</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.code} - {m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tc-form-priority-select" className="block text-sm font-bold text-white/70 mb-2">Priority</label>
                <div className="relative">
                  <select 
                    id="tc-form-priority-select"
                    data-testid="tc-form-priority-select"
                    value={priority} 
                    onChange={e => setPriority(e.target.value)} 
                    className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7-7-7-7"></path></svg>
                </div>
              </div>
              
              <div>
                <label htmlFor="tc-form-severity-select" className="block text-sm font-bold text-white/70 mb-2">Severity</label>
                <div className="relative">
                  <select 
                    id="tc-form-severity-select"
                    data-testid="tc-form-severity-select"
                    value={severity} 
                    onChange={e => setSeverity(e.target.value)} 
                    className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7-7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="tc-form-description-input" className="block text-sm font-bold text-white/70 mb-2">Description</label>
              <textarea 
                id="tc-form-description-input"
                data-testid="tc-form-description-input"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={2} 
                className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>

            <div className="border-t border-slate-800 pt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-white/70">Test Steps</label>
                <button 
                  id="tc-form-add-step-btn"
                  data-testid="tc-form-add-step-btn"
                  type="button" 
                  onClick={handleAddStep} 
                  className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold hover:bg-indigo-500/30 transition-colors"
                >
                  + Add Step
                </button>
              </div>
              
              <div data-testid="tc-form-steps-container" className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} data-testid={`tc-form-step-item-${idx}`} className="flex gap-4 items-start bg-slate-800 p-4 rounded-xl border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white/50 shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <input 
                        id={`tc-form-step-action-${idx}`}
                        data-testid={`tc-form-step-action-${idx}`}
                        type="text" 
                        placeholder="Action" 
                        required
                        value={step.action} 
                        onChange={e => handleStepChange(idx, 'action', e.target.value)} 
                        className="w-full bg-black/30 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                      />
                      <input 
                        id={`tc-form-step-expected-${idx}`}
                        data-testid={`tc-form-step-expected-${idx}`}
                        type="text" 
                        placeholder="Expected Result" 
                        required
                        value={step.expectedResult} 
                        onChange={e => handleStepChange(idx, 'expectedResult', e.target.value)} 
                        className="w-full bg-black/30 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                      />
                    </div>
                    <button 
                      id={`tc-form-step-remove-btn-${idx}`}
                      data-testid={`tc-form-step-remove-btn-${idx}`}
                      type="button" 
                      onClick={() => handleRemoveStep(idx)} 
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
                {steps.length === 0 && (
                  <div data-testid="tc-form-no-steps" className="text-center p-6 border border-dashed border-slate-700 rounded-xl text-white/40 text-sm">
                    No steps added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <label htmlFor="tc-form-expected-result-input" className="block text-sm font-bold text-white/70 mb-2">Final Expected Result</label>
              <textarea 
                id="tc-form-expected-result-input"
                data-testid="tc-form-expected-result-input"
                value={expectedResult} 
                onChange={e => setExpectedResult(e.target.value)} 
                rows={2} 
                className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
          <button 
            id="tc-form-cancel-btn"
            data-testid="tc-form-cancel-btn"
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            id="tc-form-submit-btn"
            data-testid="tc-form-submit-btn"
            type="submit" 
            form="tcForm" 
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-sm hover:">
            Save Testcase
          </button>
        </div>
      </div>
    </div>
  );
}
