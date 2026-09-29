import React from 'react';
import { StudyPriority, StudyStatus, AlertStatus, FollowUpStatus } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Priority Badge: High visual hierarchy, geometric symbols + color
export const PriorityBadge: React.FC<{ priority: StudyPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';

  switch (priority) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded font-mono uppercase bg-red-50 text-red-700 border border-red-200 ${padding}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          <span>▲ CRITICAL</span>
        </span>
      );
    case 'ABNORMAL':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded font-mono uppercase bg-amber-50 text-amber-800 border border-amber-200 ${padding}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>◆ ABNORMAL</span>
        </span>
      );
    case 'ROUTINE':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded font-mono uppercase bg-slate-50 text-slate-600 border border-slate-200 ${padding}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>● ROUTINE</span>
        </span>
      );
  }
};

// Status Badge: Clean neutral clinical indicators
export const StatusBadge: React.FC<{ status: StudyStatus | AlertStatus | FollowUpStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'UNREAD':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Unread
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          In Review
        </span>
      );
    case 'REPORTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Preliminary
        </span>
      );
    case 'FINALIZED':
    case 'COMPLETED':
    case 'ACKNOWLEDGED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {status === 'FINALIZED' ? 'Finalized' : status === 'ACKNOWLEDGED' ? 'Acknowledged' : 'Completed'}
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3 text-slate-500" />
          Pending
        </span>
      );
    case 'OVERDUE':
    case 'ESCALATED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-3 h-3 text-red-600" />
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
          {status}
        </span>
      );
  }
};

// Compact Metric Block
export const MetricBlock: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  trend?: { text: string; positive?: boolean };
  badge?: React.ReactNode;
}> = ({ label, value, subtext, trend, badge }) => {
  return (
    <div className="bg-white border border-[#E4E7EC] rounded-lg p-3 shadow-none flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#667085]">
          {label}
        </span>
        {badge}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-bold font-mono text-[#172033] tracking-tight tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-medium ${
              trend.positive ? 'text-emerald-600' : 'text-[#667085]'
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
      {subtext && <div className="text-[11px] text-[#667085] mt-0.5">{subtext}</div>}
    </div>
  );
};

// Button Component
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  children,
  variant = 'secondary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-2';
  const sizeCls = size === 'sm' ? 'px-2.5 py-1 text-xs gap-1.5' : 'px-3 py-1.5 text-xs gap-2';

  let variantCls = 'bg-white border border-[#E4E7EC] text-[#172033] hover:bg-[#F9FAFB]';
  if (variant === 'primary') {
    variantCls = 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] border border-[#2563EB]';
  } else if (variant === 'danger') {
    variantCls = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200';
  } else if (variant === 'ghost') {
    variantCls = 'bg-transparent text-[#667085] hover:text-[#172033] hover:bg-[#F2F4F7] border border-transparent';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizeCls} ${variantCls} ${className}`}
    >
      {children}
    </button>
  );
};
