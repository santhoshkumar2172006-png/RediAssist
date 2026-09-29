import React, { useState } from 'react';
import { CriticalAlert } from '../types';
import { INITIAL_ALERTS, INITIAL_STUDIES, INITIAL_PATIENTS } from '../data/mockData';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { BellRing, CheckCircle, MessageSquare, AlertOctagon, User, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const DoctorView: React.FC = () => {
  const [alerts, setAlerts] = useState<CriticalAlert[]>(INITIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<'alerts' | 'patients'>('alerts');
  const [messageText, setMessageText] = useState('');
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const handleAcknowledge = (alertId: number) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? { ...a, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentNotice('Clinical inquiry transmitted securely to on-call Radiologist Dr. Sarah Chen.');
    setMessageText('');
    setTimeout(() => setSentNotice(null), 4000);
  };

  const pendingAlertCount = alerts.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            Referring Physician Portal
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Emergency & Inpatient Consultation Hub
          </h2>
          <p className="text-xs text-slate-400">
            Dr. Marcus Brody, MD (Emergency Medicine) · Assigned Studies & Critical Findings
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'alerts'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Critical Alerts</span>
            {pendingAlertCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px]">
                {pendingAlertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'patients'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Authorized Patients</span>
          </button>
        </div>
      </div>

      {activeTab === 'alerts' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Alerts Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Active Urgent Notifications & Critical Alerts
            </div>

            {alerts.map((alert) => {
              const isPending = alert.status === 'PENDING';
              return (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isPending
                      ? 'bg-rose-950/20 border-rose-500/70 shadow-lg shadow-rose-950/20'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg mt-0.5 ${
                          isPending ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <AlertOctagon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">
                            {alert.patientName}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            ({alert.patientCode})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              isPending
                                ? 'bg-rose-900/60 text-rose-200 border border-rose-700'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                          <span>Study Ref #{alert.studyId}</span>
                          <span>·</span>
                          <span>{new Date(alert.createdAt).toLocaleString()}</span>
                          {alert.acknowledgedAt && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Acknowledged at {new Date(alert.acknowledgedAt).toLocaleTimeString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {isPending && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secure Messaging Drawer (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Radiologist Direct Line
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct consult with Dr. Sarah Chen, MD (On-Call Radiologist)
              </p>
            </div>

            {sentNotice && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{sentNotice}</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Urgent Clinical Inquiry / Clarification
                </label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="e.g. Inquired about extent of right pneumothorax for chest tube sizing on patient RAD-PT-8021..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Send Priority Clinical Note</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1 text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>HIPAA Encrypted Consultation Channel</span>
              </div>
              <p>All acknowledgments and consult logs are permanently stored in the audit trail.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Patient Studies List */
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Patient Code</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Age / Sex</th>
                <th className="py-2.5 px-4">Last Study</th>
                <th className="py-2.5 px-4">Triage Priority</th>
                <th className="py-2.5 px-4">Report Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {INITIAL_STUDIES.map((study) => (
                <tr key={study.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                    {study.patient?.patientCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {study.patient?.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {study.patient?.age}y · {study.patient?.gender}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {study.modality} - {study.bodyPart}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        study.priority === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : study.priority === 'ABNORMAL'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {study.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {study.status === 'FINALIZED' ? (
                      <span className="text-emerald-400">Report Signed</span>
                    ) : (
                      <span className="text-amber-400">{study.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
