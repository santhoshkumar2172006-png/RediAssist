import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Activity,
  Layers,
  Sparkles,
  GitCompare,
  BarChart3,
  FileCheck,
  BellRing,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Palette,
  Trophy,
  Play
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { theme, setTheme } = useTheme();

  const isRadiologist = role === 'RADIOLOGIST';
  const isDoctor = role === 'REFERRING_DOCTOR';
  const isAdmin = role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('jury')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-white font-bold tracking-wider shadow-lg shadow-cyan-900/40 group-hover:scale-105 transition-all">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                RadiAssist
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                  Workflow Copilot
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
          {/* SPECIAL HACKATHON JURY CONSOLE TAB */}
          <button
            onClick={() => onSelectTab('jury')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentTab === 'jury'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-950/50 ring-1 ring-amber-400/50'
                : 'text-amber-300 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300 fill-amber-300/20" />
            <span>Jury Demo</span>
          </button>

          {isRadiologist && (
            <>
              <button
                onClick={() => onSelectTab('worklist')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'worklist'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Smart Worklist</span>
              </button>

              <button
                onClick={() => onSelectTab('triage')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'triage'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>AI Triage</span>
              </button>

              <button
                onClick={() => onSelectTab('comparison')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'comparison'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Prior Comparison</span>
              </button>

              <button
                onClick={() => onSelectTab('reports')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'reports'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Reports</span>
              </button>

              <button
                onClick={() => onSelectTab('analytics')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'analytics'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </>
          )}

          {isDoctor && (
            <>
              <button
                onClick={() => onSelectTab('referring')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'referring'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Patient Studies</span>
              </button>
              <button
                onClick={() => onSelectTab('alerts')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'alerts'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Critical Alerts</span>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => onSelectTab('admin')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PACS Governance</span>
              </button>
              <button
                onClick={() => onSelectTab('audit')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentTab === 'audit'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Audit Logs</span>
              </button>
            </>
          )}

          <button
            onClick={() => onSelectTab('system')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'system'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Server & API
          </button>
        </nav>

        {/* Action Controls: Theme Switcher + Role Selector + Logout */}
        <div className="flex items-center gap-2.5">
          {/* Visual Theme Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setTheme('pacs-dark')}
              title="PACS Dark Theme"
              className={`p-1.5 rounded-md transition-colors ${theme === 'pacs-dark' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('clinical-light')}
              title="Clinical Light Theme"
              className={`p-1.5 rounded-md transition-colors ${theme === 'clinical-light' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('midnight-blue')}
              title="Midnight Navy Theme"
              className={`p-1.5 rounded-md transition-colors ${theme === 'midnight-blue' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Role Tester */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => {
                switchDemoRole('RADIOLOGIST');
                onSelectTab('worklist');
              }}
              title="Test as Radiologist"
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                role === 'RADIOLOGIST'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rad
            </button>
            <button
              onClick={() => {
                switchDemoRole('REFERRING_DOCTOR');
                onSelectTab('referring');
              }}
              title="Test as Referring Doctor"
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                role === 'REFERRING_DOCTOR'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Doc
            </button>
            <button
              onClick={() => {
                switchDemoRole('ADMIN');
                onSelectTab('admin');
              }}
              title="Test as Admin"
              className={`px-2 py-1 rounded-md font-semibold transition-all ${
                role === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
