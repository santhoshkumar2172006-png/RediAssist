import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { MetricBlock } from './ui/DesignSystem';

export const AnalyticsDashboard: React.FC = () => {
  const tatData = [
    { time: '08:00', manualTAT: 45, radiAssistTAT: 14 },
    { time: '10:00', manualTAT: 62, radiAssistTAT: 16 },
    { time: '12:00', manualTAT: 78, radiAssistTAT: 19 },
    { time: '14:00', manualTAT: 71, radiAssistTAT: 17 },
    { time: '16:00', manualTAT: 54, radiAssistTAT: 14 },
    { time: '18:00', manualTAT: 38, radiAssistTAT: 12 },
  ];

  const priorityData = [
    { name: 'Critical (P1)', value: 38, color: '#DC2626' },
    { name: 'Abnormal (P2)', value: 108, color: '#D97706' },
    { name: 'Routine (P3)', value: 206, color: '#64748B' },
  ];

  const dailyVolume = [
    { day: 'Mon', studies: 42, critical: 4 },
    { day: 'Tue', studies: 58, critical: 7 },
    { day: 'Wed', studies: 51, critical: 5 },
    { day: 'Thu', studies: 64, critical: 8 },
    { day: 'Fri', studies: 72, critical: 9 },
    { day: 'Sat', studies: 36, critical: 3 },
    { day: 'Sun', studies: 29, critical: 2 },
  ];

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricBlock
          label="Weekly Total Volume"
          value="352"
          subtext="Chest DX & CR Modalities"
        />
        <MetricBlock
          label="Mean Critical TAT"
          value="14.2 min"
          trend={{ text: '▼ 68% vs baseline', positive: true }}
        />
        <MetricBlock
          label="Concordance Rate"
          value="98.4%"
          subtext="Radiologist agreement"
        />
        <MetricBlock
          label="Alert Hand-off Compliance"
          value="100%"
          subtext="All criticals acknowledged < 15 min"
        />
      </div>

      {/* Clean Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Turnaround Time Comparison Chart */}
        <div className="lg:col-span-8 bg-white border border-[#E4E7EC] rounded-lg p-4 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-[#172033] uppercase tracking-wider">
              Diagnostic Turnaround Time (TAT in Minutes)
            </h3>
            <p className="text-xs text-[#667085]">
              Standard manual FIFO queue vs RadiAssist AI Prioritized Worklist
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tatData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F2F4F7" />
                <XAxis dataKey="time" stroke="#98A2B3" fontSize={11} />
                <YAxis stroke="#98A2B3" fontSize={11} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E7EC',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="manualTAT"
                  name="Manual Queue (min)"
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="radiAssistTAT"
                  name="RadiAssist Copilot (min)"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Case Distribution */}
        <div className="lg:col-span-4 bg-white border border-[#E4E7EC] rounded-lg p-4 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#172033] uppercase tracking-wider">
              Case Severity Distribution
            </h3>
            <p className="text-xs text-[#667085]">Categorized by AI Triage</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E7EC',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono border-t border-[#F2F4F7] pt-2">
            <div className="flex justify-between items-center text-red-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Critical (P1)
              </span>
              <span className="font-semibold">38 (11%)</span>
            </div>
            <div className="flex justify-between items-center text-amber-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Abnormal (P2)
              </span>
              <span className="font-semibold">108 (31%)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Routine (P3)
              </span>
              <span className="font-semibold">206 (58%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
