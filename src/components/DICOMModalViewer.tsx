import React, { useState, useEffect } from 'react';
import { Study } from '../types';
import { ClinicalXRaySvg } from './viewer/ClinicalXRaySvg';
import {
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Contrast,
  Sliders,
  Sparkles,
  Layers,
  Activity,
  Mic,
  MicOff,
  CheckCircle,
  FileCheck,
  Send,
  AlertOctagon,
  Flame,
  Volume2,
  RefreshCw,
  Compass,
  Move
} from 'lucide-react';

interface DICOMModalViewerProps {
  study: Study | null;
  onClose: () => void;
  onFinalizeReport?: (studyId: number, findings: string, impression: string) => void;
}

export const DICOMModalViewer: React.FC<DICOMModalViewerProps> = ({
  study,
  onClose,
  onFinalizeReport,
}) => {
  if (!study) return null;

  // Image manipulation controls
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(115);
  const [invert, setInvert] = useState(false);
  const [showAIHeatmap, setShowAIHeatmap] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reporting & Voice dictation simulation
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
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [qaStatus, setQaStatus] = useState<'idle' | 'checking' | 'passed'>('idle');

  // Speech Recognition Simulation / Web Speech API
  useEffect(() => {
    let recognition: any = null;
    if (isRecording) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        try {
          recognition = new SpeechRec();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((r: any) => r[0].transcript)
              .join(' ');
            setVoiceTranscript(transcript);
          };
          recognition.start();
        } catch {
          simulateDictation();
        }
      } else {
        simulateDictation();
      }
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isRecording]);

  const simulateDictation = () => {
    const phrases = [
      "Visceral pleural edge visualized at apex...",
      "Lung markings absent in periphery...",
      "Tension signs noted, urgent chest tube placement advised...",
      "Heart size within upper normal limits...",
      "Costophrenic angles sharp."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < phrases.length) {
        setVoiceTranscript((prev) => (prev ? `${prev} ${phrases[idx]}` : phrases[idx]));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const handleApplyDictation = () => {
    if (voiceTranscript) {
      setFindings((prev) => `${prev}\n\n[Dictated]: ${voiceTranscript}`);
      setVoiceTranscript('');
      setIsRecording(false);
    }
  };

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
    setQaStatus('checking');
    setTimeout(() => {
      setQaStatus('passed');
    }, 800);
  };

  const getSvgType = (): 'pneumothorax' | 'pneumonia' | 'cardiomegaly' | 'normal' => {
    const finding = (study.aiAnalysis?.finding || '').toLowerCase();
    if (finding.includes('pneumothorax')) return 'pneumothorax';
    if (finding.includes('consolidation') || finding.includes('pneumonia') || finding.includes('infiltrate')) return 'pneumonia';
    if (finding.includes('cardiomegaly')) return 'cardiomegaly';
    return 'normal';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/10">
        
        {/* Header HUD Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyan-400 font-bold text-sm tracking-wider">
              DICOM WORKSTATION
            </span>
            <div className="h-4 w-px bg-slate-700" />
            <div className="text-xs">
              <span className="text-white font-semibold">{study.patient?.name}</span>
              <span className="text-slate-400 ml-2 font-mono">
                {study.patient?.patientCode} · {study.patient?.age}y/{study.patient?.gender}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                study.priority === 'CRITICAL'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                  : study.priority === 'ABNORMAL'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              [{study.priority}]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Diagnostic Viewport (Canvas) */}
          <div className="lg:col-span-8 bg-black flex flex-col relative select-none overflow-hidden">
            
            {/* Viewport Control Bar */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 z-10 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setInvert(!invert)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    invert ? 'bg-cyan-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  Invert
                </button>
                <button
                  onClick={() => setShowAIHeatmap(!showAIHeatmap)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    showAIHeatmap ? 'bg-cyan-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  AI Overlay
                </button>
                <button
                  onClick={handleResetFilters}
                  className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400"
                  title="Reset Canvas"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-slate-500" />
                  <span>{brightness}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Contrast className="w-3 h-3 text-slate-500" />
                  <span>{contrast}%</span>
                </div>
                <span>{(zoom * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Interactive Canvas Viewport */}
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
                <ClinicalXRaySvg
                  type={getSvgType()}
                  className="w-full h-full pointer-events-none rounded"
                  showOverlay={showAIHeatmap}
                />

                {showAIHeatmap && study.aiAnalysis?.keyRegions?.map((roi, idx) => (
                  <div
                    key={idx}
                    style={{
                      left: `${roi.x}%`,
                      top: `${roi.y}%`,
                      width: `${roi.width}%`,
                      height: `${roi.height}%`,
                    }}
                    className="absolute border-2 border-rose-500 bg-rose-500/20 rounded pointer-events-none"
                  >
                    <span className="absolute -top-5 left-0 bg-rose-950 text-rose-200 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">
                      {roi.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Viewport Info Overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 p-2 rounded text-[10px] font-mono text-slate-400 space-y-0.5 pointer-events-none">
                <div>MODALITY: {study.modality}</div>
                <div>BODY PART: {study.bodyPart}</div>
                <div>SERIES: 101/01 (CHEST PA)</div>
                <div>MATRIX: 2048 x 2048 (16-bit Lossless)</div>
              </div>
            </div>
          </div>

          {/* Right Reporting & Dictation Panel */}
          <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col overflow-y-auto">
            
            {/* AI Decision Support Summary Box */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-mono font-bold uppercase tracking-wider">
                  AI Prioritization Result
                </span>
                <span className="font-mono text-slate-400">
                  {study.aiAnalysis ? `${(study.aiAnalysis.confidence * 100).toFixed(1)}% Conf` : ''}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-white text-sm">
                  {study.aiAnalysis?.finding}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {study.aiAnalysis?.explanation}
                </p>
              </div>
            </div>

            {/* Live Voice Dictation & Report Editor */}
            <div className="p-4 flex-1 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Diagnostic Findings
                </span>
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>

              {voiceTranscript && (
                <div className="p-2.5 bg-slate-950 border border-cyan-500/40 rounded-lg text-xs font-mono space-y-2">
                  <div className="text-cyan-400 font-bold text-[10px]">LIVE TRANSCRIPT:</div>
                  <p className="text-slate-200">{voiceTranscript}</p>
                  <button
                    onClick={handleApplyDictation}
                    className="w-full py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold"
                  >
                    Insert Into Findings
                  </button>
                </div>
              )}

              <textarea
                rows={5}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Detailed anatomical findings..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
              />

              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Impression
              </span>
              <textarea
                rows={3}
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                placeholder="Final clinical impression..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
              />

              {/* Action Buttons */}
              <div className="pt-2 mt-auto space-y-2">
                <button
                  onClick={handleRunQA}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {qaStatus === 'checking'
                      ? 'Analyzing Discordances...'
                      : qaStatus === 'passed'
                      ? 'QA Passed: No Discordances'
                      : 'Run Automated Discordance QA'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (onFinalizeReport) {
                      onFinalizeReport(study.id, findings, impression);
                    }
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-colors"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Electronically Sign & Finalize</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
