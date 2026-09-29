import React, { useState } from 'react';
import { Study } from '../types';
import { INITIAL_STUDIES } from '../data/mockData';
import { PriorityBadge } from '../components/ui/DesignSystem';
import { ClinicalXRaySvg } from '../components/viewer/ClinicalXRaySvg';
import {
  GitCompare,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Flame,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

export const StudyComparisonView: React.FC = () => {
  const [currentStudy] = useState<Study>(INITIAL_STUDIES[0]); // Patient 101 (Pneumothorax)
  const [priorStudy] = useState<Study>(INITIAL_STUDIES[2]); // Baseline Prior

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white border border-[#E4E7EC] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#172033]">
            Temporal Prior Study Comparison (Side-by-Side Delta)
          </h2>
          <p className="text-xs text-[#667085]">
            Comparing current study with historical baseline to evaluate interval progression.
          </p>
        </div>

        <div className="text-xs font-mono text-[#344054]">
          Patient: <strong className="text-[#172033]">Eleanor Vance (RAD-PT-8021)</strong> · 58y/F
        </div>
      </div>

      {/* Side-by-Side Dual Radiology Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Prior Study */}
        <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 border-b border-[#E4E7EC] bg-[#F8FAFC] flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-[#667085] uppercase text-[10px] block">
                PRIOR STUDY (Baseline - 6 Months Ago)
              </span>
              <span className="font-semibold text-[#172033]">DX CHEST PA</span>
            </div>
            <span className="font-mono text-xs text-[#667085]">2026-03-15</span>
          </div>

          <div className="bg-[#07090E] p-4 flex items-center justify-center relative min-h-[380px]">
            <div className="w-[340px] h-[340px] max-w-full">
              <ClinicalXRaySvg type="normal" className="w-full h-full rounded" />
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500">
              BASELINE EXAM
            </div>
          </div>

          <div className="p-3 bg-white text-xs border-t border-[#E4E7EC] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#667085] font-semibold block">
              Prior Impression:
            </span>
            <p className="text-[#344054]">
              Lungs are fully expanded without focal airspace opacity, pneumothorax, or effusion. Normal cardiac silhouette.
            </p>
          </div>
        </div>

        {/* Right: Current Study */}
        <div className="bg-white border border-red-200 rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 border-b border-red-100 bg-red-50/40 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-red-700 uppercase text-[10px] font-semibold block">
                CURRENT STUDY (Presenting Exam)
              </span>
              <span className="font-semibold text-[#172033]">DX CHEST PA</span>
            </div>
            <PriorityBadge priority="CRITICAL" size="sm" />
          </div>

          <div className="bg-[#07090E] p-4 flex items-center justify-center relative min-h-[380px]">
            <div className="w-[340px] h-[340px] max-w-full relative">
              <ClinicalXRaySvg type="pneumothorax" className="w-full h-full rounded" showOverlay />
              {/* ROI overlay */}
              <div className="absolute top-[18%] left-[55%] w-[35%] h-[42%] border border-red-500 bg-red-500/10 pointer-events-none">
                <span className="absolute -top-4 left-0 bg-red-900 text-red-100 text-[9px] px-1 font-mono uppercase whitespace-nowrap">
                  Interval New Pneumothorax
                </span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-red-400 font-bold">
              TODAY 08:20
            </div>
          </div>

          <div className="p-3 bg-white text-xs border-t border-[#E4E7EC] space-y-1">
            <span className="text-[10px] font-mono uppercase text-red-700 font-semibold block">
              AI Interval Delta Analysis:
            </span>
            <p className="text-[#172033] font-medium">
              NEW FINDING: Visceral pleural line right apex (~2.8 cm displacement) not present on baseline exam.
            </p>
          </div>
        </div>
      </div>

      {/* Interval Comparison Quantitative Delta Strip */}
      <div className="bg-white border border-[#E4E7EC] rounded-lg p-4 text-xs">
        <h3 className="font-semibold text-[#172033] uppercase text-[11px] font-mono mb-2">
          Interval Measurement Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E4E7EC]">
            <span className="text-[#667085] text-[10px] uppercase block">Cardiothoracic Ratio</span>
            <span className="font-bold text-[#172033]">0.46 → 0.47 (Stable)</span>
          </div>
          <div className="p-2.5 rounded bg-red-50/50 border border-red-200">
            <span className="text-red-700 text-[10px] uppercase block">Apical Pneumothorax Edge</span>
            <span className="font-bold text-red-700">0.0 mm → 28.4 mm (+28.4 mm NEW)</span>
          </div>
          <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#E4E7EC]">
            <span className="text-[#667085] text-[10px] uppercase block">Mediastinal Shift</span>
            <span className="font-bold text-[#172033]">2.1 mm contralateral deviation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
