import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCheck,
  Mic,
  Eye,
  GitCompare,
  Layers,
  ArrowRight,
  RotateCcw,
  Check,
  Star,
  Activity,
  Cpu,
  HelpCircle,
  Code2
} from 'lucide-react';
import { Study } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

interface JuryInteractiveDemoProps {
  onNavigateTab: (tab: string) => void;
  onOpenViewer: (studyId: number) => void;
  onOpenUpload: () => void;
}

export const JuryInteractiveDemo: React.FC<JuryInteractiveDemoProps> = ({
  onNavigateTab,
  onOpenViewer,
  onOpenUpload,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [juryScores, setJuryScores] = useState({
    problemSolving: 5,
    technicalExecution: 5,
    uiUxDesign: 5,
    clinicalSafety: 5,
  });
  const [hasVoted, setHasVoted] = useState(false);

  // 6 interactive walkthrough stages designed specifically for hackathon judging
  const demoSteps = [
    {
      id: 1,
      title: 'Problem & Clinical Triage',
      time: '0:30',
      badge: 'Step 1 of 5',
      problem: 'Radiologist burnout & critical case delay (tension pneumothorax waiting hours in manual queues).',
      solution: 'AI-assisted prioritization flags critical findings in under 38 milliseconds, surfacing them to top of worklist.',
      actionLabel: 'Inspect Smart Worklist Triage',
      onTrigger: () => onNavigateTab('worklist'),
    },
    {
      id: 2,
      title: 'Interactive DICOM Viewport & AI ROI',
      time: '1:00',
      badge: 'Step 2 of 5',
      problem: 'Static images lack diagnostic utility and radiologist control.',
      solution: 'High-performance PACS canvas with zoom, pan, brightness/contrast windowing, and Grad-CAM bounding box overlays.',
      actionLabel: 'Launch Interactive PACS Viewport',
      onTrigger: () => onOpenViewer(201),
    },
    {
      id: 3,
      title: 'AI Speech Reporting & Automated QA',
      time: '1:30',
      badge: 'Step 3 of 5',
      problem: 'Dictation transcription errors and discordance between findings and final impressions.',
      solution: 'Live speech-to-text dictation + integrated QA checking discordance before electronic signature.',
      actionLabel: 'Open Report Editor with Dictation',
      onTrigger: () => onOpenViewer(201),
    },
    {
      id: 4,
      title: 'Real-time Study Ingestion & AI Inference',
      time: '2:00',
      badge: 'Step 4 of 5',
      problem: 'Rigid static prototypes cannot ingest new patient studies live during a pitch.',
      solution: 'Live CXR ingestion engine that computes confidence, severity tier, and Grad-CAM ROI dynamically.',
      actionLabel: 'Simulate Live CXR Ingestion',
      onTrigger: () => onOpenUpload(),
    },
    {
      id: 5,
      title: 'Temporal Progression Comparison',
      time: '2:30',
      badge: 'Step 5 of 5',
      problem: 'Missing subtle interval changes across months of patient history.',
      solution: 'Side-by-side prior study delta analysis highlighting newly emergent pathologies.',
      actionLabel: 'Review Side-by-Side Delta Comparison',
      onTrigger: () => onNavigateTab('comparison'),
    },
  ];

  const handleStepComplete = (id: number) => {
    if (!completedSteps.includes(id)) {
      setCompletedSteps([...completedSteps, id]);
    }
    if (id < 5) {
      setActiveStep(id + 1);
    }
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasVoted(true);
  };

  const totalScore =
    juryScores.problemSolving +
    juryScores.technicalExecution +
    juryScores.uiUxDesign +
    juryScores.clinicalSafety;

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Hero Jury Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wide">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>HACKATHON JURY & EVALUATION CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              RadiAssist: 3-Minute Live Interactive Pitch
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Welcome Judges & Hackathon Jury! Test each end-to-end milestone below. You can trigger live AI triage, launch the diagnostic DICOM canvas, test voice dictation, and score the system.
            </p>
          </div>

          {/* Quick Pitch Progress Pill */}
          <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl p-4 shrink-0 flex flex-col items-center justify-center min-w-[200px] shadow-lg">
            <div className="text-xs text-slate-400 font-mono">PITCH COMPLETION</div>
            <div className="text-3xl font-extrabold font-mono text-cyan-400 my-1 tabular-nums">
              {Math.round((completedSteps.length / 5) * 100)}%
            </div>
            <div className="text-[11px] text-slate-400">
              {completedSteps.length} of 5 Modules Tested
            </div>
          </div>
        </div>
      </div>

      {/* Main Jury Workspace: 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Step-by-Step Guided Pitch Walkthrough (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Interactive Judging Checklist</span>
            </h2>
            <button
              onClick={() => {
                setCompletedSteps([]);
                setActiveStep(1);
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Checklist</span>
            </button>
          </div>

          <div className="space-y-3">
            {demoSteps.map((step) => {
              const isDone = completedSteps.includes(step.id);
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`rounded-xl border p-5 transition-all ${
                    isActive
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/30'
                      : isDone
                      ? 'bg-slate-900/60 border-emerald-500/40'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isActive
                            ? 'bg-cyan-600 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : step.id}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white">
                            {step.title}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                            {step.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Est. {step.time}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-slate-300">
                            <span className="font-semibold text-rose-400 block mb-0.5 uppercase text-[10px] font-mono">
                              The Clinical Bottleneck:
                            </span>
                            {step.problem}
                          </div>

                          <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-900/40 text-slate-300">
                            <span className="font-semibold text-cyan-400 block mb-0.5 uppercase text-[10px] font-mono">
                              RadiAssist Solution:
                            </span>
                            {step.solution}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                    <button
                      onClick={() => {
                        step.onTrigger();
                        handleStepComplete(step.id);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-950/40"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleStepComplete(step.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        isDone
                          ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isDone ? '✓ Verified by Judge' : 'Mark as Evaluated'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Real-time Jury Scorecard & Technical Rubric (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Jury Scorecard</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                Score: {totalScore} / 20
              </span>
            </div>

            {hasVoted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Evaluation Recorded!</h4>
                <p className="text-xs text-emerald-300">
                  Total Hackathon Score: <strong className="font-mono text-base">{totalScore}/20</strong>
                </p>
                <button
                  onClick={() => setHasVoted(false)}
                  className="mt-2 text-xs text-slate-400 underline hover:text-white"
                >
                  Adjust Scores
                </button>
              </div>
            ) : (
              <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs">
                {/* Rubric item 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">1. Problem-Solution Fit</span>
                    <span className="font-mono text-cyan-400">{juryScores.problemSolving} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={juryScores.problemSolving}
                    onChange={(e) =>
                      setJuryScores({ ...juryScores, problemSolving: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    Solves real radiologist triage bottlenecks vs routine backlogs.
                  </div>
                </div>

                {/* Rubric item 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">2. Technical Execution</span>
                    <span className="font-mono text-cyan-400">{juryScores.technicalExecution} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={juryScores.technicalExecution}
                    onChange={(e) =>
                      setJuryScores({ ...juryScores, technicalExecution: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    FastAPI backend, SQLAlchemy models, JWT auth, Web Speech API.
                  </div>
                </div>

                {/* Rubric item 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">3. UI/UX & Diagnostic Viewport</span>
                    <span className="font-mono text-cyan-400">{juryScores.uiUxDesign} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={juryScores.uiUxDesign}
                    onChange={(e) =>
                      setJuryScores({ ...juryScores, uiUxDesign: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    Zoom/Pan canvas, bone invert windowing, non-color priority badges.
                  </div>
                </div>

                {/* Rubric item 4 */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">4. Clinical Safety & Ethics</span>
                    <span className="font-mono text-cyan-400">{juryScores.clinicalSafety} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={juryScores.clinicalSafety}
                    onChange={(e) =>
                      setJuryScores({ ...juryScores, clinicalSafety: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    Mandatory decision support disclaimers & non-autonomous design.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Submit Hackathon Verdict</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Technical Architecture Specs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-2">
            <div className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Stack Architecture Verification</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Backend API:</span>
                <span className="text-cyan-400">FastAPI (Python)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Database:</span>
                <span className="text-emerald-400">SQLite + SQLAlchemy 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Auth / Security:</span>
                <span className="text-purple-400">JWT + Bcrypt Hashing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Frontend:</span>
                <span className="text-cyan-300">React 19 + TypeScript + Tailwind</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
