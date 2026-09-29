import React, { useState } from 'react';
import { Study, StudyPriority } from '../types';
import { Button } from './ui/DesignSystem';
import { Upload, X, AlertTriangle, FileImage } from 'lucide-react';

interface UploadStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudyUploaded: (newStudy: Study) => void;
}

export const UploadStudyModal: React.FC<UploadStudyModalProps> = ({
  isOpen,
  onClose,
  onStudyUploaded,
}) => {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [patientCode, setPatientCode] = useState('RAD-PT-8026');
  const [age, setAge] = useState(54);
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [modality, setModality] = useState<'DX' | 'CR'>('DX');
  const [bodyPart, setBodyPart] = useState('CHEST PA');
  const [simulatedCondition, setSimulatedCondition] = useState<'pneumothorax' | 'pneumonia' | 'normal'>('pneumothorax');
  const [analyzing, setAnalyzing] = useState(false);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    setTimeout(() => {
      let priority: StudyPriority = 'ROUTINE';
      let finding = 'No acute cardiopulmonary abnormality';
      let explanation = 'Clear lung fields, normal cardiomediastinal silhouette.';
      let confidence = 0.95;
      let rois: any[] = [];
      let imgPath = 'dicom://internal-cxr-series/normal';

      if (simulatedCondition === 'pneumothorax') {
        priority = 'CRITICAL';
        finding = 'Suspected Tension Pneumothorax (Right Apex)';
        explanation = 'Sharp visceral pleural edge with absence of peripheral markings and contralateral mediastinal shift.';
        confidence = 0.946;
        rois = [{ x: 54, y: 16, width: 36, height: 42, label: 'Apical Pleural Air' }];
        imgPath = 'dicom://internal-cxr-series/pneumothorax';
      } else if (simulatedCondition === 'pneumonia') {
        priority = 'ABNORMAL';
        finding = 'Right Middle / Lower Lobe Infiltrate';
        explanation = 'Alveolar consolidation with prominent air bronchograms consistent with focal pneumonia.';
        confidence = 0.892;
        rois = [{ x: 50, y: 52, width: 30, height: 26, label: 'Alveolar Opacity' }];
        imgPath = 'dicom://internal-cxr-series/pneumonia';
      }

      const newStudy: Study = {
        id: Math.floor(Math.random() * 800) + 300,
        patientId: Math.floor(Math.random() * 800) + 500,
        modality,
        bodyPart,
        imagePath: imgPath,
        studyDate: new Date().toISOString(),
        status: 'UNREAD',
        priority,
        createdAt: new Date().toISOString(),
        patient: {
          id: Math.floor(Math.random() * 800) + 500,
          patientCode,
          name: patientName,
          age,
          gender,
          createdAt: new Date().toISOString(),
        },
        aiAnalysis: {
          id: Math.floor(Math.random() * 800) + 900,
          studyId: Math.floor(Math.random() * 800) + 300,
          finding,
          confidence,
          priority,
          explanation,
          modelName: 'RadiAssist-TriageNet-v1.0 (DenseNet121)',
          createdAt: new Date().toISOString(),
          keyRegions: rois,
        },
      };

      setAnalyzing(false);
      onStudyUploaded(newStudy);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white border border-[#E4E7EC] rounded-lg overflow-hidden shadow-lg">
        <div className="p-3.5 border-b border-[#E4E7EC] bg-[#F8FAFC] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
            Ingest Radiographic Study (CXR / DICOM)
          </h2>
          <button onClick={onClose} className="p-1 rounded text-[#667085] hover:text-[#172033]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSimulateUpload} className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#344054] font-medium mb-1">Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033]"
              />
            </div>
            <div>
              <label className="block text-[#344054] font-medium mb-1">MRN Code</label>
              <input
                type="text"
                required
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#344054] font-medium mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033]"
              />
            </div>
            <div>
              <label className="block text-[#344054] font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033]"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-[#344054] font-medium mb-1">Modality</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033] font-mono"
              >
                <option value="DX">DX (Digital)</option>
                <option value="CR">CR (Computed)</option>
              </select>
            </div>
          </div>

          {/* Test condition simulator */}
          <div className="p-2.5 bg-[#F8FAFC] border border-[#E4E7EC] rounded space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-[#667085] font-semibold block">
              Simulation Preset for Triage:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <label className="flex items-center gap-1.5 p-1.5 rounded border border-[#E4E7EC] bg-white cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={simulatedCondition === 'pneumothorax'}
                  onChange={() => setSimulatedCondition('pneumothorax')}
                  className="accent-red-600"
                />
                <span className="text-red-700 font-medium">Critical</span>
              </label>
              <label className="flex items-center gap-1.5 p-1.5 rounded border border-[#E4E7EC] bg-white cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={simulatedCondition === 'pneumonia'}
                  onChange={() => setSimulatedCondition('pneumonia')}
                  className="accent-amber-600"
                />
                <span className="text-amber-800 font-medium">Abnormal</span>
              </label>
              <label className="flex items-center gap-1.5 p-1.5 rounded border border-[#E4E7EC] bg-white cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={simulatedCondition === 'normal'}
                  onChange={() => setSimulatedCondition('normal')}
                  className="accent-slate-600"
                />
                <span className="text-slate-700 font-medium">Routine</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#F2F4F7]">
            <Button size="sm" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" disabled={analyzing}>
              <span>{analyzing ? 'Ingesting...' : 'Ingest & Triage'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
