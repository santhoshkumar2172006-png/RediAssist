import React from 'react';
import { FollowUp } from '../../types';
import { StatusBadge, Button } from '../ui/DesignSystem';
import { CalendarClock, CheckCircle, Clock } from 'lucide-react';

interface FollowUpTrackerProps {
  followups: FollowUp[];
  onCompleteFollowUp?: (id: number) => void;
}

export const FollowUpTracker: React.FC<FollowUpTrackerProps> = ({
  followups,
  onCompleteFollowUp,
}) => {
  return (
    <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#E4E7EC] bg-[#FAFAFC] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#172033]">
            Radiology Recommendation & Follow-up Tracker
          </h2>
          <p className="text-xs text-[#667085]">
            Ensures non-urgent incidental findings (pulmonary nodules, mild cardiomegaly) are scheduled appropriately.
          </p>
        </div>
        <span className="text-xs font-mono text-[#667085]">
          {followups.length} Registered Recommendations
        </span>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E4E7EC] text-[#667085] font-semibold text-[11px] uppercase tracking-wider">
            <th className="py-2.5 px-3">Status</th>
            <th className="py-2.5 px-3">Patient Code</th>
            <th className="py-2.5 px-3">Clinical Recommendation</th>
            <th className="py-2.5 px-3">Target Due Date</th>
            <th className="py-2.5 px-3">Registered (UTC)</th>
            <th className="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2F4F7]">
          {followups.map((item) => (
            <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
              <td className="py-3 px-3 whitespace-nowrap">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-3 px-3 font-mono font-medium text-[#172033]">
                PT-REF-0{item.patientId}
              </td>
              <td className="py-3 px-3 max-w-md text-[#344054]">
                {item.recommendation}
              </td>
              <td className="py-3 px-3 whitespace-nowrap font-mono text-[#172033]">
                {new Date(item.dueDate).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="py-3 px-3 whitespace-nowrap font-mono text-[#667085]">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-3 text-right">
                {item.status === 'PENDING' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onCompleteFollowUp && onCompleteFollowUp(item.id)}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </Button>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-600">
                    Done
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
