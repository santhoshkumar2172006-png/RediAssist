import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Layers,
  FileText,
  Bell,
  GitCompare,
  CalendarClock,
  MessageSquare,
  BarChart2,
  Settings,
  HelpCircle,
  Users,
  Shield,
  UploadCloud,
  LogOut,
  ChevronRight,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingAlertCount?: number;
  unreadStudyCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingAlertCount = 2,
  unreadStudyCount = 3,
}) => {
  const { user, role, logout } = useAuth();

  const isRadiologist = role === 'RADIOLOGIST';
  const isDoctor = role === 'REFERRING_DOCTOR';
  const isAdmin = role === 'ADMIN';

  const navItemClass = (tab: string) => {
    const isActive = currentTab === tab;
    return `w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors text-left ${
      isActive
        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border-l-2 border-[#2563EB] rounded-l-none'
        : 'text-[#344054] hover:bg-[#F2F4F7] hover:text-[#172033]'
    }`;
  };

  return (
    <aside className="w-56 bg-white border-r border-[#E4E7EC] flex flex-col justify-between select-none shrink-0 h-screen sticky top-0 z-30">
      {/* Top Header: Logo + Clinical Department */}
      <div>
        <div className="h-14 px-4 border-b border-[#E4E7EC] flex items-center gap-2.5">
          {/* Custom Medical Imaging Mark */}
          <div className="w-7 h-7 rounded bg-[#172033] flex items-center justify-center text-white shrink-0">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight text-[#172033] leading-none">
              RadiAssist
            </div>
            <div className="text-[10px] text-[#667085] font-mono mt-0.5 tracking-tight">
              Clinical PACS Copilot
            </div>
          </div>
        </div>

        {/* Primary Navigation Section */}
        <div className="p-3 space-y-4">
          <div>
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3] mb-1.5">
              Clinical Workflow
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#667085]" />
                  <span>Operations</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('worklist')}
                className={navItemClass('worklist')}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#667085]" />
                  <span>Smart Worklist</span>
                </div>
                {unreadStudyCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#EFF6FF] text-[#2563EB] font-bold">
                    {unreadStudyCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('reports')}
                className={navItemClass('reports')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#667085]" />
                  <span>Reports Archive</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('alerts')}
                className={navItemClass('alerts')}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#667085]" />
                  <span>Critical Alerts</span>
                </div>
                {pendingAlertCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-100 text-red-700 font-bold">
                    {pendingAlertCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('comparison')}
                className={navItemClass('comparison')}
              >
                <div className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-[#667085]" />
                  <span>Study Comparison</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('followups')}
                className={navItemClass('followups')}
              >
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-[#667085]" />
                  <span>Follow-up Tracker</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('analytics')}
                className={navItemClass('analytics')}
              >
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#667085]" />
                  <span>Analytics</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Department / Admin Section */}
          <div>
            <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#98A2B3] mb-1.5">
              Administration
            </div>
            <nav className="space-y-0.5">
              {isAdmin && (
                <button
                  onClick={() => onSelectTab('admin')}
                  className={navItemClass('admin')}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#667085]" />
                    <span>PACS & Users</span>
                  </div>
                </button>
              )}
              <button
                onClick={() => onSelectTab('system')}
                className={navItemClass('system')}
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#667085]" />
                  <span>API Connectivity</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Profile Bar & Online Status */}
      <div className="p-3 border-t border-[#E4E7EC] bg-[#FAFAFC]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#E2E8F0] flex items-center justify-center font-bold text-xs text-[#334155] shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#172033] truncate">
                {user?.name || 'Staff User'}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#667085] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>ONLINE · {user?.role || 'RAD'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1 rounded text-[#98A2B3] hover:text-red-600 hover:bg-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
