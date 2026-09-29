import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RadiAssist API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "radiassist-insecure-prototype-secret-key-change-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./radiassist.db")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    DEMO_PASSWORD: str = os.getenv("DEMO_PASSWORD", "RadiAssistDemo2026!")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
