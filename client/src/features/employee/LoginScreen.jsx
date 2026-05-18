// src/features/employee/LoginScreen.jsx
import { useState } from 'react';
import axios from 'axios';
import { API_AUTH_BASE } from '../../config/api';

export function LoginScreen({ onLogin }) {
  const [userId,   setUserId]   = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_AUTH_BASE}/login`,
        { userId: userId.trim(), password },
        { withCredentials: true }
      );
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Check your User ID and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex items-center justify-center overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-violet-600/5 blur-[130px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-fuchsia-600/10 to-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
            <span className="text-white font-black text-xl tracking-wider">AQ</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">AtomQuest</h1>
          <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mt-1">Performance Tracking Engine</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-2 border-b border-slate-800/60">
            <h2 className="text-lg font-bold text-white">Sign in to your workspace</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User ID</label>
              <input
                type="text" required autoComplete="username" autoFocus
                placeholder="e.g. EMP101"
                value={userId} onChange={e => { setUserId(e.target.value); setError(''); }}
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono placeholder:text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="Enter password"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors text-sm cursor-pointer select-none">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <span className="text-rose-400 text-base">❌</span>
                <p className="text-xs text-rose-400 font-medium">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] cursor-pointer">
              {loading ? 'Authenticating…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
