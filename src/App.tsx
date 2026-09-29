import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { WorklistTable } from './components/worklist/WorklistTable';
import { DiagnosticStudyViewer } from './components/viewer/DiagnosticStudyViewer';
import { CriticalAlertCenter } from './components/alerts/CriticalAlertCenter';
import { FollowUpTracker } from './components/followup/FollowUpTracker';
import { MetricBlock, Button } from './components/ui/DesignSystem';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { StudyComparisonView } from './pages/StudyComparisonView';
import { ReportArchiveView } from './pages/ReportArchiveView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AdminView } from './pages/AdminView';
import { AuthPage } from './pages/AuthPage';
import { UploadStudyModal } from './components/UploadStudyModal';
import {
  INITIAL_STUDIES,
  INITIAL_ALERTS,
  INITIAL_FOLLOWUPS,
} from './data/mockData';
import { Study, CriticalAlert, FollowUp } from './types';
import {
  Activity,
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

function MainApp() {
  const { isAuthenticated, role } = useAuth();

  // State
  const [currentTab, setCurrentTab] = useState<string>('worklist');
  const [studies, setStudies] = useState<Study[]>(INITIAL_STUDIES);
  const [alerts, setAlerts] = useState<CriticalAlert[]>(INITIAL_ALERTS);
  const [followups, setFollowups] = useState<FollowUp[]>(INITIAL_FOLLOWUPS);
  const [activeViewerStudy, setActiveViewerStudy] = useState<Study | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Action handlers
  const handleAcknowledgeAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const handleFinalizeReport = (studyId: number, findings: string, impression: string) => {
    setStudies((prev) =>
      prev.map((s) =>
        s.id === studyId
          ? {
              ...s,
              status: 'FINALIZED',
              report: {
                id: Math.floor(Math.random() * 800) + 400,
                studyId,
                radiologistId: 1,
                radiologistName: 'Dr. Sarah Chen, MD',
                findings,
                impression,
                status: 'FINAL',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }
          : s
      )
    );
  };

  const handleStudyUploaded = (newStudy: Study) => {
    setStudies((prev) => [newStudy, ...prev]);
    setActiveViewerStudy(newStudy);
  };

  const criticalCount = studies.filter((s) => s.priority === 'CRITICAL').length;
  const abnormalCount = studies.filter((s) => s.priority === 'ABNORMAL').length;
  const pendingCount = studies.filter((s) => s.status === 'UNREAD' || s.status === 'IN_PROGRESS').length;
  const pendingAlertCount = alerts.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FA] text-[#172033] font-sans antialiased">
      {/* 1. Left Fixed Compact Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setActiveViewerStudy(null);
        }}
        pendingAlertCount={pendingAlertCount}
        unreadStudyCount={pendingCount}
      />

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar
          title={
            activeViewerStudy
              ? `Diagnostic Workstation / ${activeViewerStudy.patient?.name}`
              : currentTab === 'dashboard'
              ? 'Radiology Operations'
              : currentTab === 'worklist'
              ? 'Smart Worklist'
              : currentTab === 'reports'
              ? 'Reports Archive'
              : currentTab === 'alerts'
              ? 'Critical Results Communication'
              : currentTab === 'comparison'
              ? 'Prior Study Delta Comparison'
              : currentTab === 'followups'
              ? 'Follow-up Recommendation Tracker'
              : currentTab === 'analytics'
              ? 'Department Analytics'
              : 'Administration'
          }
          subtitle={activeViewerStudy ? `ACC-0${activeViewerStudy.id}` : 'General Hospital Radiology'}
          onOpenUpload={() => setIsUploadOpen(true)}
          pendingAlertCount={pendingAlertCount}
          onSelectTab={setCurrentTab}
        />

        {/* Global Compact Medical Disclaimer */}
        <DisclaimerBanner compact />

        <div className="p-6 max-w-7xl w-full mx-auto space-y-5">
          {/* Active Diagnostic Study Viewer takes center stage if a study is selected */}
          {activeViewerStudy ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setActiveViewerStudy(null)}
                >
                  ← Back to Smart Worklist
                </Button>
                <span className="text-xs font-mono text-[#667085]">
                  Viewer Mode: Single-Study Multi-System Analysis
                </span>
              </div>
              <DiagnosticStudyViewer
                study={activeViewerStudy}
                onClose={() => setActiveViewerStudy(null)}
                onFinalizeReport={handleFinalizeReport}
              />
            </div>
          ) : (
            <>
              {/* Top Operational Metrics Strip (Clean, dense, no giant cards) */}
              {(currentTab === 'dashboard' || currentTab === 'worklist') && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  <MetricBlock
                    label="Studies In Queue"
                    value={studies.length}
                    subtext="Live PACS queue"
                  />
                  <MetricBlock
                    label="Critical (P1)"
                    value={criticalCount}
                    trend={{ text: 'Requires immediate read', positive: false }}
                    badge={<span className="w-2 h-2 rounded-full bg-red-600" />}
                  />
                  <MetricBlock
                    label="Abnormal (P2)"
                    value={abnormalCount}
                    trend={{ text: 'Urgent correlation', positive: true }}
                    badge={<span className="w-2 h-2 rounded-full bg-amber-500" />}
                  />
                  <MetricBlock
                    label="Pending Reads"
                    value={pendingCount}
                    subtext="Unread / In progress"
                  />
                  <MetricBlock
                    label="Mean TAT"
                    value="14.2m"
                    trend={{ text: '▼ 68% faster', positive: true }}
                  />
                  <MetricBlock
                    label="Pending Alerts"
                    value={pendingAlertCount}
                    subtext="Hand-off tracking"
                    badge={<span className="w-2 h-2 rounded-full bg-red-600" />}
                  />
                </div>
              )}

              {/* View Router */}
              {currentTab === 'dashboard' && (
                <div className="space-y-5">
                  <WorklistTable
                    studies={studies}
                    onSelectStudy={(s) => setActiveViewerStudy(s)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CriticalAlertCenter
                      alerts={alerts}
                      onAcknowledgeAlert={handleAcknowledgeAlert}
                    />
                    <FollowUpTracker followups={followups} />
                  </div>
                </div>
              )}

              {currentTab === 'worklist' && (
                <WorklistTable
                  studies={studies}
                  onSelectStudy={(s) => setActiveViewerStudy(s)}
                />
              )}

              {currentTab === 'alerts' && (
                <CriticalAlertCenter
                  alerts={alerts}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                />
              )}

              {currentTab === 'reports' && <ReportArchiveView />}

              {currentTab === 'comparison' && <StudyComparisonView />}

              {currentTab === 'followups' && (
                <FollowUpTracker followups={followups} />
              )}

              {currentTab === 'analytics' && <AnalyticsDashboard />}

              {(currentTab === 'admin' || currentTab === 'system') && (
                <AdminView />
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload CXR Modal */}
      <UploadStudyModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onStudyUploaded={handleStudyUploaded}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
