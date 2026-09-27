'use client';

export type ViewMode = 'grid' | 'list';

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (value: ViewMode) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-700 bg-slate-950/70 p-1" role="group" aria-label="Pilih tampilan">
      {(['grid', 'list'] as const).map((mode) => (
        <button key={mode} type="button" onClick={() => onChange(mode)} aria-pressed={value === mode}
          title={mode === 'grid' ? 'Grid view' : 'List view'} aria-label={mode === 'grid' ? 'Grid view' : 'List view'}
          className={`rounded-lg p-1.5 transition-colors ${value === mode ? 'bg-indigo-500 text-white shadow-sm' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
          {mode === 'grid' ? <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h3v6H4V6zm11-2h3a2 2 0 012 2v4h-5V4zM4 14h5v6H6a2 2 0 01-2-2v-4zm11 0h5v4a2 2 0 01-2 2h-3v-6z" /></svg> : <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      ))}
    </div>
  );
}
