// src/App.jsx
// Root orchestrator — handles auth state and routes to the correct role view.
// All business logic lives in feature modules and hooks; this file is intentionally thin.
import { useEffect, useState } from 'react';

// Hooks
import { useToast }        from './hooks/useToast';
import { useEmployeeData } from './hooks/useEmployeeData';
import { useManagerData }  from './hooks/useManagerData';
import { useAdminData }    from './hooks/useAdminData';

// UI
import { Toast } from './components/ui/Toast';

// Charts
import { TeamAnalytics } from './components/charts/TeamAnalytics';

// Feature modules
import { LoginScreen }                from './features/employee/LoginScreen';
import { GoalCreationForm }           from './features/employee/GoalCreationForm';
import { CheckInPortal }              from './features/employee/CheckInPortal';
import { SharedGoalEmployeeSection }  from './features/employee/SharedGoalEmployeeSection';
import { ManagerPipeline }            from './features/manager/ManagerPipeline';
import { SharedGoalManagerSection }   from './features/manager/SharedGoalManagerSection';
import { AdminControlCentre }         from './features/admin/AdminControlCentre';

// ─── Shared nav header ────────────────────────────────────────────────────────
function AppHeader({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xs">AQ</span>
          </div>
          <div>
            <span className="font-black text-white tracking-tight text-sm">AtomQuest</span>
            <span className="ml-2 text-[10px] font-bold text-indigo-400 tracking-wider uppercase opacity-60">Performance Engine</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-mono">{user.id} • {user.role}</p>
          </div>
          <button onClick={onLogout}
            className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Role views ───────────────────────────────────────────────────────────────
function EmployeeView({ user, toast }) {
  const {
    approvedSheets, achievementInputs, sharedGoals,
    fetchSheets, fetchSharedGoals, setAchievementInput,
  } = useEmployeeData(user.id);

  useEffect(() => {
    fetchSheets();
    fetchSharedGoals();
  }, [fetchSheets, fetchSharedGoals]);

  const managerId = 'MGR555';

  return (
    <div className="space-y-8">
      <GoalCreationForm
        employeeId={user.id}
        employeeName={user.name}
        managerId={managerId}
        toast={toast}
      />
      <CheckInPortal
        approvedSheets={approvedSheets}
        achievementInputs={achievementInputs}
        onInputChange={setAchievementInput}
        onRefresh={fetchSheets}
      />
      <SharedGoalEmployeeSection
        sharedGoals={sharedGoals}
        employeeId={user.id}
        onRefresh={fetchSharedGoals}
        toast={toast}
      />
    </div>
  );
}

function ManagerView({ user, toast }) {
  const {
    sheets, sharedGoals, editingSheets, editModeActive,
    fetchSheets, fetchSharedGoals,
    enterEditMode, cancelEditMode, updateEditGoal, getEditTotal,
  } = useManagerData(user.id);

  useEffect(() => {
    fetchSheets();
    fetchSharedGoals();
  }, [fetchSheets, fetchSharedGoals]);

  return (
    <div className="space-y-8">
      <TeamAnalytics sheets={sheets} />
      <SharedGoalManagerSection sharedGoals={sharedGoals} />
      <ManagerPipeline
        sheets={sheets}
        editingSheets={editingSheets}
        editModeActive={editModeActive}
        onEnterEdit={enterEditMode}
        onCancelEdit={cancelEditMode}
        onGoalEdit={updateEditGoal}
        getEditTotal={getEditTotal}
        onRefresh={fetchSheets}
        loggedInUser={user}
        toast={toast}
      />
    </div>
  );
}

function AdminView({ user, toast }) {
  const {
    sheets, sharedGoals, filteredSheets, loading, filter, feedback,
    setFilter, setFeedback,
    fetchSheets, fetchSharedGoals,
    unlock, forceApprove, deleteSheet,
  } = useAdminData();

  useEffect(() => {
    fetchSheets();
    fetchSharedGoals();
  }, [fetchSheets, fetchSharedGoals]);

  // Clear feedback after 3 s
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(''), 3000);
    return () => clearTimeout(t);
  }, [feedback, setFeedback]);

  return (
    <div className="space-y-8">
      <AdminControlCentre
        filteredSheets={filteredSheets}
        allSheets={sheets}
        loading={loading}
        filter={filter}
        feedback={feedback}
        onFilterChange={setFilter}
        onUnlock={unlock}
        onForceApprove={forceApprove}
        onDelete={deleteSheet}
        onRefresh={fetchSheets}
        sharedGoals={sharedGoals}
        adminId={user.id}
        adminName={user.name}
        onSharedGoalsRefresh={fetchSharedGoals}
        toast={toast}
      />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { toasts, toast } = useToast();

  const handleLogin  = (user) => setLoggedInUser(user);
  const handleLogout = () => setLoggedInUser(null);

  if (!loggedInUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-indigo-600/10 to-violet-600/5 blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-fuchsia-600/8 to-indigo-600/5 blur-[180px]" />
      </div>

      <div className="relative z-10">
        <AppHeader user={loggedInUser} onLogout={handleLogout} />

        <main className="max-w-7xl mx-auto px-6 py-10">
          {loggedInUser.role === 'Employee' && <EmployeeView user={loggedInUser} toast={toast} />}
          {loggedInUser.role === 'Manager'  && <ManagerView  user={loggedInUser} toast={toast} />}
          {loggedInUser.role === 'Admin'    && <AdminView    user={loggedInUser} toast={toast} />}
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}