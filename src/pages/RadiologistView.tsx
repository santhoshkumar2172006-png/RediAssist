import React, { useState, useMemo } from 'react';
import { Study, StudyPriority, StudyStatus } from '../types';
import { INITIAL_STUDIES, INITIAL_FOLLOWUPS } from '../data/mockData';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { DICOMModalViewer } from '../components/DICOMModalViewer';
import { UploadStudyModal } from '../components/UploadStudyModal';
import { ClinicalXRaySvg } from '../components/viewer/ClinicalXRaySvg';
import {
  AlertTriangle,
  Flame,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  Sparkles,
  ChevronRight,
  User,
  Calendar,
  Layers,
  ArrowUpDown,
  BellRing,
  Upload,
  BarChart3,
  Sliders
} from 'lucide-react';

interface RadiologistViewProps {
  initialStudies?: Study[];
}

export const RadiologistView: React.FC<RadiologistViewProps> = () => {
  const [studies, setStudies] = useState<Study[]>(INITIAL_STUDIES);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(INITIAL_STUDIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'priority' | 'time'>('priority');

  // Modal states
  const [viewerStudy, setViewerStudy] = useState<Study | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Dashboard Metrics
  const metrics = useMemo(() => {
    const total = studies.length;
    const critical = studies.filter(s => s.priority === 'CRITICAL').length;
    const abnormal = studies.filter(s => s.priority === 'ABNORMAL').length;
    const routine = studies.filter(s => s.priority === 'ROUTINE').length;
    const pendingReports = studies.filter(s => s.status === 'UNREAD' || s.status === 'IN_PROGRESS').length;
    const followUps = INITIAL_FOLLOWUPS.length;
    return { total, critical, abnormal, routine, pendingReports, followUps };
  }, [studies]);

  // Filtered & Sorted Worklist
  const filteredStudies = useMemo(() => {
    return studies
      .filter(study => {
        const matchesSearch =
          study.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          study.patient?.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          study.aiAnalysis?.finding.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority =
          priorityFilter === 'ALL' || study.priority === priorityFilter;

        const matchesStatus =
          statusFilter === 'ALL' || study.status === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'priority') {
          const score = { CRITICAL: 3, ABNORMAL: 2, ROUTINE: 1 };
          return (score[b.priority] || 0) - (score[a.priority] || 0);
        }
        return new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime();
      });
  }, [studies, searchQuery, priorityFilter, statusFilter, sortField]);

  // Non-color reliant visual indicator helper
  const renderPriorityBadge = (priority: StudyPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs font-semibold tracking-wide shadow-sm shadow-rose-950">
            <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0 fill-rose-500/20" />
            <span>[▲ CRITICAL]</span>
          </div>
        );
      case 'ABNORMAL':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/80 text-amber-200 text-xs font-semibold tracking-wide shadow-sm shadow-amber-950">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-500/20" />
            <span>[◆ ABNORMAL]</span>
          </div>
        );
      case 'ROUTINE':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-emerald-500/40 text-emerald-200 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>[● ROUTINE]</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStatusBadge = (status: StudyStatus) => {
    switch (status) {
      case 'UNREAD':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-950 text-rose-300 border border-rose-800">
            UNREAD
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
            IN REVIEW
          </span>
        );
      case 'REPORTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-950 text-amber-300 border border-amber-800">
            PRELIMINARY
          </span>
        );
      case 'FINALIZED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            FINALIZED
          </span>
        );
    }
  };

  const getSvgType = (study: Study): 'pneumothorax' | 'pneumonia' | 'cardiomegaly' | 'normal' => {
    const finding = (study.aiAnalysis?.finding || '').toLowerCase();
    if (finding.includes('pneumothorax')) return 'pneumothorax';
    if (finding.includes('consolidation') || finding.includes('pneumonia') || finding.includes('infiltrate')) return 'pneumonia';
    if (finding.includes('cardiomegaly')) return 'cardiomegaly';
    return 'normal';
  };

  const handleStudyUploaded = (newStudy: Study) => {
    setStudies(prev => [newStudy, ...prev]);
    setSelectedStudy(newStudy);
    setViewerStudy(newStudy);
  };

  const handleFinalizeReport = (studyId: number, findings: string, impression: string) => {
    setStudies(prev =>
      prev.map(s =>
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

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Workstation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Diagnostic PACS Station · Station 04
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Radiology Worklist & Prioritized Queue
            </h1>
            <p className="text-xs text-slate-400">
              Dr. Sarah Chen, MD · Department of Diagnostic & Interventional Radiology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload CXR Study</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="text-xs text-slate-400 font-medium">Total Studies</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {metrics.total}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Live active queue</div>
        </div>

        <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-3.5 hover:border-rose-700/60 transition-colors bg-gradient-to-br from-slate-900 to-rose-950/20">
          <div className="text-xs text-rose-400 font-semibold flex items-center justify-between">
            <span>Critical (P1)</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {metrics.critical}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1 font-medium">Immediate stat read</div>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-3.5 hover:border-amber-700/60 transition-colors bg-gradient-to-br from-slate-900 to-amber-950/20">
          <div className="text-xs text-amber-400 font-semibold flex items-center justify-between">
            <span>Abnormal (P2)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {metrics.abnormal}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Urgent triage</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="text-xs text-emerald-400 font-medium flex items-center justify-between">
            <span>Routine (P3)</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-1 tabular-nums">
            {metrics.routine}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Standard queue</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="text-xs text-cyan-300 font-medium flex items-center justify-between">
            <span>Pending Reports</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {metrics.pendingReports}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting sign-off</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="text-xs text-purple-300 font-medium flex items-center justify-between">
            <span>Follow-ups</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1 tabular-nums">
            {metrics.followUps}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active tracking</div>
        </div>
      </div>

      {/* Main Workstation Layout: Worklist + Study Preview Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Worklist Section (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex-1 min-w-[200px] relative">
              <input
                type="text"
                placeholder="Search patient name, MRN code, or AI finding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2" />
            </div>

            <div className="flex items-center gap-2">
              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical [P1]</option>
                <option value="ABNORMAL">Abnormal [P2]</option>
                <option value="ROUTINE">Routine [P3]</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="UNREAD">Unread</option>
                <option value="IN_PROGRESS">In Review</option>
                <option value="REPORTED">Preliminary</option>
                <option value="FINALIZED">Finalized</option>
              </select>

              {/* Sorting Button */}
              <button
                onClick={() => setSortField(sortField === 'priority' ? 'time' : 'priority')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Toggle sort by priority vs time"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>{sortField === 'priority' ? 'Priority' : 'Time'}</span>
              </button>
            </div>
          </div>

          {/* Studies Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider select-none">
                    <th className="py-3 px-3">Triage</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Modality / Body Part</th>
                    <th className="py-3 px-3">AI Decision Support Finding</th>
                    <th className="py-3 px-3 text-right">Confidence</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Study Time</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredStudies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No studies match your current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudies.map((study) => {
                      const isSelected = selectedStudy?.id === study.id;
                      return (
                        <tr
                          key={study.id}
                          onClick={() => setSelectedStudy(study)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-slate-800/90 border-l-4 border-cyan-400'
                              : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3 px-3 whitespace-nowrap">
                            {renderPriorityBadge(study.priority)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-white text-xs">
                              {study.patient?.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {study.patient?.patientCode} · {study.patient?.age}y/{study.patient?.gender}
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-300">
                            <div className="font-semibold text-cyan-300">{study.modality}</div>
                            <div className="text-[11px] text-slate-400">{study.bodyPart}</div>
                          </td>
                          <td className="py-3 px-3 max-w-[240px]">
                            <div className="font-medium text-slate-100 truncate">
                              {study.aiAnalysis?.finding || 'Pending inference'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {study.aiAnalysis?.modelName || 'RadiAssist-TriageNet'}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                            {study.aiAnalysis ? (
                              <span
                                className={`font-bold ${
                                  study.aiAnalysis.confidence >= 0.9
                                    ? 'text-rose-400'
                                    : 'text-cyan-300'
                                }`}
                              >
                                {(study.aiAnalysis.confidence * 100).toFixed(1)}%
                              </span>
                            ) : (
                              '--'
                            )}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {renderStatusBadge(study.status)}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                            {new Date(study.studyDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            {new Date(study.studyDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewerStudy(study);
                              }}
                              className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View PACS</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Study Review Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 sticky top-20 shadow-xl">
          {selectedStudy ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Study Inspector #{selectedStudy.id}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedStudy.patient?.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    MRN: {selectedStudy.patient?.patientCode} · {selectedStudy.patient?.age}y · {selectedStudy.patient?.gender}
                  </div>
                </div>
                <div>{renderPriorityBadge(selectedStudy.priority)}</div>
              </div>

              {/* Study Image Snapshot with Vector Anatomy X-Ray */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>Medical Image Viewport</span>
                  <span className="font-mono text-[10px] text-cyan-400">{selectedStudy.modality} {selectedStudy.bodyPart}</span>
                </div>
                <div
                  className="relative aspect-square rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center group cursor-pointer p-2"
                  onClick={() => setViewerStudy(selectedStudy)}
                >
                  <ClinicalXRaySvg
                    type={getSvgType(selectedStudy)}
                    className="w-full h-full pointer-events-none rounded"
                    showOverlay
                  />
                  
                  {/* Bounding box / ROI overlay if AI detected region */}
                  {selectedStudy.aiAnalysis?.keyRegions?.map((roi, idx) => (
                    <div
                      key={idx}
                      style={{
                        left: `${roi.x}%`,
                        top: `${roi.y}%`,
                        width: `${roi.width}%`,
                        height: `${roi.height}%`,
                      }}
                      className="absolute border-2 border-rose-400 bg-rose-500/10 rounded pointer-events-none"
                    >
                      <span className="absolute -top-5 left-0 bg-rose-950 text-rose-200 border border-rose-500/60 text-[9px] px-1 py-0.5 rounded font-mono whitespace-nowrap">
                        ROI: {roi.label}
                      </span>
                    </div>
                  ))}

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300 font-mono bg-slate-950/90 px-2.5 py-1 rounded backdrop-blur">
                    <span>STATUS: {selectedStudy.status}</span>
                    <span className="text-cyan-400">Click to Open Diagnostics</span>
                  </div>
                </div>
              </div>

              {/* AI Triage Findings */}
              <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Decision Support Analysis
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {(Number(selectedStudy.aiAnalysis?.confidence || 0) * 100).toFixed(1)}% Confidence
                  </span>
                </div>

                <div className="font-bold text-white text-xs">
                  {selectedStudy.aiAnalysis?.finding || 'Inference pending'}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedStudy.aiAnalysis?.explanation}
                </p>

                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  Model: {selectedStudy.aiAnalysis?.modelName}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setViewerStudy(selectedStudy)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Full PACS Viewport</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select a study from the worklist to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* Global Interactive DICOM Modal Viewer */}
      <DICOMModalViewer
        study={viewerStudy}
        onClose={() => setViewerStudy(null)}
        onFinalizeReport={handleFinalizeReport}
      />

      {/* Upload CXR Study Modal */}
      <UploadStudyModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onStudyUploaded={handleStudyUploaded}
      />
    </div>
  );
};
