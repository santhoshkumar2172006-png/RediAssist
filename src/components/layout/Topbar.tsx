import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, ShieldAlert, Upload, HelpCircle, Activity } from 'lucide-react';
import { Button } from '../ui/DesignSystem';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onOpenUpload?: () => void;
  pendingAlertCount?: number;
  onSelectTab?: (tab: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  onOpenUpload,
  pendingAlertCount = 2,
  onSelectTab,
}) => {
  const { role, switchDemoRole } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-[#E4E7EC] px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-[#172033] tracking-tight">{title}</h1>
            {subtitle && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-xs text-[#667085]">{subtitle}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Clean Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search patient MRN, accession #, or clinical finding..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs text-[#172033] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2563EB]"
          />
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Right Controls: Fast Role Switcher + Alert Indicator + Upload Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Quick Selector */}
        <div className="flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded p-0.5 text-xs">
          <span className="px-2 text-[10px] font-mono text-[#667085] uppercase">Role:</span>
          <button
            onClick={() => switchDemoRole('RADIOLOGIST')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              role === 'RADIOLOGIST'
                ? 'bg-white text-[#2563EB] shadow-xs font-semibold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Radiologist
          </button>
          <button
            onClick={() => switchDemoRole('REFERRING_DOCTOR')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              role === 'REFERRING_DOCTOR'
                ? 'bg-white text-[#16A34A] shadow-xs font-semibold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Referring MD
          </button>
          <button
            onClick={() => switchDemoRole('ADMIN')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              role === 'ADMIN'
                ? 'bg-white text-[#7C3AED] shadow-xs font-semibold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Critical Alert Indicator */}
        {onSelectTab && (
          <button
            onClick={() => onSelectTab('alerts')}
            title="Critical Alerts Queue"
            className="relative p-1.5 rounded hover:bg-[#F2F4F7] text-[#667085] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {pendingAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
            )}
          </button>
        )}

        {/* Ingest CXR Button */}
        {onOpenUpload && (
          <Button variant="primary" size="sm" onClick={onOpenUpload}>
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CXR</span>
          </Button>
        )}
      </div>
    </header>
  );
};
