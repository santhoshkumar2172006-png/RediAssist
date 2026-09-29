import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  return (
    <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#92400E]">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
        <span>
          <strong className="font-semibold text-[#78350F]">CLINICAL DECISION SUPPORT:</strong> AI-generated information is for clinical prioritization and workflow assistance only and must be independently reviewed by a qualified healthcare professional.
        </span>
      </div>
      <span className="hidden md:inline font-mono text-[10px] text-[#B45309]">
        PROTOTYPE · NOT CLINICALLY VALIDATED
      </span>
    </div>
  );
};
