import React, { useState } from 'react';
import { Study } from '../types';
import { INITIAL_STUDIES } from '../data/mockData';
import { StatusBadge, Button } from '../components/ui/DesignSystem';
import { Search, FileText, CheckCircle2, Eye, Download } from 'lucide-react';
import { DiagnosticStudyViewer } from '../components/viewer/DiagnosticStudyViewer';

export const ReportArchiveView: React.FC = () => {
  const [studies] = useState<Study[]>(INITIAL_STUDIES);
  const [search, setSearch] = useState('');
  const [activeViewerStudy, setActiveViewerStudy] = useState<Study | null>(null);

  const finalizedStudies = studies.filter(
    (s) => s.report || s.status === 'FINALIZED' || s.status === 'REPORTED'
  );

  const filtered = finalizedStudies.filter(
    (s) =>
      s.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.patient?.patientCode.toLowerCase().includes(search.toLowerCase()) ||
      s.report?.findings.toLowerCase().includes(search.toLowerCase()) ||
      s.report?.impression.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white border border-[#E4E7EC] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#172033]">
            Signed Diagnostic Radiology Reports
          </h2>
          <p className="text-xs text-[#667085]">
            Archive of finalized and preliminary radiographic reports with electronic signature logs.
          </p>
        </div>

        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search report archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
          />
          <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {activeViewerStudy ? (
        <div className="space-y-3">
          <Button size="sm" variant="secondary" onClick={() => setActiveViewerStudy(null)}>
            ← Back to Report Archive
          </Button>
          <DiagnosticStudyViewer
            study={activeViewerStudy}
            onClose={() => setActiveViewerStudy(null)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((study) => (
            <div
              key={study.id}
              className="bg-white border border-[#E4E7EC] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-[#172033] text-sm">
                    {study.patient?.name}
                  </div>
                  <div className="text-[11px] font-mono text-[#667085]">
                    {study.patient?.patientCode} · {study.modality} {study.bodyPart} ·{' '}
                    {new Date(study.studyDate).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={study.status} />
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E4E7EC] rounded text-xs font-mono space-y-1.5">
                <span className="text-[10px] font-semibold uppercase text-[#667085] block">
                  Impression:
                </span>
                <p className="text-[#172033] line-clamp-2">
                  {study.report?.impression || 'Mild cardiomegaly with upper lobe cephalization.'}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F2F4F7] flex items-center justify-between text-xs">
                <span className="text-[#667085]">
                  Signed: <strong className="text-[#172033]">Dr. Sarah Chen, MD</strong>
                </span>
                <Button size="sm" variant="secondary" onClick={() => setActiveViewerStudy(study)}>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Study</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
