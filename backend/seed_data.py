"""Standalone CLI script to reset and seed the RadiAssist SQLite database."""
import os
import sys

# Ensure backend root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine, SessionLocal
from app.models import (
    User, UserRole, Patient, Study, AIAnalysis, Report,
    CriticalAlert, FollowUp, Message, AuditLog,
    StudyPriority, StudyStatus, ReportStatus, AlertStatus, FollowUpStatus
)
from app.utils.security import get_password_hash
from app.config import settings

def seed():
    print("Initializing database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Creating demo users...")
        radiologist = User(
            name="Dr. Sarah Chen, MD",
            email="radiologist@demo.com",
            password_hash=get_password_hash(settings.DEMO_PASSWORD),
            role=UserRole.RADIOLOGIST,
        )
        doctor = User(
            name="Dr. Marcus Brody, MD (Emergency Medicine)",
            email="doctor@demo.com",
            password_hash=get_password_hash(settings.DEMO_PASSWORD),
            role=UserRole.REFERRING_DOCTOR,
        )
        admin = User(
            name="Clinical PACS Admin",
            email="admin@demo.com",
            password_hash=get_password_hash(settings.DEMO_PASSWORD),
            role=UserRole.ADMIN,
        )
        db.add_all([radiologist, doctor, admin])
        db.commit()

        print("Creating synthetic demo patients...")
        patients = [
            Patient(patient_code="RAD-PT-8021", name="Synthetic Patient Alpha", age=58, gender="M"),
            Patient(patient_code="RAD-PT-8022", name="Synthetic Patient Beta", age=44, gender="F"),
            Patient(patient_code="RAD-PT-8023", name="Synthetic Patient Gamma", age=71, gender="M"),
            Patient(patient_code="RAD-PT-8024", name="Synthetic Patient Delta", age=32, gender="F"),
            Patient(patient_code="RAD-PT-8025", name="Synthetic Patient Epsilon", age=66, gender="M"),
        ]
        db.add_all(patients)
        db.commit()

        print("Creating demo studies and AI triage records...")
        s1 = Study(
            patient_id=patients[0].id,
            modality="DX",
            body_part="CHEST",
            image_path="uploads/chest_pneumothorax.png",
            status=StudyStatus.UNREAD,
            priority=StudyPriority.CRITICAL,
        )
        s2 = Study(
            patient_id=patients[1].id,
            modality="DX",
            body_part="CHEST",
            image_path="uploads/chest_consolidation.png",
            status=StudyStatus.IN_PROGRESS,
            priority=StudyPriority.ABNORMAL,
        )
        s3 = Study(
            patient_id=patients[2].id,
            modality="DX",
            body_part="CHEST",
            image_path="uploads/chest_normal.png",
            status=StudyStatus.UNREAD,
            priority=StudyPriority.ROUTINE,
        )
        db.add_all([s1, s2, s3])
        db.commit()

        ai1 = AIAnalysis(
            study_id=s1.id,
            finding="Suspected Tension Pneumothorax (Right Hemithorax)",
            confidence=0.94,
            priority=StudyPriority.CRITICAL,
            explanation="AI detected apical pleural line with absent peripheral lung markings and mediastinal shift. Urgent decompression consultation indicated.",
            model_name="RadiAssist-TriageNet-v1.0"
        )
        ai2 = AIAnalysis(
            study_id=s2.id,
            finding="Right Lower Lobe Consolidation / Infiltrate",
            confidence=0.88,
            priority=StudyPriority.ABNORMAL,
            explanation="Dense alveolar opacification with air bronchograms in the right basilar region, consistent with focal pneumonia.",
            model_name="RadiAssist-TriageNet-v1.0"
        )
        ai3 = AIAnalysis(
            study_id=s3.id,
            finding="No Acute Cardiopulmonary Abnormality Detected",
            confidence=0.96,
            priority=StudyPriority.ROUTINE,
            explanation="Normal cardiothoracic ratio, clear costophrenic angles, normal pulmonary vascularity.",
            model_name="RadiAssist-TriageNet-v1.0"
        )
        db.add_all([ai1, ai2, ai3])

        # Critical alert for study 1
        alert = CriticalAlert(
            study_id=s1.id,
            recipient_id=doctor.id,
            message="CRITICAL FINDING: Suspected Tension Pneumothorax in patient RAD-PT-8021. Requires urgent review.",
            status=AlertStatus.PENDING,
        )
        db.add(alert)

        # Audit log entries
        db.add(AuditLog(user_id=admin.id, action="SYSTEM_INIT_COMPLETE", entity_type="SYSTEM", entity_id=1))
        db.add(AuditLog(user_id=radiologist.id, action="WORKLIST_VIEWED", entity_type="WORKLIST", entity_id=1))

        db.commit()
        print("Database seeded successfully with 3 users, 5 patients, and 3 studies!")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
