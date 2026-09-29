import { User, Patient, Study, CriticalAlert, FollowUp, AuditLog } from '../types';

export const DEMO_PASSWORD = "RadiAssistDemo2026!";

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen, MD",
    email: "radiologist@demo.com",
    role: "RADIOLOGIST",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: 2,
    name: "Dr. Marcus Brody, MD (Emergency Medicine)",
    email: "doctor@demo.com",
    role: "REFERRING_DOCTOR",
    createdAt: "2026-09-01T08:30:00Z",
  },
  {
    id: 3,
    name: "Clinical PACS Admin",
    email: "admin@demo.com",
    role: "ADMIN",
    createdAt: "2026-09-01T07:00:00Z",
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 101,
    patientCode: "RAD-PT-8021",
    name: "Eleanor Vance",
    age: 58,
    gender: "F",
    createdAt: "2026-09-28T08:15:00Z",
  },
  {
    id: 102,
    patientCode: "RAD-PT-8022",
    name: "Arthur Pendelton",
    age: 64,
    gender: "M",
    createdAt: "2026-09-28T08:45:00Z",
  },
  {
    id: 103,
    patientCode: "RAD-PT-8023",
    name: "Clara Oswald",
    age: 39,
    gender: "F",
    createdAt: "2026-09-28T09:10:00Z",
  },
  {
    id: 104,
    patientCode: "RAD-PT-8024",
    name: "James Sterling",
    age: 72,
    gender: "M",
    createdAt: "2026-09-28T09:30:00Z",
  },
  {
    id: 105,
    patientCode: "RAD-PT-8025",
    name: "David Kim",
    age: 48,
    gender: "M",
    createdAt: "2026-09-28T09:55:00Z",
  },
];

export const INITIAL_STUDIES: Study[] = [
  {
    id: 201,
    patientId: 101,
    modality: "DX",
    bodyPart: "CHEST PA/LATERAL",
    imagePath: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    studyDate: "2026-09-28T08:20:00Z",
    status: "UNREAD",
    priority: "CRITICAL",
    createdAt: "2026-09-28T08:20:00Z",
    patient: INITIAL_PATIENTS[0],
    aiAnalysis: {
      id: 301,
      studyId: 201,
      finding: "Suspected Tension Pneumothorax (Right Hemithorax)",
      confidence: 0.942,
      priority: "CRITICAL",
      explanation: "Significant right visceral pleural edge with absence of peripheral vascular markings and subtle contralateral mediastinal shift. Emergency decompression triage recommended.",
      modelName: "RadiAssist-TriageNet-v1.0 (DenseNet121)",
      createdAt: "2026-09-28T08:21:14Z",
      keyRegions: [
        { x: 55, y: 18, width: 35, height: 42, label: "Pleural line / absent markings" }
      ]
    },
  },
  {
    id: 202,
    patientId: 102,
    modality: "DX",
    bodyPart: "CHEST AP PORTABLE",
    imagePath: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
    studyDate: "2026-09-28T08:50:00Z",
    status: "IN_PROGRESS",
    priority: "ABNORMAL",
    createdAt: "2026-09-28T08:50:00Z",
    patient: INITIAL_PATIENTS[1],
    aiAnalysis: {
      id: 302,
      studyId: 202,
      finding: "Right Lower Lobe Consolidation with Air Bronchograms",
      confidence: 0.887,
      priority: "ABNORMAL",
      explanation: "Focal alveolar airspace opacification in the right retrocardiac and lower lobe distribution, suggestive of acute bacterial pneumonia.",
      modelName: "RadiAssist-TriageNet-v1.0 (DenseNet121)",
      createdAt: "2026-09-28T08:51:02Z",
      keyRegions: [
        { x: 52, y: 55, width: 28, height: 25, label: "Basilar alveolar infiltrate" }
      ]
    },
  },
  {
    id: 203,
    patientId: 103,
    modality: "DX",
    bodyPart: "CHEST PA/LATERAL",
    imagePath: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    studyDate: "2026-09-28T09:15:00Z",
    status: "UNREAD",
    priority: "ROUTINE",
    createdAt: "2026-09-28T09:15:00Z",
    patient: INITIAL_PATIENTS[2],
    aiAnalysis: {
      id: 303,
      studyId: 203,
      finding: "No Acute Cardiopulmonary Abnormality Detected",
      confidence: 0.965,
      priority: "ROUTINE",
      explanation: "Lungs are clear bilaterally without consolidation, pneumothorax, or pleural effusion. Cardiothoracic silhouette is within normal physiological limits.",
      modelName: "RadiAssist-TriageNet-v1.0 (DenseNet121)",
      createdAt: "2026-09-28T09:15:45Z"
    },
  },
  {
    id: 204,
    patientId: 104,
    modality: "CR",
    bodyPart: "CHEST AP",
    imagePath: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    studyDate: "2026-09-28T09:35:00Z",
    status: "REPORTED",
    priority: "ABNORMAL",
    createdAt: "2026-09-28T09:35:00Z",
    patient: INITIAL_PATIENTS[3],
    aiAnalysis: {
      id: 304,
      studyId: 204,
      finding: "Cardiomegaly with Mild Pulmonary Venous Congestion",
      confidence: 0.892,
      priority: "ABNORMAL",
      explanation: "Cardiothoracic ratio exceeds 0.55. Cephalization of pulmonary vessels noted, compatible with mild volume overload.",
      modelName: "RadiAssist-TriageNet-v1.0 (DenseNet121)",
      createdAt: "2026-09-28T09:36:10Z"
    },
    report: {
      id: 401,
      studyId: 204,
      radiologistId: 1,
      radiologistName: "Dr. Sarah Chen, MD",
      findings: "Cardiac silhouette is moderately enlarged. Upper lobe vascular distension without frank alveolar edema. Costophrenic sulci remain clear.",
      impression: "Mild congestive cardiac failure signs. Compare with echocardiogram.",
      status: "FINAL",
      createdAt: "2026-09-28T09:42:00Z",
      updatedAt: "2026-09-28T09:45:00Z"
    }
  },
  {
    id: 205,
    patientId: 105,
    modality: "DX",
    bodyPart: "CHEST PA",
    imagePath: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    studyDate: "2026-09-28T10:00:00Z",
    status: "UNREAD",
    priority: "CRITICAL",
    createdAt: "2026-09-28T10:00:00Z",
    patient: INITIAL_PATIENTS[4],
    aiAnalysis: {
      id: 305,
      studyId: 205,
      finding: "Left Sided Moderate Pleural Effusion / Hemothorax",
      confidence: 0.915,
      priority: "CRITICAL",
      explanation: "Blunting of left costophrenic angle with meniscus sign up to mid-lung field. Prompt drainage and evaluation indicated.",
      modelName: "RadiAssist-TriageNet-v1.0 (DenseNet121)",
      createdAt: "2026-09-28T10:01:05Z",
      keyRegions: [
        { x: 15, y: 60, width: 32, height: 30, label: "Left meniscus blunting" }
      ]
    },
  },
];

