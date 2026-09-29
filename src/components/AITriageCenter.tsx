import React, { useState } from 'react';
import { Study, StudyPriority } from '../types';
import { ClinicalXRaySvg } from './viewer/ClinicalXRaySvg';
import {
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle,
  Eye,
  Sliders,
  ChevronRight,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Layers
} from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

interface AITriageCenterProps {
  studies: Study[];
  onOpenViewer: (study: Study) => void;
}

export const AITriageCenter: React.FC<AITriageCenterProps> = ({
  studies,
  onOpenViewer,
}) => {
  const [selectedStudy, setSelectedStudy] = useState<Study>(studies[0]);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'ABNORMAL' | 'ROUTINE'>('ALL');

  const filteredStudies = studies.filter((s) => {
    if (filter === 'ALL') return true;
    return s.priority === filter;
  });

  const getSvgType = (study: Study): 'pneumothorax' | 'pneumonia' | 'cardiomegaly' | 'normal' => {
    const finding = (study.aiAnalysis?.finding || '').toLowerCase();
    if (finding.includes('pneumothorax')) return 'pneumothorax';
    if (finding.includes('consolidation') || finding.includes('pneumonia') || finding.includes('infiltrate')) return 'pneumonia';
    if (finding.includes('cardiomegaly')) return 'cardiomegaly';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Triage Command Center
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Real-time deep learning inference prioritizing emergency chest radiographs.
              Calculates critical pathology probability, generates automated bounding boxes, and flags urgent patient safety risks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs font-mono text-slate-400">Mean Inference</div>
              <div className="text-lg font-bold font-mono text-cyan-400">38ms</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-xs font-mono text-slate-400">Model Accuracy</div>
              <div className="text-lg font-bold font-mono text-emerald-400">98.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Triage Feed List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Priority Stream ({filteredStudies.length})
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2 py-0.5 rounded transition-all ${
                  filter === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('CRITICAL')}
                className={`px-2 py-0.5 rounded transition-all ${
                  filter === 'CRITICAL' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilter('ABNORMAL')}
                className={`px-2 py-0.5 rounded transition-all ${
                  filter === 'ABNORMAL' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Abnormal
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredStudies.map((study) => {
              const isSelected = selectedStudy.id === study.id;
              const isCritical = study.priority === 'CRITICAL';
              const isAbnormal = study.priority === 'ABNORMAL';

              return (
                <div
                  key={study.id}
                  onClick={() => setSelectedStudy(study)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                      : isCritical
                      ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60'
                      : isAbnormal
                      ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-700/60'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <div className="p-1.5 rounded bg-rose-500/20 text-rose-400">
                          <Flame className="w-4 h-4" />
                        </div>
                      ) : isAbnormal ? (
                        <div className="p-1.5 rounded bg-amber-500/20 text-amber-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">
                          {study.patient?.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {study.patient?.patientCode} · {study.modality}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {study.aiAnalysis && (
                        <div className="text-xs font-mono font-bold text-cyan-300">
                          {(study.aiAnalysis.confidence * 100).toFixed(1)}%
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {study.priority}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-200 line-clamp-1 font-medium">
                    {study.aiAnalysis?.finding || 'No pathology detected'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Deep Inspection Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Active Inference Target #{selectedStudy.id}
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {selectedStudy.patient?.name} · {selectedStudy.bodyPart}
              </h3>
            </div>

            <button
              onClick={() => onOpenViewer(selectedStudy)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full DICOM Viewport</span>
            </button>
          </div>

          {/* Interactive Vector Anatomy X-Ray Canvas */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center p-2">
            <div className="w-[360px] h-[360px] max-w-full max-h-full relative">
              <ClinicalXRaySvg
                type={getSvgType(selectedStudy)}
                className="w-full h-full rounded"
                showOverlay
              />

              {/* ROI Overlay */}
              {selectedStudy.aiAnalysis?.keyRegions?.map((roi, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${roi.x}%`,
                    top: `${roi.y}%`,
                    width: `${roi.width}%`,
                    height: `${roi.height}%`,
                  }}
                  className="absolute border-2 border-rose-500 bg-rose-500/20 rounded shadow-lg pointer-events-none"
                >
                  <span className="absolute -top-6 left-0 bg-rose-950 text-rose-200 border border-rose-600 text-[10px] px-1.5 py-0.5 rounded font-mono shadow">
                    ROI: {roi.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Viewport Info Tags */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded font-mono text-[10px] text-slate-400">
              DICOM · 2048 x 2048 LOSSLESS
            </div>
            <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded font-mono text-[10px] text-cyan-400 font-bold">
              AI SCAN COMPLETE
            </div>
          </div>

          {/* Detailed Decision Support Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 uppercase font-semibold">
                Pathology Classification
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                Model: DenseNet121-ChestX
              </span>
            </div>

            <div className="text-sm font-bold text-white">
              {selectedStudy.aiAnalysis?.finding}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedStudy.aiAnalysis?.explanation}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Confidence: <strong className="text-cyan-300 font-mono">{(Number(selectedStudy.aiAnalysis?.confidence) * 100).toFixed(1)}%</strong>
              </span>
              <span className="text-slate-400">
                Category: <strong className="text-rose-400 font-mono">{selectedStudy.priority}</strong>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
