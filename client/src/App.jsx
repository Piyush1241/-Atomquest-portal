import { useState, useCallback } from 'react';
import axios from 'axios';

// ─── Toast Notification System ──────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium backdrop-blur-xl
            transition-all duration-300 pointer-events-auto
            ${t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
            : t.type === 'error'   ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
            : t.type === 'warn'    ? 'bg-amber-950/90 border-amber-500/30 text-amber-300'
            : 'bg-slate-900/90 border-slate-700 text-slate-300'}`}>
          <span className="text-base flex-shrink-0">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warn' ? '⚠️' : 'ℹ️'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };
  return { toasts, toast };
}

// ─── User Credentials Config ─────────────────────────────────
const USERS = [
  { id: 'EMP101',  password: 'emp123',   role: 'Employee', name: 'Piyush',          label: 'Employee Environment',    icon: '💼' },
  { id: 'MGR555',  password: 'mgr123',   role: 'Manager',  name: 'Sarah Mitchell',  label: 'Executive L1 Dashboard',  icon: '🛡️' },
  { id: 'ADMIN01', password: 'admin123', role: 'Admin',    name: 'System Admin',    label: 'System Administrator',    icon: '⚙️' },
];

// Known employees for admin to assign shared goals to
const KNOWN_EMPLOYEES = [
  { id: 'EMP101', name: 'Piyush' },
];

// ─── Login Screen ─────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [userId, setUserId]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const user = USERS.find(u => u.id === userId.trim() && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Check your User ID and password.');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/20 to-violet-600/5 blur-[130px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-fuchsia-600/10 to-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
            <span className="text-white font-black text-xl tracking-wider">AQ</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">AtomQuest</h1>
          <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mt-1">Performance Tracking Engine</p>
        </div>

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

// ─── Progress Score Calculator ───────────────────────────────
function computeScore(uom, target, actual) {
  if (actual === null || actual === undefined || actual === '') return null;
  const isMax = uom.endsWith('-max');
  const baseUom = isMax ? uom.replace('-max', '') : uom;
  if (baseUom === 'Timeline') {
    const targetDate = new Date(target);
    const actualDate = new Date(actual);
    if (isNaN(targetDate) || isNaN(actualDate)) return null;
    const diffDays = Math.round((actualDate - targetDate) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0)  return 100;
    if (diffDays <= 7)  return 80;
    if (diffDays <= 30) return 50;
    return 0;
  }
  const t = parseFloat(target);
  const a = parseFloat(actual);
  if (isNaN(t) || isNaN(a)) return null;
  switch (baseUom) {
    case '%':
    case 'Numeric':
      if (isMax) { if (a === 0) return 100; return Math.min(100, Math.round((t / a) * 100)); }
      return Math.min(100, Math.round((a / t) * 100));
    case 'Zero-based':
      return a === 0 ? 100 : 0;
    default:
      return null;
  }
}

function ScoreBadge({ score }) {
  if (score === null) return <span className="text-slate-600 text-[10px]">—</span>;
  const color = score >= 90 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : score >= 70 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${color}`}>
      {score}%
    </span>
  );
}

// ─── Pure SVG Donut Chart ────────────────────────────────────
function DonutChart({ data, size = 110, innerR = 28, outerR = 44 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2;
  const slices = data.reduce((acc, d, i) => {
    let angle = -Math.PI / 2 + data.slice(0, i).reduce((sum, prev) => sum + (prev.value / total) * 2 * Math.PI * 0.97 + 0.03, 0);
    const sweep = (d.value / total) * 2 * Math.PI * 0.97;
    const x1 = cx + outerR * Math.cos(angle); const y1 = cy + outerR * Math.sin(angle);
    angle += sweep;
    const x2 = cx + outerR * Math.cos(angle); const y2 = cy + outerR * Math.sin(angle);
    const ix1 = cx + innerR * Math.cos(angle); const iy1 = cy + innerR * Math.sin(angle);
    angle -= sweep;
    const ix2 = cx + innerR * Math.cos(angle); const iy2 = cy + innerR * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return [...acc, { path: `M${x1},${y1} A${outerR},${outerR},0,${large},1,${x2},${y2} L${ix1},${iy1} A${innerR},${innerR},0,${large},0,${ix2},${iy2} Z`, color: d.color }];
  }, []);
  return (
    <svg width={size} height={size}>
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
    </svg>
  );
}

// ─── Pure SVG Bar Chart ──────────────────────────────────────
function BarChartSVG({ data, width = 220, height = 110 }) {
  const padL = 24, padB = 22, padT = 6, padR = 6;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const barW = Math.min(32, (chartW / data.length) - 6);
  const barColor = (s) => s >= 90 ? '#10b981' : s >= 70 ? '#f59e0b' : '#f43f5e';
  return (
    <svg width={width} height={height}>
      {[0, 25, 50, 75, 100].map(v => {
        const y = padT + chartH - (v / 100) * chartH;
        return <g key={v}>
          <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 3} y={y + 3} textAnchor="end" fontSize={8} fill="#475569">{v}</text>
        </g>;
      })}
      {data.map((d, i) => {
        const x = padL + (chartW / data.length) * i + (chartW / data.length - barW) / 2;
        const barH = (d.score / 100) * chartH;
        const y = padT + chartH - barH;
        return <g key={i}>
          <rect x={x} y={y} width={barW} height={barH} fill={barColor(d.score)} rx={3} />
          <text x={x + barW / 2} y={height - padB + 12} textAnchor="middle" fontSize={8} fill="#64748b">
            {d.name.length > 7 ? d.name.slice(0, 7) + '…' : d.name}
          </text>
          <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize={8} fill={barColor(d.score)} fontWeight="bold">
            {d.score}%
          </text>
        </g>;
      })}
    </svg>
  );
}