export const INITIAL_ALERTS: CriticalAlert[] = [
  {
    id: 501,
    studyId: 201,
    recipientId: 2,
    recipientName: "Dr. Marcus Brody, MD (Emergency Medicine)",
    patientCode: "RAD-PT-8021",
    patientName: "Eleanor Vance",
    message: "CRITICAL NOTIFICATION: AI Triage flagged Suspected Tension Pneumothorax (Right Hemithorax) on patient RAD-PT-8021. Radiologist preliminary verification in progress.",
    status: "PENDING",
    createdAt: "2026-09-28T08:22:00Z",
  },
  {
    id: 502,
    studyId: 205,
    recipientId: 2,
    recipientName: "Dr. Marcus Brody, MD (Emergency Medicine)",
    patientCode: "RAD-PT-8025",
    patientName: "David Kim",
    message: "CRITICAL NOTIFICATION: Acute Moderate Pleural Effusion on DX Chest. Correlation with thoracentesis team requested.",
    status: "PENDING",
    createdAt: "2026-09-28T10:02:00Z",
  }
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 601,
    patientId: 102,
    studyId: 202,
    recommendation: "Repeat PA/Lateral Chest X-ray in 4-6 weeks to confirm resolution of right lower lobe consolidation.",
    dueDate: "2026-10-28T00:00:00Z",
    status: "PENDING",
    createdAt: "2026-09-28T08:55:00Z",
  },
  {
    id: 602,
    patientId: 104,
    studyId: 204,
    recommendation: "Transthoracic echocardiogram to evaluate left ventricular ejection fraction and cardiac chamber dimensions.",
    dueDate: "2026-10-12T00:00:00Z",
    status: "PENDING",
    createdAt: "2026-09-28T09:45:00Z",
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 701,
    userId: 3,
    userName: "Clinical PACS Admin",
    action: "SYSTEM_INITIALIZED",
    entityType: "SYSTEM",
    entityId: 1,
    createdAt: "2026-09-28T07:00:00Z",
  },
  {
    id: 702,
    userId: 1,
    userName: "Dr. Sarah Chen, MD",
    action: "WORKLIST_ACCESSED",
    entityType: "STUDY_QUEUE",
    entityId: 201,
    createdAt: "2026-09-28T08:21:40Z",
  },
  {
    id: 703,
    userId: 1,
    userName: "Dr. Sarah Chen, MD",
    action: "AI_TRIAGE_CONFIRMED",
    entityType: "AI_ANALYSIS",
    entityId: 301,
    createdAt: "2026-09-28T08:22:10Z",
  },
  {
    id: 704,
    userId: 1,
    userName: "Dr. Sarah Chen, MD",
    action: "CRITICAL_ALERT_DISPATCHED",
    entityType: "CRITICAL_ALERT",
    entityId: 501,
    createdAt: "2026-09-28T08:22:30Z",
  },
  {
    id: 705,
    userId: 1,
    userName: "Dr. Sarah Chen, MD",
    action: "REPORT_FINALIZED",
    entityType: "REPORT",
    entityId: 401,
    createdAt: "2026-09-28T09:45:00Z",
  },
];
