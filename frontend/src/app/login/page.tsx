"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // const [email, setEmail] = useState('qa1@coreqa.com');
  // const [password, setPassword] = useState('CoreQA_2026!Sec');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.message || 'Login failed');
      }

      document.cookie = `coreqa_token=${json.data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
      localStorage.setItem('auth', JSON.stringify(json.data));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-lg">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">CoreQA</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Masuk untuk mengelola test execution</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder="you@coreqa.com"
              autoComplete="off"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.52A10.48 10.48 0 0 0 2.25 12c1.5 3.5 5.25 6 9.75 6a10.48 10.48 0 0 0 5.77-1.73M6.23 6.23A10.45 10.45 0 0 1 12 4c4.5 0 8.25 2.5 9.75 6a10.5 10.5 0 0 1-2.16 3.45M3 3l18 18M9.88 9.88A3 3 0 0 0 14.12 14.12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 12c1.5-3.5 5.25-6 9.75-6s8.25 2.5 9.75 6c-1.5 3.5-5.25 6-9.75 6s-8.25-2.5-9.75-6Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 transition-colors"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-slate-600 text-xs font-semibold tracking-wide uppercase">
          Secure QA Orchestration Platform
        </div>
      </div>
    </div>
  );
}