// ─── Analytics: Employee Sheet Charts ────────────────────────
function SheetAnalytics({ sheet }) {
  const barData = sheet.goals.map(g => ({
    name: g.title.length > 14 ? g.title.slice(0, 14) + '…' : g.title,
    score: computeScore(g.uom, g.target, g.actualAchievement),
    weight: g.weightage,
  })).filter(d => d.score !== null);

  const totalWeight = barData.reduce((s, d) => s + d.weight, 0);
  const weightedScore = totalWeight > 0
    ? Math.round(barData.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight)
    : null;

  const statusCounts = { 'Not Started': 0, 'On Track': 0, 'Completed': 0 };
  sheet.goals.forEach(g => { statusCounts[g.goalStatus || 'Not Started']++; });
  const pieData = [
    { name: 'Not Started', value: statusCounts['Not Started'], color: '#475569' },
    { name: 'On Track',    value: statusCounts['On Track'],    color: '#f59e0b' },
    { name: 'Completed',   value: statusCounts['Completed'],   color: '#10b981' },
  ].filter(d => d.value > 0);

  const scoreColor = weightedScore === null ? '#64748b'
    : weightedScore >= 90 ? '#10b981'
    : weightedScore >= 70 ? '#f59e0b' : '#f43f5e';

  if (barData.length === 0) {
    return (
      <div className="px-6 pb-6 border-t border-slate-800 pt-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">📊 Analytics</p>
        <p className="text-xs text-slate-600 italic">Log achievements to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 border-t border-slate-800 pt-5">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">📊 Performance Analytics</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Score</p>
          <div className="text-4xl font-black font-mono" style={{ color: scoreColor }}>{weightedScore}%</div>
          <p className="text-[10px] text-slate-600 mt-1">weighted avg</p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${weightedScore}%`, backgroundColor: scoreColor }} />
          </div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Goal Scores</p>
          <BarChartSVG data={barData} width={220} height={110} />
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Split</p>
          <div className="flex items-center gap-3">
            <DonutChart data={pieData} size={90} innerR={26} outerR={42} />
            <div className="flex flex-col gap-1.5">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-[9px] text-slate-500">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  {d.name}: <span className="font-bold text-slate-300">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics: Manager Team Overview ────────────────────────
function TeamAnalytics({ sheets }) {
  const approved = sheets.filter(s => s.status === 'Approved');
  if (approved.length === 0) return null;

  const empData = approved.map(sheet => {
    const scored = sheet.goals
      .map(g => ({ score: computeScore(g.uom, g.target, g.actualAchievement), weight: g.weightage }))
      .filter(d => d.score !== null);
    const totalW = scored.reduce((s, d) => s + d.weight, 0);
    const ws = totalW > 0 ? Math.round(scored.reduce((s, d) => s + d.score * d.weight, 0) / totalW) : null;
    return { name: sheet.employeeName.split(' ')[0], score: ws };
  }).filter(d => d.score !== null);

  const statusCounts = { 'Not Started': 0, 'On Track': 0, 'Completed': 0 };
  approved.forEach(sheet => {
    sheet.goals.forEach(g => { statusCounts[g.goalStatus || 'Not Started']++; });
  });
  const pieData = [
    { name: 'Not Started', value: statusCounts['Not Started'], color: '#475569' },
    { name: 'On Track',    value: statusCounts['On Track'],    color: '#f59e0b' },
    { name: 'Completed',   value: statusCounts['Completed'],   color: '#10b981' },
  ].filter(d => d.value > 0);

  if (empData.length === 0 && pieData.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
          📊 Team Analytics
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">Performance Overview</h2>
        <p className="text-xs text-slate-400 mt-0.5">Aggregated across all approved goal sheets.</p>
      </div>
      <div className="p-6 grid grid-cols-2 gap-6">
        {empData.length > 0 && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Employee Scores (Weighted)</p>
            <BarChartSVG data={empData} width={340} height={160} />
          </div>
        )}
        {pieData.length > 0 && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Team Goal Status</p>
            <div className="flex items-center gap-4">
              <DonutChart data={pieData} size={130} innerR={38} outerR={60} />
              <div className="flex flex-col gap-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="font-medium">{d.name}</span>
                    <span className="font-bold font-mono text-slate-300 ml-2">{d.value}</span>
                  </div>
                ))}
                <div className="mt-1 pt-2 border-t border-slate-800 text-[10px] text-slate-600">
                  Total goals: {pieData.reduce((s, d) => s + d.value, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ['Not Started', 'On Track', 'Completed'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const UOM_OPTIONS = [
  { value: '%',           label: '% (Higher is better)' },
  { value: '%-max',       label: '% (Lower is better)' },
  { value: 'Numeric',     label: 'Numeric (Higher is better)' },
  { value: 'Numeric-max', label: 'Numeric (Lower is better)' },
  { value: 'Timeline',    label: 'Timeline / Date' },
  { value: 'Zero-based',  label: 'Binary (0/1)' },
];

function safeComments(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out = {};
  for (const q of QUARTERS) {
    const v = raw[q];
    if (typeof v === 'string' && v.trim()) out[q] = v;
  }
  return out;
}

// ─── Shared Goals: Employee KPI Section ─────────────────────
function SharedGoalEmployeeSection({ sharedGoals, employeeId, onRefresh, toast }) {
  const SG_API = "https://atomquest-portal-944z.onrender.com/api/shared-goals";
  const [inputs, setInputs] = useState({});
  const [openGoal, setOpenGoal] = useState(null);
  const [saving, setSaving] = useState({});

  const getInput = (goalId, field) => {
    const sg = sharedGoals.find(g => g._id === goalId);
    const defaultVal = field === 'actual' ? (sg?.assignment?.actualAchievement ?? '') : (sg?.assignment?.goalStatus ?? 'Not Started');
    return inputs[goalId]?.[field] ?? defaultVal;
  };

  const setInput = (goalId, field, value) => {
    setInputs(prev => ({ ...prev, [goalId]: { ...prev[goalId], [field]: value } }));
  };

  const saveCheckin = async (goalId) => {
    setSaving(prev => ({ ...prev, [goalId]: true }));
    try {
      await axios.put(`${SG_API}/checkin/${goalId}/${employeeId}`, {
        actualAchievement: getInput(goalId, 'actual'),
        goalStatus: getInput(goalId, 'status'),
      });
      toast('Shared goal check-in saved.', 'success');
      setOpenGoal(null);
      onRefresh();
    } catch {
      toast('Failed to save shared goal check-in.', 'error');
    } finally {
      setSaving(prev => ({ ...prev, [goalId]: false }));
    }
  };

  if (sharedGoals.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-3">
          🌐 Organisation-Wide KPIs
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">Shared Goals</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          KPIs assigned to you by the admin. Log your actual achievement for each.
        </p>
      </div>

      <div className="p-6 space-y-4">
        {sharedGoals.map(sg => {
          const isOpen = openGoal === sg._id;
          const actual = getInput(sg._id, 'actual');
          const status = getInput(sg._id, 'status');
          const score = computeScore(sg.uom, sg.target, actual);

          return (
            <div key={sg._id} className="bg-slate-900/50 border border-fuchsia-900/30 rounded-xl overflow-hidden">
              <div className="bg-slate-950/60 px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <div>
                  <p className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">{sg.thrustArea}</p>
                  <h3 className="font-bold text-white mt-0.5">{sg.title}</h3>
                  {sg.description && <p className="text-[10px] text-slate-500 mt-0.5 italic">{sg.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded font-mono">{sg.cycleYear}</span>
                  <button
                    onClick={() => setOpenGoal(isOpen ? null : sg._id)}
                    className="bg-fuchsia-600/15 hover:bg-fuchsia-600/25 border border-fuchsia-500/30 text-fuchsia-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                    {isOpen ? '✕ Close' : '📝 Log Achievement'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <th className="p-3 text-center">UoM</th>
                      <th className="p-3 text-right">Target</th>
                      <th className="p-3 text-right">Actual</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/30">
                    <tr>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-medium text-slate-400 text-[10px]">{sg.uom}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-300">{sg.target}</td>
                      <td className="p-3 text-right">
                        {isOpen ? (
                          <input type="text" placeholder="Enter actual"
                            value={actual}
                            onChange={e => setInput(sg._id, 'actual', e.target.value)}
                            className="w-28 px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-fuchsia-500 outline-none font-mono text-right" />
                        ) : (
                          <span className="font-mono font-bold text-slate-300">
                            {actual !== '' ? actual : <span className="text-slate-600">—</span>}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center"><ScoreBadge score={score} /></td>
                      <td className="p-3 text-center">
                        {isOpen ? (
                          <select value={status} onChange={e => setInput(sg._id, 'status', e.target.value)}
                            className="px-2 py-1.5 border border-slate-700 rounded-md text-[10px] bg-slate-900 text-slate-300 focus:border-fuchsia-500 outline-none cursor-pointer">
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                            status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : status === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-slate-500 bg-slate-800 border-slate-700'
                          }`}>{status}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {isOpen && (
                  <div className="flex justify-end mt-3">
                    <button onClick={() => saveCheckin(sg._id)} disabled={saving[sg._id]}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 cursor-pointer">
                      💾 {saving[sg._id] ? 'Saving…' : 'Save Achievement'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shared Goals: Manager Read-only Section ─────────────────
function SharedGoalManagerSection({ sharedGoals }) {
  if (sharedGoals.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-2">
          🌐 Organisation-Wide KPIs
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">Shared Goals — Team Progress</h2>
        <p className="text-xs text-slate-400 mt-0.5">Read-only view of KPIs pushed by admin to your team.</p>
      </div>

      <div className="p-6 space-y-4">
        {sharedGoals.map(sg => (
          <div key={sg._id} className="bg-slate-900/50 border border-fuchsia-900/20 rounded-xl overflow-hidden">
            <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded">{sg.thrustArea}</span>
                <h3 className="font-bold text-white text-sm">{sg.title}</h3>
                <span className="ml-auto text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{sg.cycleYear}</span>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-2.5">Employee</th>
                    <th className="p-2.5 text-center">UoM</th>
                    <th className="p-2.5 text-right">Target</th>
                    <th className="p-2.5 text-right">Actual</th>
                    <th className="p-2.5 text-center">Score</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-center">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                  {sg.assignments.map(a => {
                    const score = computeScore(sg.uom, sg.target, a.actualAchievement);
                    return (
                      <tr key={a.employeeId} className="hover:bg-slate-800/20">
                        <td className="p-2.5 font-semibold text-slate-300">
                          <div>{a.employeeName}</div>
                          <div className="text-[10px] font-mono text-slate-600">{a.employeeId}</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-500 text-[10px]">{sg.uom}</span>
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-300">{sg.target}</td>
                        <td className="p-2.5 text-right font-mono text-slate-300">
                          {a.actualAchievement !== null && a.actualAchievement !== undefined && a.actualAchievement !== ''
                            ? a.actualAchievement : <span className="text-slate-700">—</span>}
                        </td>
                        <td className="p-2.5 text-center"><ScoreBadge score={score} /></td>
                        <td className="p-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                            a.goalStatus === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : a.goalStatus === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-slate-500 bg-slate-800 border-slate-700'
                          }`}>{a.goalStatus || 'Not Started'}</span>
                        </td>
                        <td className="p-2.5 text-center font-mono text-slate-600 text-[10px]">
                          {a.lastUpdated ? new Date(a.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Goals: Admin Push Section ────────────────────────
function SharedGoalAdminSection({ sharedGoals, adminId, adminName, onRefresh, toast }) {
  const SG_API = "https://atomquest-portal-944z.onrender.com/api/shared-goals";

  const [form, setForm] = useState({
    title: '', description: '', thrustArea: '', uom: '%', target: '', cycleYear: new Date().getFullYear().toString()
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [pushing, setPushing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleEmployee = (emp) => {
    setSelectedEmployees(prev =>
      prev.find(e => e.id === emp.id)
        ? prev.filter(e => e.id !== emp.id)
        : [...prev, emp]
    );
  };

  const handlePush = async () => {
    if (!form.title.trim() || !form.thrustArea.trim() || !form.target.toString().trim()) {
      toast('Fill in all required fields.', 'warn'); return;
    }
    if (selectedEmployees.length === 0) {
      toast('Select at least one employee to assign.', 'warn'); return;
    }
    setPushing(true);
    try {
      await axios.post(`${SG_API}/push`, {
        ...form,
        createdBy: adminId,
        createdByName: adminName,
        assignees: selectedEmployees.map(e => ({ employeeId: e.id, employeeName: e.name }))
      });
      toast(`Shared goal pushed to ${selectedEmployees.length} employee(s).`, 'success');
      setForm({ title: '', description: '', thrustArea: '', uom: '%', target: '', cycleYear: new Date().getFullYear().toString() });
      setSelectedEmployees([]);
      setShowForm(false);
      onRefresh();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to push shared goal.', 'error');
    } finally {
      setPushing(false);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('Delete this shared goal? All employee assignments will be removed.')) return;
    try {
      await axios.delete(`${SG_API}/${goalId}`);
      toast('Shared goal deleted.', 'success');
      onRefresh();
    } catch {
      toast('Failed to delete shared goal.', 'error');
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent flex justify-between items-start">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-2">
            🌐 Organisation-Wide KPIs
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">Shared Goals Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Push KPIs to employees across the organisation.</p>
        </div>
        <button onClick={() => setShowForm(f => !f)}
          className={`text-[10px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${
            showForm
              ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              : 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 border-transparent text-white shadow-md shadow-fuchsia-500/20'
          }`}>
          {showForm ? '✕ Cancel' : '➕ Push New KPI'}
        </button>
      </div>

      {/* Push Form */}
      {showForm && (
        <div className="p-6 border-b border-slate-800/60 bg-slate-950/30">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Thrust Area *</label>
              <input type="text" placeholder="e.g. Revenue Growth"
                value={form.thrustArea}
                onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Goal Title *</label>
              <input type="text" placeholder="e.g. Q2 Customer Satisfaction Score"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <input type="text" placeholder="Optional details"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cycle Year *</label>
              <input type="text" placeholder="e.g. 2025"
                value={form.cycleYear}
                onChange={e => setForm(f => ({ ...f, cycleYear: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 focus:border-fuchsia-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit of Measure *</label>
              <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-300 focus:border-fuchsia-500 outline-none cursor-pointer transition-all">
                {UOM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Value *</label>
              <input type="text" placeholder="e.g. 4.5"
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-700 font-mono focus:border-fuchsia-500 outline-none transition-all" />
            </div>
          </div>

          {/* Employee Selector */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assign To *</label>
            <div className="flex flex-wrap gap-2">
              {KNOWN_EMPLOYEES.map(emp => {
                const selected = !!selectedEmployees.find(e => e.id === emp.id);
                return (
                  <button key={emp.id} onClick={() => toggleEmployee(emp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-fuchsia-500/30 hover:text-fuchsia-400'
                    }`}>
                    {selected ? '✓ ' : ''}{emp.name} <span className="font-mono opacity-60">({emp.id})</span>
                  </button>
                );
              })}
            </div>
            {selectedEmployees.length > 0 && (
              <p className="text-[10px] text-fuchsia-400 mt-1.5">
                {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button onClick={handlePush} disabled={pushing}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 cursor-pointer">
              🚀 {pushing ? 'Pushing…' : 'Push KPI to Employees'}
            </button>
          </div>
        </div>
      )}

      {/* Existing Shared Goals List */}
      <div className="p-6">
        {sharedGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
            <div className="text-3xl mb-3">🌐</div>
            <p className="text-sm font-bold text-slate-400 mb-1">No shared goals yet</p>
            <p className="text-xs text-slate-600">Use the "Push New KPI" button to assign organisation-wide goals.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedGoals.map(sg => (
              <div key={sg._id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">{sg.thrustArea}</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">{sg.title}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Cycle: {sg.cycleYear} • UoM: {sg.uom} • Target: {sg.target} • Pushed by: {sg.createdByName}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(sg._id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                    🗑️ Delete
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                        <th className="p-2.5">Employee</th>
                        <th className="p-2.5 text-right">Actual</th>
                        <th className="p-2.5 text-center">Score</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-center">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                      {sg.assignments.map(a => {
                        const score = computeScore(sg.uom, sg.target, a.actualAchievement);
                        return (
                          <tr key={a.employeeId} className="hover:bg-slate-800/20">
                            <td className="p-2.5">
                              <div className="font-semibold text-slate-300">{a.employeeName}</div>
                              <div className="text-[10px] font-mono text-slate-600">{a.employeeId}</div>
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">
                              {a.actualAchievement !== null && a.actualAchievement !== undefined && a.actualAchievement !== ''
                                ? a.actualAchievement : <span className="text-slate-700">—</span>}
                            </td>
                            <td className="p-2.5 text-center"><ScoreBadge score={score} /></td>
                            <td className="p-2.5 text-center">
                              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                                a.goalStatus === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : a.goalStatus === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-slate-500 bg-slate-800 border-slate-700'
                              }`}>{a.goalStatus || 'Not Started'}</span>
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-600 text-[10px]">
                              {a.lastUpdated ? new Date(a.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
function App() {
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentRole, setCurrentRole]   = useState('Employee');

  const currentEmployeeId = loggedInUser?.role === 'Employee' ? loggedInUser.id : 'EMP101';
  const currentManagerId  = loggedInUser?.role === 'Manager'  ? loggedInUser.id : 'MGR555';

  const [goals, setGoals] = useState([
    { thrustArea: '', title: '', description: '', uom: '%', target: '', weightage: 10 }
  ]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const [approvedSheets, setApprovedSheets] = useState([]);
  const [achievementInputs, setAchievementInputs] = useState({});
  const [checkinFeedback, setCheckinFeedback] = useState({});
  const [activeCheckinSheet, setActiveCheckinSheet] = useState(null);

  const [pendingSheets, setPendingSheets] = useState([]);
  const [editingSheets, setEditingSheets] = useState({});
  const [editModeActive, setEditModeActive] = useState({});
  const [managerComments, setManagerComments] = useState({});
  const [activeCommentSheet, setActiveCommentSheet] = useState(null);

  // ── Admin State ────────────────────────────────────────────
  const [adminSheets, setAdminSheets] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [adminFilter, setAdminFilter] = useState('All');

  // ── Shared Goals State ────────────────────────────────────
  const [sharedGoals, setSharedGoals] = useState([]);         // employee view (shaped)
  const [sharedGoalsAdmin, setSharedGoalsAdmin] = useState([]); // admin view (full docs)
  const [sharedGoalsManager, setSharedGoalsManager] = useState([]); // manager view (full docs)

  const { toasts, toast } = useToast();
  const API_BASE    = "https://atomquest-portal-944z.onrender.com/api/goals";
  const SG_API_BASE = "https://atomquest-portal-944z.onrender.com/api/shared-goals";

  // ── Auth Handlers ──────────────────────────────────────────
  const handleLogin = (user) => {
    setLoggedInUser(user);
    setCurrentRole(user.role);
    setIsLoggedIn(true);
    if (user.role === 'Employee') { fetchEmployeeSheets(); fetchSharedGoalsEmployee(user.id); }
    else if (user.role === 'Manager') { fetchManagerData(); fetchSharedGoalsManager(); }
    else if (user.role === 'Admin') { fetchAdminData(); fetchSharedGoalsAdmin(); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setCurrentRole('Employee');
    setSharedGoals([]);
    setSharedGoalsAdmin([]);
    setSharedGoalsManager([]);
  };

  // ── Data Fetching ──────────────────────────────────────────

  const fetchEmployeeSheets = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/employee/${currentEmployeeId}`);
      const approved = res.data.filter(s => s.status === 'Approved');
      setApprovedSheets(approved);
      const inputs = {};
      approved.forEach(sheet => {
        inputs[sheet._id] = {};
        sheet.goals.forEach(g => {
          inputs[sheet._id][g._id] = {
            actual: g.actualAchievement ?? '',
            status: g.goalStatus || 'Not Started'
          };
        });
      });
      setAchievementInputs(inputs);
    } catch (err) { console.error("Error fetching employee sheets:", err); }
  }, [currentEmployeeId]);

  const fetchSharedGoalsEmployee = useCallback(async (empId) => {
    try {
      const id = empId || currentEmployeeId;
      const res = await axios.get(`${SG_API_BASE}/employee/${id}`);
      setSharedGoals(res.data);
    } catch (err) { console.error("Error fetching employee shared goals:", err); }
  }, [currentEmployeeId]);

  const fetchManagerData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/manager/${currentManagerId}`);
      setPendingSheets(res.data);
    } catch (err) { console.error("Error loading manager data:", err); }
  }, [currentManagerId]);

  const fetchSharedGoalsManager = useCallback(async () => {
    try {
      // Fetch shared goals for known employees under this manager
      const empIds = KNOWN_EMPLOYEES.map(e => e.id).join(',');
      const res = await axios.get(`${SG_API_BASE}/team?employeeIds=${empIds}`);
      setSharedGoalsManager(res.data);
    } catch (err) { console.error("Error fetching manager shared goals:", err); }
  }, []);

  const fetchAdminData = useCallback(async () => {
    setAdminLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/all`);
      setAdminSheets(res.data);
    } catch (err) { console.error("Error fetching admin data:", err); }
    finally { setAdminLoading(false); }
  }, []);

  const fetchSharedGoalsAdmin = useCallback(async () => {
    try {
      const res = await axios.get(`${SG_API_BASE}/all`);
      setSharedGoalsAdmin(res.data);
    } catch (err) { console.error("Error fetching admin shared goals:", err); }
  }, []);

  // ── Admin Actions ──────────────────────────────────────────

  const adminUnlock = async (sheetId) => {
    setAdminFeedback('');
    try {
      await axios.put(`${API_BASE}/admin/unlock/${sheetId}`);
      setAdminFeedback('unlocked');
      await fetchAdminData();
    } catch { setAdminFeedback('error'); }
  };

  const adminForceApprove = async (sheetId) => {
    setAdminFeedback('');
    try {
      await axios.put(`${API_BASE}/admin/force-approve/${sheetId}`);
      setAdminFeedback('approved');
      await fetchAdminData();
    } catch { setAdminFeedback('error'); }
  };

  const adminDelete = async (sheetId) => {
    if (!window.confirm('Permanently delete this sheet? This cannot be undone.')) return;
    setAdminFeedback('');
    try {
      await axios.delete(`${API_BASE}/admin/delete/${sheetId}`);
      setAdminFeedback('deleted');
      await fetchAdminData();
    } catch { setAdminFeedback('error'); }
  };

  // ── Employee Goal Creation ─────────────────────────────────

  const addGoalRow = () => {
    if (goals.length >= 8) { toast("Maximum 8 goals allowed.", "warn"); return; }
    setGoals([...goals, { thrustArea: '', title: '', description: '', uom: '%', target: '', weightage: 10 }]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = field === 'weightage' ? (parseInt(value, 10) || 0) : value;
    setGoals(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');
    try {
      const sanitizedGoals = goals.map(g => ({
        thrustArea: g.thrustArea, title: g.title,
        description: g.description || "", uom: g.uom || "%",
        target: g.target, weightage: Number(g.weightage) || 0
      }));
      const payload = {
        employeeId: currentEmployeeId, employeeName: loggedInUser?.name || "Piyush",
        managerId: currentManagerId, goals: sanitizedGoals
      };
      const response = await axios.post(`${API_BASE}/submit`, payload);
      setFeedbackMessage(`Success: ${response.data.message}`);
      setGoals([{ thrustArea: '', title: '', description: '', uom: '%', target: '', weightage: 10 }]);
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error;
      setFeedbackMessage(`Error: ${backendError || "Failed to establish validation pipeline contact."}`);
    }
  };

  // ── Phase 2: Achievement Tracking ─────────────────────────

  const handleAchievementChange = (sheetId, goalId, field, value) => {
    setAchievementInputs(prev => ({
      ...prev,
      [sheetId]: { ...prev[sheetId], [goalId]: { ...prev[sheetId]?.[goalId], [field]: value } }
    }));
  };

  const submitAchievements = async (sheetId, sheetGoals) => {
    setCheckinFeedback(prev => ({ ...prev, [sheetId]: '' }));
    try {
      const goalsPayload = sheetGoals.map(g => ({
        _id: g._id,
        actualAchievement: achievementInputs[sheetId]?.[g._id]?.actual ?? '',
        goalStatus: achievementInputs[sheetId]?.[g._id]?.status ?? 'Not Started'
      }));
      await axios.put(`${API_BASE}/checkin/${sheetId}`, { goals: goalsPayload });
      setCheckinFeedback(prev => ({ ...prev, [sheetId]: 'success' }));
      setActiveCheckinSheet(null);
      await fetchEmployeeSheets();
    } catch {
      setCheckinFeedback(prev => ({ ...prev, [sheetId]: 'error' }));
    }
  };

  // ── Manager Inline Edit ────────────────────────────────────

  const enterEditMode = (sheet) => {
    setEditingSheets(prev => ({ ...prev, [sheet._id]: sheet.goals.map(g => ({ ...g })) }));
    setEditModeActive(prev => ({ ...prev, [sheet._id]: true }));
  };

  const cancelEditMode = (sheetId) => setEditModeActive(prev => ({ ...prev, [sheetId]: false }));

  const handleManagerGoalEdit = (sheetId, goalIndex, field, value) => {
    setEditingSheets(prev => {
      const updated = [...prev[sheetId]];
      updated[goalIndex] = { ...updated[goalIndex], [field]: field === 'weightage' ? (parseInt(value, 10) || 0) : value };
      return { ...prev, [sheetId]: updated };
    });
  };

  const validateEditedGoals = (sheetId) => {
    const eg = editingSheets[sheetId];
    const total = eg.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);
    if (total !== 100) { toast(`Weightage must total 100%. Current: ${total}%`, "warn"); return false; }
    if (eg.some(g => Number(g.weightage) < 10)) { toast("Each goal needs at least 10% weightage.", "warn"); return false; }
    return true;
  };

  const handleManagerDecision = async (sheetId, decisionStatus) => {
    const isEditing = editModeActive[sheetId];
    if (isEditing && !validateEditedGoals(sheetId)) return;
    const sheet = pendingSheets.find(s => s._id === sheetId);
    const finalGoals = isEditing ? editingSheets[sheetId] : sheet.goals;
    try {
      await axios.put(`${API_BASE}/review/${sheetId}`, { status: decisionStatus, goals: finalGoals, actorId: loggedInUser?.id, actorName: loggedInUser?.name });
      toast(`Sheet ${decisionStatus.toLowerCase()} successfully.`, "success");
      setEditModeActive(prev => ({ ...prev, [sheetId]: false }));
      await fetchManagerData();
    } catch { toast("Failed to process decision. Try again.", "error"); }
  };

  const getEditTotal = (sheetId) => (editingSheets[sheetId] || []).reduce((sum, g) => sum + (Number(g.weightage) || 0), 0);

  // ── Manager Check-in Comments ──────────────────────────────

  const saveManagerComment = async (sheetId) => {
    const { quarter, comment } = managerComments[sheetId] || {};
    if (!quarter || !comment?.trim()) { toast("Select a quarter and enter a comment.", "warn"); return; }
    try {
      await axios.put(`${API_BASE}/manager-checkin/${sheetId}`, { quarter, comment });
      toast(`${quarter} check-in saved.`, "success");
      setActiveCommentSheet(null);
      await fetchManagerData();
    } catch { toast("Failed to save check-in comment.", "error"); }
  };

  // ── CSV Export ─────────────────────────────────────────────

  const exportToCSV = (sheet) => {
    const rows = [];
    rows.push(['Employee ID','Employee Name','Sheet Status','Thrust Area','Goal Title','Description','UoM','Target','Actual Achievement','Score (%)','Goal Status','Weightage (%)','Q1 Comment','Q2 Comment','Q3 Comment','Q4 Comment']);
    sheet.goals.forEach(g => {
      const score = computeScore(g.uom, g.target, g.actualAchievement);
      rows.push([
        sheet.employeeId, sheet.employeeName, sheet.status,
        g.thrustArea, g.title, g.description || '', g.uom, g.target,
        g.actualAchievement ?? '', score !== null ? `${score}%` : '',
        g.goalStatus || 'Not Started', `${g.weightage}%`,
        sheet.checkInComments?.Q1 || '', sheet.checkInComments?.Q2 || '',
        sheet.checkInComments?.Q3 || '', sheet.checkInComments?.Q4 || ''
      ]);
    });
    const csvContent = rows.map(row =>
      row.map(cell => {
        const val = String(cell).replace(/"/g, '""');
        return val.includes(',') || val.includes('\n') || val.includes('"') ? `"${val}"` : val;
      }).join(',')
    ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheet.employeeId}_${sheet.employeeName.replace(/\s+/g, '_')}_goals.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAllToCSV = (sheets) => {
    const rows = [];
    rows.push(['Employee ID','Employee Name','Sheet Status','Thrust Area','Goal Title','Description','UoM','Target','Actual Achievement','Score (%)','Goal Status','Weightage (%)','Q1 Comment','Q2 Comment','Q3 Comment','Q4 Comment']);
    sheets.forEach(sheet => {
      sheet.goals.forEach(g => {
        const score = computeScore(g.uom, g.target, g.actualAchievement);
        rows.push([
          sheet.employeeId, sheet.employeeName, sheet.status,
          g.thrustArea, g.title, g.description || '', g.uom, g.target,
          g.actualAchievement ?? '', score !== null ? `${score}%` : '',
          g.goalStatus || 'Not Started', `${g.weightage}%`,
          sheet.checkInComments?.Q1 || '', sheet.checkInComments?.Q2 || '',
          sheet.checkInComments?.Q3 || '', sheet.checkInComments?.Q4 || ''
        ]);
      });
    });
    const csvContent = rows.map(row =>
      row.map(cell => {
        const val = String(cell).replace(/"/g, '""');
        return val.includes(',') || val.includes('\n') || val.includes('"') ? `"${val}"` : val;
      }).join(',')
    ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atomquest_all_goals_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased font-sans overflow-x-hidden">

      <Toast toasts={toasts} />

      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-600/15 to-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-fuchsia-600/10 to-indigo-600/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-8 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-sm tracking-wider">AQ</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">AtomQuest</h1>
            <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Performance Tracking Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-900/90 pl-4 pr-4 py-2 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-base">{loggedInUser?.icon}</span>
            <div>
              <p className="text-xs font-bold text-slate-200 leading-none">{loggedInUser?.name}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{loggedInUser?.label}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-900/70 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer">
            <span>⎋</span> Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-10 space-y-8">

        {/* ══════════════════════════════════════════════
            EMPLOYEE VIEW
        ══════════════════════════════════════════════ */}
        {currentRole === 'Employee' && (
          <>
            {/* Phase 1 — Goal Creation */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
              <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                  Phase 1 — KRA Allocation
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create & Configure Goal Sheet</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Define your performance targets. Weightages must sum to exactly{' '}
                  <span className="font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">100%</span>.
                </p>
              </div>

              {feedbackMessage && (
                <div className="mx-8 mt-6">
                  <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border ${
                    feedbackMessage.startsWith('Error')
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    <span className="text-lg">{feedbackMessage.startsWith('Error') ? '❌' : '✨'}</span>
                    <span>{feedbackMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="p-8">
                <div className="overflow-hidden border border-slate-800 rounded-xl shadow-inner bg-slate-950/40 mb-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                        <th className="p-4 w-1/4">Thrust Area</th>
                        <th className="p-4 w-1/3">Goal Metric & Deliverable</th>
                        <th className="p-4 w-1/6">UoM</th>
                        <th className="p-4 w-1/6">Target Value</th>
                        <th className="p-4 w-1/12 text-center">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {goals.map((goal, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors duration-150">
                          <td className="p-3 align-top">
                            <input required type="text" placeholder="e.g., Cloud Security"
                              className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                              value={goal.thrustArea} onChange={(e) => handleInputChange(idx, 'thrustArea', e.target.value)} />
                          </td>
                          <td className="p-3 align-top">
                            <input required type="text" placeholder="Goal Title"
                              className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm font-medium bg-slate-950/50 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none mb-2"
                              value={goal.title} onChange={(e) => handleInputChange(idx, 'title', e.target.value)} />
                            <textarea rows="1" placeholder="Add operational details..."
                              className="w-full px-3 py-1.5 border border-slate-800 rounded-lg text-xs bg-slate-950/30 text-slate-400 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                              value={goal.description} onChange={(e) => handleInputChange(idx, 'description', e.target.value)} />
                          </td>
                          <td className="p-3 align-top">
                            <select className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-950/50 text-slate-300 focus:border-indigo-500 transition-all outline-none cursor-pointer"
                              value={goal.uom} onChange={(e) => handleInputChange(idx, 'uom', e.target.value)}>
                              {UOM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </td>
                          <td className="p-3 align-top">
                            <input required type="text" placeholder="e.g., 99.95"
                              className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none font-mono"
                              value={goal.target} onChange={(e) => handleInputChange(idx, 'target', e.target.value)} />
                          </td>
                          <td className="p-3 align-top">
                            <div className="flex items-center justify-center gap-1.5 bg-slate-950/80 px-2 py-2 rounded-lg border border-slate-800">
                              <input required type="number" min="10" max="100"
                                className="w-12 bg-transparent text-center text-sm font-bold text-indigo-400 font-mono outline-none"
                                value={goal.weightage} onChange={(e) => handleInputChange(idx, 'weightage', e.target.value)} />
                              <span className="text-xs font-bold text-slate-600">%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
                  <button type="button" onClick={addGoalRow}
                    className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs tracking-wide uppercase transition-all active:scale-95 cursor-pointer border border-slate-700/50">
                    ➕ Append Target Node
                  </button>
                  <button type="submit"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer">
                    🚀 Deploy Allocation Sheet
                  </button>
                </div>
              </form>
            </div>

            {/* Phase 2 — Achievement Tracking */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
              <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  Phase 2 — Achievement Tracking
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Quarterly Check-in Portal</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Log your actual achievements against approved targets. Update progress status for each goal.
                </p>
              </div>

              {approvedSheets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                  <div className="h-16 w-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-5 text-3xl">⏳</div>
                  <h3 className="font-bold text-slate-300 text-base mb-2">Awaiting Manager Approval</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">Your goal sheet has been submitted and is pending review. This portal unlocks once your manager approves it.</p>
                </div>
              ) : (
                <div className="p-8 space-y-6">
                  {approvedSheets.map(sheet => (
                    <div key={sheet._id} className="bg-slate-900/50 border border-emerald-900/30 rounded-xl overflow-hidden">

                      <div className="bg-slate-950/60 px-6 py-4 flex justify-between items-center border-b border-slate-800">
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✅ Approved Goal Sheet</p>
                          <p className="text-[10px] font-mono text-slate-600 mt-0.5">ID: {sheet._id}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {checkinFeedback[sheet._id] === 'success' && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">✅ Saved</span>
                          )}
                          {checkinFeedback[sheet._id] === 'error' && (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg">❌ Error saving</span>
                          )}
                          <button onClick={() => exportToCSV(sheet)}
                            className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                            ⬇️ Export CSV
                          </button>
                          <button
                            onClick={() => setActiveCheckinSheet(activeCheckinSheet === sheet._id ? null : sheet._id)}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                            {activeCheckinSheet === sheet._id ? '✕ Close' : '📝 Log Achievement'}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                              <th className="p-3">Thrust Area</th>
                              <th className="p-3">Goal</th>
                              <th className="p-3 text-center">UoM</th>
                              <th className="p-3 text-right">Target</th>
                              <th className="p-3 text-right">Actual</th>
                              <th className="p-3 text-center">Score</th>
                              <th className="p-3 text-center">Status</th>
                              <th className="p-3 text-center">Weight</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                            {sheet.goals.map((g) => {
                              const inp = achievementInputs[sheet._id]?.[g._id] || { actual: '', status: 'Not Started' };
                              const score = computeScore(g.uom, g.target, inp.actual);
                              const isOpen = activeCheckinSheet === sheet._id;
                              return (
                                <tr key={g._id} className="hover:bg-slate-800/30 transition-colors">
                                  <td className="p-3 font-semibold text-slate-200 bg-slate-950/20">{g.thrustArea}</td>
                                  <td className="p-3">
                                    <div className="font-medium text-slate-300">{g.title}</div>
                                    {g.description && <div className="text-slate-500 text-[10px] mt-0.5 italic">{g.description}</div>}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-medium text-slate-400 text-[10px]">{g.uom}</span>
                                  </td>
                                  <td className="p-3 text-right font-mono font-bold text-slate-300">{g.target}</td>
                                  <td className="p-3 text-right">
                                    {isOpen ? (
                                      <input type="text" placeholder="Enter actual"
                                        value={inp.actual}
                                        onChange={(e) => handleAchievementChange(sheet._id, g._id, 'actual', e.target.value)}
                                        className="w-24 px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-emerald-500 outline-none font-mono text-right" />
                                    ) : (
                                      <span className="font-mono font-bold text-slate-300">
                                        {inp.actual !== '' ? inp.actual : <span className="text-slate-600">—</span>}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center"><ScoreBadge score={score} /></td>
                                  <td className="p-3 text-center">
                                    {isOpen ? (
                                      <select value={inp.status}
                                        onChange={(e) => handleAchievementChange(sheet._id, g._id, 'status', e.target.value)}
                                        className="px-2 py-1.5 border border-slate-700 rounded-md text-[10px] bg-slate-900 text-slate-300 focus:border-emerald-500 outline-none cursor-pointer">
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                    ) : (
                                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                                        inp.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                        : inp.status === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                        : 'text-slate-500 bg-slate-800 border-slate-700'
                                      }`}>{inp.status}</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center font-bold text-indigo-400 font-mono">{g.weightage}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {activeCheckinSheet === sheet._id && (
                        <div className="px-6 pb-5 flex justify-end">
                          <button onClick={() => submitAchievements(sheet._id, sheet.goals)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer">
                            💾 Save Achievement Data
                          </button>
                        </div>
                      )}

                      <SheetAnalytics sheet={sheet} />

                      {Object.keys(safeComments(sheet.checkInComments)).length > 0 && (
                        <div className="px-6 pb-5 border-t border-slate-800 pt-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Manager Check-in Feedback</p>
                          <div className="grid grid-cols-2 gap-3">
                            {QUARTERS.map(q => safeComments(sheet.checkInComments)[q] ? (
                              <div key={q} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase">{q}</span>
                                <p className="text-xs text-slate-400 mt-1">{safeComments(sheet.checkInComments)[q]}</p>
                              </div>
                            ) : null)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Organisation-Wide KPIs — Employee */}
            <SharedGoalEmployeeSection
              sharedGoals={sharedGoals}
              employeeId={currentEmployeeId}
              onRefresh={() => fetchSharedGoalsEmployee(currentEmployeeId)}
              toast={toast}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════
            MANAGER VIEW
        ══════════════════════════════════════════════ */}
        {currentRole === 'Manager' && (
          <>
            <TeamAnalytics sheets={pendingSheets} />

            {/* Organisation-Wide KPIs — Manager */}
            <SharedGoalManagerSection sharedGoals={sharedGoalsManager} />

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
              <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                  Operational Review Suite
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Team Goal Pipeline</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  Review, edit, approve goals and conduct quarterly check-ins for your direct reports.
                </p>
                <div className="mt-4">
                  <button onClick={() => exportAllToCSV(pendingSheets)}
                    className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-all cursor-pointer">
                    ⬇️ Export All CSV
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {pendingSheets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-8 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                    <div className="h-16 w-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-5 text-3xl">🎯</div>
                    <h3 className="font-bold text-slate-300 text-base mb-2">Pipeline Clear</h3>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">No goal sheets are pending review right now.</p>
                  </div>
                ) : (
                  pendingSheets.map((sheet) => {
                    const isEditing = editModeActive[sheet._id];
                    const editGoals = editingSheets[sheet._id] || sheet.goals;
                    const editTotal = isEditing ? getEditTotal(sheet._id) : null;
                    const totalOk = editTotal === 100;
                    const isApproved = sheet.status === 'Approved';
                    const commentState = managerComments[sheet._id] || { quarter: 'Q1', comment: '' };
                    const isCommentOpen = activeCommentSheet === sheet._id;

                    return (
                      <div key={sheet._id} className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-md overflow-hidden hover:border-slate-700/60 transition-all">

                        <div className="bg-slate-950/80 px-6 py-4 flex justify-between items-center border-b border-slate-800 flex-wrap gap-3">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center font-bold text-indigo-400 shadow-inner">
                              {sheet.employeeName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm tracking-wide text-white">{sheet.employeeName}</h3>
                              <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">
                                UID: {sheet.employeeId} • State:{' '}
                                <span className={`font-bold ${isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>{sheet.status}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center flex-wrap">
                            {isApproved && (
                              <>
                                <button onClick={() => exportToCSV(sheet)}
                                  className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                                  ⬇️ Export CSV
                                </button>
                                <button onClick={() => setActiveCommentSheet(isCommentOpen ? null : sheet._id)}
                                  className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                                  💬 {isCommentOpen ? 'Close Check-in' : 'Add Check-in'}
                                </button>
                              </>
                            )}
                            {!isApproved && (
                              <>
                                {!isEditing ? (
                                  <button onClick={() => enterEditMode(sheet)}
                                    className="bg-slate-800 hover:bg-indigo-500/20 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/40 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                                    ✏️ Edit Goals
                                  </button>
                                ) : (
                                  <button onClick={() => cancelEditMode(sheet._id)}
                                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                                    ✕ Cancel
                                  </button>
                                )}
                                <button onClick={() => handleManagerDecision(sheet._id, 'Returned')}
                                  className="bg-slate-900 hover:bg-amber-600/20 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 text-slate-400 text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded-lg transition-all cursor-pointer">
                                  ⚠️ Reject/Rework
                                </button>
                                <button onClick={() => handleManagerDecision(sheet._id, 'Approved')}
                                  disabled={isEditing && !totalOk}
                                  className={`text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-all ${
                                    isEditing && !totalOk
                                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md cursor-pointer'
                                  }`}>
                                  ✅ Authorize & Lock
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <div className={`px-6 py-2 flex items-center gap-3 text-xs font-bold border-b ${
                            totalOk ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                          }`}>
                            <span>{totalOk ? '✅' : '⚠️'}</span>
                            <span>Total Weightage: {editTotal}% {totalOk ? '— Ready to approve' : `— ${Math.abs(100 - editTotal)}% ${editTotal < 100 ? 'remaining' : 'over'}`}</span>
                          </div>
                        )}

                        <div className="p-4 overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                                <th className="p-3">Thrust Area</th>
                                <th className="p-3">Target Objective</th>
                                <th className="p-3 text-center">UoM</th>
                                <th className="p-3 text-right">Target</th>
                                {isApproved && <th className="p-3 text-right">Actual</th>}
                                {isApproved && <th className="p-3 text-center">Score</th>}
                                {isApproved && <th className="p-3 text-center">Status</th>}
                                <th className="p-3 text-center">Weight</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                              {(isEditing ? editGoals : sheet.goals).map((g, index) => {
                                const score = isApproved ? computeScore(g.uom, g.target, g.actualAchievement) : null;
                                return (
                                  <tr key={g._id || index} className="hover:bg-slate-800/30 transition-colors">
                                    {!isEditing ? (
                                      <>
                                        <td className="p-3 font-semibold text-slate-200 bg-slate-950/20">{g.thrustArea}</td>
                                        <td className="p-3">
                                          <div className="font-medium text-slate-300">{g.title}</div>
                                          {g.description && <div className="text-slate-500 text-[10px] mt-0.5 italic">{g.description}</div>}
                                        </td>
                                        <td className="p-3 text-center">
                                          <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-medium text-slate-400 text-[10px]">{g.uom}</span>
                                        </td>
                                        <td className="p-3 text-right font-mono font-bold text-slate-300">{g.target}</td>
                                        {isApproved && (
                                          <td className="p-3 text-right font-mono font-bold text-slate-300">
                                            {g.actualAchievement !== null && g.actualAchievement !== undefined && g.actualAchievement !== ''
                                              ? g.actualAchievement : <span className="text-slate-600">—</span>}
                                          </td>
                                        )}
                                        {isApproved && <td className="p-3 text-center"><ScoreBadge score={score} /></td>}
                                        {isApproved && (
                                          <td className="p-3 text-center">
                                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                                              g.goalStatus === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                              : g.goalStatus === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                              : 'text-slate-500 bg-slate-800 border-slate-700'
                                            }`}>{g.goalStatus || 'Not Started'}</span>
                                          </td>
                                        )}
                                        <td className="p-3 text-center font-bold text-indigo-400 font-mono">{g.weightage}%</td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="p-2">
                                          <input type="text" value={g.thrustArea}
                                            onChange={(e) => handleManagerGoalEdit(sheet._id, index, 'thrustArea', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-indigo-500 outline-none" />
                                        </td>
                                        <td className="p-2">
                                          <input type="text" value={g.title} placeholder="Goal Title"
                                            onChange={(e) => handleManagerGoalEdit(sheet._id, index, 'title', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-indigo-500 outline-none mb-1" />
                                          <input type="text" value={g.description || ''} placeholder="Description"
                                            onChange={(e) => handleManagerGoalEdit(sheet._id, index, 'description', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-500 focus:border-indigo-500 outline-none" />
                                        </td>
                                        <td className="p-2">
                                          <select value={g.uom}
                                            onChange={(e) => handleManagerGoalEdit(sheet._id, index, 'uom', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-300 focus:border-indigo-500 outline-none cursor-pointer">
                                            {UOM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                          </select>
                                        </td>
                                        <td className="p-2">
                                          <input type="text" value={g.target}
                                            onChange={(e) => handleManagerGoalEdit(sheet._id, index, 'target', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-slate-200 focus:border-indigo-500 outline-none font-mono text-right" />
                                        </td>
                                        <td className="p-2 text-center">
                                          <input type="number" min="10" max="100" value={g.weightage}
                                            onChange={(e) => handleManagerGoalEdit(sheet._id, index, 'weightage', e.target.value)}
                                            className="w-14 px-2 py-1.5 border border-slate-700 rounded-md text-xs bg-slate-900 text-indigo-400 focus:border-indigo-500 outline-none text-center font-mono font-bold" />
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Check-in Comment Panel */}
                        {isApproved && isCommentOpen && (
                          <div className="px-6 pb-5 pt-4 border-t border-slate-800 bg-slate-950/30">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">💬 Add Quarterly Check-in</p>
                            <div className="flex gap-3 items-start">
                              <select
                                value={commentState.quarter}
                                onChange={e => setManagerComments(prev => ({ ...prev, [sheet._id]: { ...commentState, quarter: e.target.value } }))}
                                className="px-3 py-2 border border-slate-700 rounded-lg text-xs bg-slate-900 text-slate-300 focus:border-indigo-500 outline-none cursor-pointer flex-shrink-0">
                                {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                              </select>
                              <textarea rows={2} placeholder="Enter check-in notes, blockers, or feedback…"
                                value={commentState.comment}
                                onChange={e => setManagerComments(prev => ({ ...prev, [sheet._id]: { ...commentState, comment: e.target.value } }))}
                                className="flex-1 px-3 py-2 border border-slate-700 rounded-lg text-xs bg-slate-900 text-slate-300 placeholder:text-slate-600 focus:border-indigo-500 outline-none resize-none" />
                              <button onClick={() => saveManagerComment(sheet._id)}
                                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wide uppercase shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0">
                                💾 Save
                              </button>
                            </div>
                          </div>
                        )}

                        {Object.keys(safeComments(sheet.checkInComments)).length > 0 && (
                          <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Check-in Comments</p>
                            <div className="flex flex-wrap gap-2">
                              {QUARTERS.map(q => safeComments(sheet.checkInComments)[q] ? (
                                <div key={q} className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 max-w-xs">
                                  <span className="text-[9px] font-bold text-indigo-400 uppercase">{q}: </span>
                                  <span className="text-[10px] text-slate-400">{safeComments(sheet.checkInComments)[q]}</span>
                                </div>
                              ) : null)}
                            </div>
                          </div>
                        )}

                        {sheet.auditTrail && sheet.auditTrail.length > 0 && (
                          <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">🔍 Audit Trail</p>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                              {[...sheet.auditTrail].reverse().map((entry, i) => {
                                const roleColor = entry.actorRole === 'Admin' ? 'text-rose-400'
                                  : entry.actorRole === 'Manager' ? 'text-amber-400'
                                  : 'text-indigo-400';
                                return (
                                  <div key={i} className="flex items-start gap-3 text-[10px] bg-slate-950/40 border border-slate-800/60 rounded-lg px-3 py-2">
                                    <span className={`font-bold flex-shrink-0 ${roleColor}`}>{entry.actorRole}</span>
                                    <span className="text-slate-300 font-medium flex-shrink-0">{entry.actorName}</span>
                                    <span className="text-slate-500">→</span>
                                    <span className="text-slate-400 font-medium">{entry.action}</span>
                                    {entry.details && <span className="text-slate-600 italic truncate">{entry.details}</span>}
                                    <span className="ml-auto text-slate-700 flex-shrink-0 font-mono">
                                      {new Date(entry.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {isApproved && <SheetAnalytics sheet={sheet} />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════
            ADMIN VIEW
        ══════════════════════════════════════════════ */}
        {currentRole === 'Admin' && (
          <>
            {/* Shared Goals Management */}
            <SharedGoalAdminSection
              sharedGoals={sharedGoalsAdmin}
              adminId={loggedInUser?.id}
              adminName={loggedInUser?.name}
              onRefresh={fetchSharedGoalsAdmin}
              toast={toast}
            />

            {/* Goal Sheet Control Centre */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
              <div className="p-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
                  Admin Control Centre
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">All Goal Sheets</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">System-wide view of every goal sheet. Force-approve, unlock, delete, and export.</p>

                {adminFeedback && (
                  <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${
                    adminFeedback === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {adminFeedback === 'unlocked' ? '🔓 Sheet unlocked' :
                     adminFeedback === 'approved' ? '✅ Force-approved' :
                     adminFeedback === 'deleted'  ? '🗑️ Sheet deleted' :
                     '❌ Operation failed'}
                  </div>
                )}

                {/* Filters + bulk export */}
                <div className="mt-5 flex items-center gap-3 flex-wrap">
                  {['All', 'Draft', 'Pending Approval', 'Approved', 'Returned'].map(f => (
                    <button key={f} onClick={() => setAdminFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        adminFilter === f
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                      }`}>{f}</button>
                  ))}
                  <button onClick={() => exportAllToCSV(adminSheets)}
                    className="ml-auto bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-lg transition-all cursor-pointer">
                    ⬇️ Export All CSV
                  </button>
                  <button onClick={fetchAdminData}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {adminLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-slate-500 text-sm font-medium animate-pulse">Loading system data…</div>
                  </div>
                ) : adminSheets.filter(s => adminFilter === 'All' || s.status === adminFilter).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl">
                    <div className="text-3xl mb-3">📋</div>
                    <p className="text-sm font-bold text-slate-400">No sheets match this filter</p>
                  </div>
                ) : (
                  adminSheets.filter(s => adminFilter === 'All' || s.status === adminFilter).map(sheet => {
                    const isApproved = sheet.status === 'Approved';
                    return (
                      <div key={sheet._id} className="bg-slate-900/50 border border-slate-800 rounded-xl shadow-md overflow-hidden">

                        <div className="bg-slate-950/80 px-6 py-4 flex justify-between items-center border-b border-slate-800 flex-wrap gap-3">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center font-bold text-rose-400 shadow-inner">
                              {sheet.employeeName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm tracking-wide text-white">{sheet.employeeName}</h3>
                              <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">
                                EMP: {sheet.employeeId} • MGR: {sheet.managerId} • State:{' '}
                                <span className={`font-bold ${
                                  isApproved ? 'text-emerald-400'
                                  : sheet.status === 'Returned' ? 'text-rose-400'
                                  : 'text-amber-400'
                                }`}>{sheet.status}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center flex-wrap">
                            {!isApproved && (
                              <button onClick={() => adminForceApprove(sheet._id)}
                                className="bg-emerald-600/15 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                                ✅ Force Approve
                              </button>
                            )}
                            {isApproved && (
                              <button onClick={() => adminUnlock(sheet._id)}
                                className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                                🔓 Unlock Sheet
                              </button>
                            )}
                            <button onClick={() => adminDelete(sheet._id)}
                              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                              🗑️ Delete
                            </button>
                            <button onClick={() => exportToCSV(sheet)}
                              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                              ⬇️ CSV
                            </button>
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-3 overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                                <th className="p-2.5">Thrust Area</th>
                                <th className="p-2.5">Goal</th>
                                <th className="p-2.5 text-center">UoM</th>
                                <th className="p-2.5 text-right">Target</th>
                                <th className="p-2.5 text-right">Actual</th>
                                <th className="p-2.5 text-center">Score</th>
                                <th className="p-2.5 text-center">Status</th>
                                <th className="p-2.5 text-center">Weight</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                              {sheet.goals.map((g, i) => {
                                const score = computeScore(g.uom, g.target, g.actualAchievement);
                                return (
                                  <tr key={g._id || i} className="hover:bg-slate-800/20">
                                    <td className="p-2.5 font-semibold text-slate-300">{g.thrustArea}</td>
                                    <td className="p-2.5">
                                      <div className="font-medium text-slate-300">{g.title}</div>
                                      {g.description && <div className="text-slate-600 text-[10px] italic">{g.description}</div>}
                                    </td>
                                    <td className="p-2.5 text-center">
                                      <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-500 text-[10px]">{g.uom}</span>
                                    </td>
                                    <td className="p-2.5 text-right font-mono text-slate-300">{g.target}</td>
                                    <td className="p-2.5 text-right font-mono text-slate-300">
                                      {g.actualAchievement !== null && g.actualAchievement !== undefined && g.actualAchievement !== ''
                                        ? g.actualAchievement : <span className="text-slate-700">—</span>}
                                    </td>
                                    <td className="p-2.5 text-center"><ScoreBadge score={score} /></td>
                                    <td className="p-2.5 text-center">
                                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                                        g.goalStatus === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                        : g.goalStatus === 'On Track' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                        : 'text-slate-500 bg-slate-800 border-slate-700'
                                      }`}>{g.goalStatus || 'Not Started'}</span>
                                    </td>
                                    <td className="p-2.5 text-center font-bold text-indigo-400 font-mono">{g.weightage}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {Object.keys(safeComments(sheet.checkInComments)).length > 0 && (
                          <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Check-in Comments</p>
                            <div className="flex flex-wrap gap-2">
                              {QUARTERS.map(q => safeComments(sheet.checkInComments)[q] ? (
                                <div key={q} className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 max-w-xs">
                                  <span className="text-[9px] font-bold text-indigo-400 uppercase">{q}: </span>
                                  <span className="text-[10px] text-slate-400">{safeComments(sheet.checkInComments)[q]}</span>
                                </div>
                              ) : null)}
                            </div>
                          </div>
                        )}

                        {sheet.auditTrail && sheet.auditTrail.length > 0 && (
                          <div className="px-6 pb-4 border-t border-slate-800/60 pt-3">
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">🔍 Audit Trail</p>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                              {[...sheet.auditTrail].reverse().map((entry, i) => {
                                const roleColor = entry.actorRole === 'Admin' ? 'text-rose-400'
                                  : entry.actorRole === 'Manager' ? 'text-amber-400'
                                  : 'text-indigo-400';
                                return (
                                  <div key={i} className="flex items-start gap-3 text-[10px] bg-slate-950/40 border border-slate-800/60 rounded-lg px-3 py-2">
                                    <span className={`font-bold flex-shrink-0 ${roleColor}`}>{entry.actorRole}</span>
                                    <span className="text-slate-300 font-medium flex-shrink-0">{entry.actorName}</span>
                                    <span className="text-slate-500">→</span>
                                    <span className="text-slate-400 font-medium">{entry.action}</span>
                                    {entry.details && <span className="text-slate-600 italic truncate">{entry.details}</span>}
                                    <span className="ml-auto text-slate-700 flex-shrink-0 font-mono">
                                      {new Date(entry.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default App;