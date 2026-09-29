import React from 'react';
import { CriticalAlert } from '../../types';
import { PriorityBadge, StatusBadge, Button } from '../ui/DesignSystem';
import { Bell, CheckCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface CriticalAlertCenterProps {
  alerts: CriticalAlert[];
  onAcknowledgeAlert: (alertId: number) => void;
}

export const CriticalAlertCenter: React.FC<CriticalAlertCenterProps> = ({
  alerts,
  onAcknowledgeAlert,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E4E7EC] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#E4E7EC] bg-[#FAFAFC] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172033]">
              Critical Results Communication Registry
            </h2>
            <p className="text-xs text-[#667085]">
              Mandatory documented hand-off tracking for life-threatening & high-urgency radiographic findings.
            </p>
          </div>
          <span className="text-xs font-mono text-[#667085]">
            {alerts.filter((a) => a.status === 'PENDING').length} Pending Acknowledgments
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E4E7EC] text-[#667085] font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Alert Status</th>
              <th className="py-2.5 px-3">Patient Code & Name</th>
              <th className="py-2.5 px-3">Urgent Clinical Notification</th>
              <th className="py-2.5 px-3">Designated Recipient</th>
              <th className="py-2.5 px-3">Dispatched (UTC)</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {alerts.map((alert) => {
              const isPending = alert.status === 'PENDING';
              return (
                <tr
                  key={alert.id}
                  className={`hover:bg-[#F9FAFB] transition-colors ${
                    isPending ? 'bg-red-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#172033]">
                      {alert.patientName}
                    </div>
                    <div className="text-[11px] font-mono text-[#667085]">
                      {alert.patientCode}
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-md">
                    <p className="text-[#344054] leading-relaxed">
                      {alert.message}
                    </p>
                    {alert.acknowledgedAt && (
                      <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                        Acknowledged at {new Date(alert.acknowledgedAt).toLocaleTimeString()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#344054]">
                    {alert.recipientName || 'On-Call Physician'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[#667085]">
                    {new Date(alert.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {isPending ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-600 font-medium">
                        ✓ Documented
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
