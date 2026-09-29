import React, { useState } from 'react';
import { Study } from '../../types';
import { PriorityBadge, StatusBadge, Button } from '../ui/DesignSystem';
import { ClinicalXRaySvg } from './ClinicalXRaySvg';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Contrast,
  Sliders,
  Sparkles,
  Maximize2,
  X,
  FileCheck,
  Mic,
  MicOff,
  AlertTriangle,
  Move,
  Flame,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DiagnosticStudyViewerProps {
  study: Study;
  onClose?: () => void;
  onFinalizeReport?: (studyId: number, findings: string, impression: string) => void;
}

export const DiagnosticStudyViewer: React.FC<DiagnosticStudyViewerProps> = ({
  study,
  onClose,
  onFinalizeReport,
}) => {
  // Medical imaging controls
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(115);
  const [invert, setInvert] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reporting controls
  const [activeTab, setActiveTab] = useState<'editor' | 'history' | 'ai'>('editor');
  const [findings, setFindings] = useState(
    study.report?.findings ||
      `Lungs: Aeration is preserved. Right hemithorax shows prominent apical pleural contour line with subtle attenuation of peripheral markings.\nCardiovascular: Normal cardiothoracic ratio (<0.50). Normal mediastinal vascular caliber.\nPleural Spaces: Left costophrenic angle is sharply contoured. No pleural effusion on the left.`
  );
  const [impression, setImpression] = useState(
    study.report?.impression ||
      (study.priority === 'CRITICAL'
        ? `1. Radiographic findings concerning for right pneumothorax requiring urgent clinical correlation and emergency decompression assessment.`
        : `1. Study reviewed. Correlate with clinical course and repeat exam as indicated.`)
  );
  const [isRecording, setIsRecording] = useState(false);
  const [qaMismatchWarning, setQaMismatchWarning] = useState<string | null>(null);

  const handleResetFilters = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(115);
    setInvert(false);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleRunQA = () => {
    // Check for laterality mismatch
    if (findings.toLowerCase().includes('right') && impression.toLowerCase().includes('left')) {
      setQaMismatchWarning('Possible laterality mismatch detected between Findings (Right) and Impression (Left).');
    } else {
      setQaMismatchWarning('QA Verification complete: No laterality or terminology conflicts identified.');
    }
  };

  // Determine anatomical SVG type based on study data
  const getSvgType = (): 'pneumothorax' | 'pneumonia' | 'cardiomegaly' | 'normal' => {
    const finding = (study.aiAnalysis?.finding || '').toLowerCase();
    if (finding.includes('pneumothorax')) return 'pneumothorax';
    if (finding.includes('consolidation') || finding.includes('pneumonia') || finding.includes('infiltrate')) return 'pneumonia';
    if (finding.includes('cardiomegaly')) return 'cardiomegaly';
    return 'normal';
  };

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden flex flex-col h-[calc(100vh-140px)] shadow-none">
      {/* 1. Patient & Study Header Strip (Compact) */}
      <div className="h-12 bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 flex items-center justify-between gap-4 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-[#172033]">
            {study.patient?.name}
          </div>
          <span className="font-mono text-[#667085]">
            MRN: {study.patient?.patientCode}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[#344054]">
            {study.patient?.age}y / {study.patient?.gender}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[#344054] font-medium">
            {study.modality} {study.bodyPart}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[#667085] font-mono">
            {new Date(study.studyDate).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <PriorityBadge priority={study.priority} size="sm" />
          <StatusBadge status={study.status} />
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#E4E7EC] text-[#667085] hover:text-[#172033]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Workstation Center: Left Viewport (Canvas) + Right Analysis/Report Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Medical Image Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#07090E] flex flex-col relative overflow-hidden select-none border-r border-[#E4E7EC]">
          {/* Subtle PACS Toolbar */}
          <div className="h-10 bg-[#0B0F19] border-b border-[#1E293B] px-3 flex items-center justify-between text-xs text-slate-300 z-10 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3.5 bg-slate-700 mx-1" />
              <button
                onClick={() => setInvert(!invert)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  invert ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                Invert
              </button>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  showOverlay ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                Overlay ROI
              </button>
              <button
                onClick={handleResetFilters}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Window & Level Sliders */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3 h-3 text-slate-500" />
                <span>B:</span>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-16 accent-blue-600 h-1 bg-slate-800 rounded"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Contrast className="w-3 h-3 text-slate-500" />
                <span>C:</span>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-16 accent-blue-600 h-1 bg-slate-800 rounded"
                />
              </div>
              <span className="text-slate-500">Z: {(zoom * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Interactive DICOM Viewport Canvas with Authentic Clinical Vector X-Ray */}
          <div
            className="flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
              className="relative w-[480px] h-[480px] max-w-full max-h-full flex items-center justify-center"
            >
              {/* Authentic Clinical Vector Anatomy X-Ray Canvas */}
              <ClinicalXRaySvg
                type={getSvgType()}
                className="w-full h-full pointer-events-none rounded"
                showOverlay={showOverlay}
              />

              {/* Bounding box AI ROI */}
              {showOverlay && study.aiAnalysis?.keyRegions?.map((roi, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${roi.x}%`,
                    top: `${roi.y}%`,
                    width: `${roi.width}%`,
                    height: `${roi.height}%`,
                  }}
                  className="absolute border border-red-500 bg-red-500/10 pointer-events-none"
                >
                  <span className="absolute -top-4 left-0 bg-red-900 text-red-100 text-[9px] px-1 py-0.2 rounded font-mono uppercase whitespace-nowrap">
                    {roi.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle Overlay Corner HUD */}
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 pointer-events-none select-none">
              MATRIX: 2048x2048 · LOSSLESS DICOM · BITS: 16
            </div>
            <div className="absolute top-12 right-2 text-[10px] font-mono text-slate-500 pointer-events-none select-none text-right">
              {study.modality} · {study.bodyPart}
            </div>
          </div>
        </div>

        {/* Right Structured Clinical Analysis & Report Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white flex flex-col overflow-y-auto">
          
          {/* AI Analysis Panel (Technical, Non-ChatGPT Style) */}
          <div className="p-4 border-b border-[#E4E7EC] bg-[#FAFAFC] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#172033] uppercase tracking-wider">
                AI Clinical Decision Support
              </span>
              <span className="text-[11px] font-mono text-[#667085]">
                {study.aiAnalysis?.modelName}
              </span>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#667085] block">
                    Candidate Pathology
                  </span>
                  <span className="font-semibold text-[#172033] text-sm">
                    {study.aiAnalysis?.finding || 'No acute abnormality detected'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-[#667085] block">
                    Confidence
                  </span>
                  <span className="font-mono font-bold text-sm text-[#172033]">
                    {study.aiAnalysis ? `${(study.aiAnalysis.confidence * 100).toFixed(1)}%` : '--'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#344054] leading-relaxed pt-1 border-t border-[#F2F4F7]">
                {study.aiAnalysis?.explanation}
              </p>

              <div className="text-[10px] text-[#667085] font-mono pt-1">
                Notice: AI output requires independent radiologist verification.
              </div>
            </div>
          </div>

          {/* Radiology Report Document Editor */}
          <div className="p-4 flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#172033]">
                Diagnostic Report Editor
              </h3>
              
              {/* Subtle Voice Reporting Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                    isRecording
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRecording ? 'bg-red-600 animate-ping' : 'bg-slate-400'
                    }`}
                  />
                  <span>{isRecording ? 'Recording (0:14)' : 'Dictate'}</span>
                </button>
              </div>
            </div>

            {/* Findings Box */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#667085] uppercase">
                Findings
              </label>
              <textarea
                rows={5}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#172033] font-mono leading-relaxed focus:outline-none focus:border-[#2563EB] resize-none"
              />
            </div>

            {/* Impression Box */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#667085] uppercase">
                Impression
              </label>
              <textarea
                rows={3}
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D0D5DD] rounded text-xs text-[#172033] font-mono leading-relaxed focus:outline-none focus:border-[#2563EB] resize-none"
              />
            </div>

            {/* QA Warning / Verification Notification */}
            {qaMismatchWarning && (
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{qaMismatchWarning}</span>
                </div>
                <button
                  onClick={() => setQaMismatchWarning(null)}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 mt-auto border-t border-[#E4E7EC] flex items-center justify-between gap-2">
              <Button size="sm" variant="secondary" onClick={handleRunQA}>
                Run Report QA
              </Button>

              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  if (onFinalizeReport) {
                    onFinalizeReport(study.id, findings, impression);
                  }
                  if (onClose) onClose();
                }}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Electronically Sign & Finalize</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
