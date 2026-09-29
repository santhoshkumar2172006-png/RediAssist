from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import engine, Base, SessionLocal
from .models import User, UserRole, Patient, Study, AIAnalysis, Report, CriticalAlert, FollowUp, Message, AuditLog
from .models.study import StudyPriority, StudyStatus
from .routers import auth_router
from .utils.security import get_password_hash

def init_db_and_seed():
    """Initializes tables and seeds initial demo users and synthetic clinical data if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Demo Users if not present
        demo_users = [
            {
                "email": "radiologist@demo.com",
                "name": "Dr. Sarah Chen, MD",
                "role": UserRole.RADIOLOGIST,
                "password": settings.DEMO_PASSWORD,
            },
            {
                "email": "doctor@demo.com",
                "name": "Dr. Marcus Brody, MD (Emergency Medicine)",
                "role": UserRole.REFERRING_DOCTOR,
                "password": settings.DEMO_PASSWORD,
            },
            {
                "email": "admin@demo.com",
                "name": "Clinical PACS Admin",
                "role": UserRole.ADMIN,
                "password": settings.DEMO_PASSWORD,
            },
        ]

        for user_data in demo_users:
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing:
                user = User(
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=get_password_hash(user_data["password"]),
                    role=user_data["role"]
                )
                db.add(user)
        db.commit()

        # 2. Seed initial synthetic demonstration patient & study if empty
        if db.query(Patient).count() == 0:
            p1 = Patient(patient_code="RAD-PT-8021", name="Synthetic Patient Alpha", age=58, gender="M")
            p2 = Patient(patient_code="RAD-PT-8022", name="Synthetic Patient Beta", age=44, gender="F")
            p3 = Patient(patient_code="RAD-PT-8023", name="Synthetic Patient Gamma", age=71, gender="M")
            db.add_all([p1, p2, p3])
            db.commit()

            # Seed a critical study with AI triage
            s1 = Study(
                patient_id=p1.id,
                modality="DX",
                body_part="CHEST",
                image_path="uploads/chest_pneumothorax_demo.png",
                status=StudyStatus.UNREAD,
                priority=StudyPriority.CRITICAL
            )
            s2 = Study(
                patient_id=p2.id,
                modality="DX",
                body_part="CHEST",
                image_path="uploads/chest_consolidation_demo.png",
                status=StudyStatus.IN_PROGRESS,
                priority=StudyPriority.ABNORMAL
            )
            s3 = Study(
                patient_id=p3.id,
                modality="DX",
                body_part="CHEST",
                image_path="uploads/chest_normal_demo.png",
                status=StudyStatus.UNREAD,
                priority=StudyPriority.ROUTINE
            )
            db.add_all([s1, s2, s3])
            db.commit()

            ai1 = AIAnalysis(
                study_id=s1.id,
                finding="Suspected Tension Pneumothorax (Right Hemithorax)",
                confidence=0.94,
                priority=StudyPriority.CRITICAL,
                explanation="AI detected apical pleural line with absent peripheral lung markings and mediastinal shift. Immediate clinical correlation required.",
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
            db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables and seed demo data
    init_db_and_seed()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="RadiAssist - AI-Powered Radiology Workflow Copilot Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint required by specification
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "RadiAssist API"
    }

# Mount Auth router
app.include_router(auth_router, prefix="/api")
