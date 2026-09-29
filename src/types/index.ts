export type UserRole = 'RADIOLOGIST' | 'REFERRING_DOCTOR' | 'ADMIN';

export type StudyPriority = 'CRITICAL' | 'ABNORMAL' | 'ROUTINE';

export type StudyStatus = 'UNREAD' | 'IN_PROGRESS' | 'REPORTED' | 'FINALIZED';

export type ReportStatus = 'DRAFT' | 'PRELIMINARY' | 'FINAL';

export type AlertStatus = 'PENDING' | 'ACKNOWLEDGED' | 'ESCALATED';

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Patient {
  id: number;
  patientCode: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  createdAt: string;
}

export interface AIAnalysis {
  id: number;
  studyId: number;
  finding: string;
  confidence: number;
  priority: StudyPriority;
  explanation: string;
  modelName: string;
  createdAt: string;
  keyRegions?: { x: number; y: number; width: number; height: number; label: string }[];
}

export interface Study {
  id: number;
  patientId: number;
  modality: 'DX' | 'CR' | 'CT' | 'MR';
  bodyPart: string;
  imagePath: string;
  studyDate: string;
  status: StudyStatus;
  priority: StudyPriority;
  createdAt: string;
  patient?: Patient;
  aiAnalysis?: AIAnalysis;
  report?: Report;
}

export interface Report {
  id: number;
  studyId: number;
  radiologistId: number;
  radiologistName?: string;
  findings: string;
  impression: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CriticalAlert {
  id: number;
  studyId: number;
  recipientId: number;
  recipientName?: string;
  patientCode: string;
  patientName: string;
  message: string;
  status: AlertStatus;
  createdAt: string;
  acknowledgedAt?: string;
  escalatedAt?: string;
}

export interface FollowUp {
  id: number;
  patientId: number;
  studyId: number;
  recommendation: string;
  dueDate: string;
  status: FollowUpStatus;
  createdAt: string;
  completedAt?: string;
}

export interface AuditLog {
  id: number;
  userId?: number;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: number;
  createdAt: string;
}

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
  database: 'connected' | 'disconnected' | 'simulated';
}
