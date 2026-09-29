from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class PatientBase(BaseModel):
    patient_code: str
    name: str
    age: int
    gender: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
