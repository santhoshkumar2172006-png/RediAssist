import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_USERS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { Button } from '../components/ui/DesignSystem';
import { ShieldCheck, Users, Database, RefreshCw, KeyRound, Server } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { health, refreshHealth } = useAuth();
  const [users] = useState(INITIAL_USERS);
  const [auditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'system'>('users');
  const [testingHealth, setTestingHealth] = useState(false);

  const handleTestBackend = async () => {
    setTestingHealth(true);
    await refreshHealth();
    setTimeout(() => setTestingHealth(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Header Tabs */}
      <div className="bg-white border border-[#E4E7EC] rounded-lg p-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#172033]">
            PACS Security, Compliance & Audit Trail
          </h2>
          <p className="text-xs text-[#667085]">
            21 CFR Part 11 / HIPAA compliant audit logging and role-based access management.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded border border-[#E2E8F0] text-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'users' ? 'bg-white text-[#172033] shadow-xs' : 'text-[#667085]'
            }`}
          >
            User RBAC
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-white text-[#172033] shadow-xs' : 'text-[#667085]'
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'system' ? 'bg-white text-[#172033] shadow-xs' : 'text-[#667085]'
            }`}
          >
            API Runtime
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E4E7EC] text-[#667085] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">User ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Clinical Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F9FAFB]">
                  <td className="py-2.5 px-3 font-mono text-[#667085]">USR-00{u.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#172033]">{u.name}</td>
                  <td className="py-2.5 px-3 font-mono text-[#344054]">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#667085]">
                    {u.role === 'RADIOLOGIST' && 'Full Triage, Review, Voice Reporting & Sign-Off'}
                    {u.role === 'REFERRING_DOCTOR' && 'Read-Only Assigned Studies, Alert Acknowledgment'}
                    {u.role === 'ADMIN' && 'System Configuration, Audit Log Access, User Provisioning'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E4E7EC] text-[#667085] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Staff Identity</th>
                <th className="py-2.5 px-3">Event Action</th>
                <th className="py-2.5 px-3">Entity Type</th>
                <th className="py-2.5 px-3">Entity Ref</th>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB]">
                  <td className="py-2.5 px-3 text-[#98A2B3]">AUD-0{log.id}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-[#172033]">
                    {log.userName}
                  </td>
                  <td className="py-2.5 px-3 text-[#2563EB] font-semibold">{log.action}</td>
                  <td className="py-2.5 px-3 text-[#667085]">{log.entityType}</td>
                  <td className="py-2.5 px-3 text-[#667085]">REF-{log.entityId}</td>
                  <td className="py-2.5 px-3 text-[#667085]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E4E7EC] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-2">
              <h3 className="text-xs font-semibold uppercase text-[#172033]">
                FastAPI Gateway Diagnostics
              </h3>
              <Button size="sm" variant="secondary" onClick={handleTestBackend}>
                <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
                <span>Ping Endpoint</span>
              </Button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 bg-[#F8FAFC] rounded">
                <span className="text-[#667085]">Base URL:</span>
                <span className="text-[#172033]">http://127.0.0.1:8001/api</span>
              </div>
              <div className="flex justify-between p-2 bg-[#F8FAFC] rounded">
                <span className="text-[#667085]">Health Status:</span>
                <span className="text-emerald-700 font-bold">{health?.status || 'ok'}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#F8FAFC] rounded">
                <span className="text-[#667085]">Database Engine:</span>
                <span className="text-[#172033]">SQLite 3 / SQLAlchemy 2.0</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E4E7EC] rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase text-[#172033] border-b border-[#E4E7EC] pb-2">
              Local Terminal Command Reference
            </h3>
            <div className="p-3 bg-[#F8FAFC] border border-[#E4E7EC] rounded text-xs font-mono text-[#344054] space-y-1.5">
              <div className="text-[#98A2B3]"># Start FastAPI backend server:</div>
              <div className="text-[#172033] font-semibold">cd backend</div>
              <div className="text-[#172033] font-semibold">uvicorn app.main:app --reload --port 8001</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
