from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from ..models.study import StudyPriority, StudyStatus
from .patient import PatientResponse

class AIAnalysisResponse(BaseModel):
    id: int
    study_id: int
    finding: str
    confidence: float
    priority: StudyPriority
    explanation: str
    model_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class StudyBase(BaseModel):
    patient_id: int
    modality: str = "DX"
    body_part: str = "CHEST"
    image_path: str
    priority: StudyPriority = StudyPriority.ROUTINE

class StudyCreate(StudyBase):
    pass

class StudyResponse(BaseModel):
    id: int
    patient_id: int
    modality: str
    body_part: str
    image_path: str
    study_date: datetime
    status: StudyStatus
    priority: StudyPriority
    created_at: datetime
    patient: Optional[PatientResponse] = None
    ai_analysis: Optional[AIAnalysisResponse] = None

    class Config:
        from_attributes = True
