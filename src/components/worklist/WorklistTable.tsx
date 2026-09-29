import React, { useState } from 'react';
import { Study, StudyPriority, StudyStatus } from '../../types';
import { PriorityBadge, StatusBadge, Button } from '../ui/DesignSystem';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface WorklistTableProps {
  studies: Study[];
  onSelectStudy: (study: Study) => void;
  selectedStudyId?: number;
}

export const WorklistTable: React.FC<WorklistTableProps> = ({
  studies,
  onSelectStudy,
  selectedStudyId,
}) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [modalityFilter, setModalityFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'priority' | 'date'>('priority');

  const filteredStudies = studies
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.patient?.name.toLowerCase().includes(q) ||
        s.patient?.patientCode.toLowerCase().includes(q) ||
        s.aiAnalysis?.finding.toLowerCase().includes(q) ||
        s.bodyPart.toLowerCase().includes(q);

      const matchPriority = priorityFilter === 'ALL' || s.priority === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchModality = modalityFilter === 'ALL' || s.modality === modalityFilter;

      return matchSearch && matchPriority && matchStatus && matchModality;
    })
    .sort((a, b) => {
      if (sortField === 'priority') {
        const order = { CRITICAL: 3, ABNORMAL: 2, ROUTINE: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      return new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime();
    });

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden shadow-none flex flex-col">
      {/* Dense Filter Strip */}
      <div className="p-3 border-b border-[#E4E7EC] bg-[#FAFAFC] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Filter worklist (MRN, patient, finding)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#172033] placeholder-[#98A2B3] focus:outline-none focus:border-[#2563EB]"
            />
            <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-2.5 top-2.5" />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#344054] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical (P1)</option>
            <option value="ABNORMAL">Abnormal (P2)</option>
            <option value="ROUTINE">Routine (P3)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#344054] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNREAD">Unread</option>
            <option value="IN_PROGRESS">In Review</option>
            <option value="REPORTED">Preliminary</option>
            <option value="FINALIZED">Finalized</option>
          </select>

          {/* Modality filter */}
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#344054] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Modalities</option>
            <option value="DX">DX (Digital X-Ray)</option>
            <option value="CR">CR (Computed Radiography)</option>
            <option value="CT">CT (Computed Tomography)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortField(sortField === 'priority' ? 'date' : 'priority')}
            className="px-2.5 py-1.5 bg-white border border-[#D0D5DD] hover:bg-[#F9FAFB] rounded text-xs text-[#344054] font-medium flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#667085]" />
            <span>Sort: {sortField === 'priority' ? 'Priority' : 'Study Time'}</span>
          </button>
          <span className="text-xs font-mono text-[#667085] px-1">
            {filteredStudies.length} Cases
          </span>
        </div>
      </div>

      {/* Dense Radiology Workstation Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E4E7EC] text-[#667085] font-semibold tracking-wider uppercase text-[11px] select-none">
              <th className="py-2.5 px-3 w-32">Priority</th>
              <th className="py-2.5 px-3">Patient</th>
              <th className="py-2.5 px-3">Study / Modality</th>
              <th className="py-2.5 px-3">AI Decision Support Finding</th>
              <th className="py-2.5 px-3 text-right">Confidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Study Time</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {filteredStudies.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#667085]">
                  No clinical studies found matching the current search parameters.
                </td>
              </tr>
            ) : (
              filteredStudies.map((study) => {
                const isSelected = selectedStudyId === study.id;
                return (
                  <tr
                    key={study.id}
                    onClick={() => onSelectStudy(study)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-l-4 border-[#2563EB]'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <PriorityBadge priority={study.priority} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#172033]">
                        {study.patient?.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#667085]">
                        {study.patient?.patientCode} · {study.patient?.age}y/{study.patient?.gender}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-mono text-[#344054] font-medium">
                        {study.modality} {study.bodyPart}
                      </div>
                      <div className="text-[11px] text-[#667085]">
                        ACC-0{study.id}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 max-w-[280px]">
                      <div className="font-medium text-[#172033] truncate">
                        {study.aiAnalysis?.finding || 'Pending inference'}
                      </div>
                      <div className="text-[11px] text-[#667085] truncate">
                        {study.aiAnalysis?.modelName || 'RadiAssist TriageNet'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {study.aiAnalysis ? (
                        <span
                          className={`font-semibold ${
                            study.aiAnalysis.confidence >= 0.9
                              ? 'text-red-700'
                              : 'text-[#344054]'
                          }`}
                        >
                          {(study.aiAnalysis.confidence * 100).toFixed(1)}%
                        </span>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={study.status} />
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-[#667085]">
                      {new Date(study.studyDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      {new Date(study.studyDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        size="sm"
                        variant={isSelected ? 'primary' : 'secondary'}
                        onClick={() => onSelectStudy(study)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open Viewer</span>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
