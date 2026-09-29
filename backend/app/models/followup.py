import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..database import Base

class FollowUpStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    study_id = Column(Integer, ForeignKey("studies.id"), nullable=False)
    recommendation = Column(Text, nullable=False)
    due_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(FollowUpStatus), default=FollowUpStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    patient = relationship("Patient", back_populates="followups")
    study = relationship("Study", back_populates="followups")
