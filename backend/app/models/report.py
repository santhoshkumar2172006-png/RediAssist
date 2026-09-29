import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..database import Base

class ReportStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PRELIMINARY = "PRELIMINARY"
    FINAL = "FINAL"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("studies.id"), unique=True, nullable=False)
    radiologist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    findings = Column(Text, nullable=False)
    impression = Column(Text, nullable=False)
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.DRAFT, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    study = relationship("Study", back_populates="report")
    radiologist = relationship("User", back_populates="reports")
