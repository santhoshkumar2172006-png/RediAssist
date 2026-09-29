import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from ..database import Base

class StudyPriority(str, enum.Enum):
    CRITICAL = "CRITICAL"
    ABNORMAL = "ABNORMAL"
    ROUTINE = "ROUTINE"

class StudyStatus(str, enum.Enum):
    UNREAD = "UNREAD"
    IN_PROGRESS = "IN_PROGRESS"
    REPORTED = "REPORTED"
    FINALIZED = "FINALIZED"

class Study(Base):
    __tablename__ = "studies"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    modality = Column(String(20), default="DX", nullable=False)  # DX, CR, CT, MR
    body_part = Column(String(50), default="CHEST", nullable=False)
    image_path = Column(String(255), nullable=False)
    study_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(SQLEnum(StudyStatus), default=StudyStatus.UNREAD, nullable=False)
    priority = Column(SQLEnum(StudyPriority), default=StudyPriority.ROUTINE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    patient = relationship("Patient", back_populates="studies")
    ai_analysis = relationship("AIAnalysis", back_populates="study", uselist=False, cascade="all, delete-orphan")
    report = relationship("Report", back_populates="study", uselist=False, cascade="all, delete-orphan")
    alerts = relationship("CriticalAlert", back_populates="study", cascade="all, delete-orphan")
    followups = relationship("FollowUp", back_populates="study", cascade="all, delete-orphan")

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("studies.id"), unique=True, nullable=False)
    finding = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False)
    priority = Column(SQLEnum(StudyPriority), default=StudyPriority.ROUTINE, nullable=False)
    explanation = Column(Text, nullable=False)
    model_name = Column(String(100), default="RadiAssist-Demo-DenseNet121", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    study = relationship("Study", back_populates="ai_analysis")
