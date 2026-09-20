"""
DementAI Machine Learning Microservice (FastAPI / Port 8000)
-------------------------------------------------------------
Provides standalone REST API endpoints for automatic speech transcription,
visual memory evaluation, spontaneous narrative syntax analysis, Stroop
color-word reaction scoring, and digit-span working memory matrix scoring.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn

# Import domain evaluators from local modules
from picture_recall import evaluate_transcript as evaluate_picture_recall
from structured_speech import evaluate_structured_speech
from stroop_evaluator import evaluate_stroop
from digit_evaluator import evaluate_digit_span
from transcriber import transcribe_audio

app = FastAPI(
    title="DementAI Machine Learning Microservice",
    description="Cognitive Biometric & Voice Analysis Microservice Engine",
    version="1.0.0"
)

# CORS middleware enabling cross-service calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from digit_evaluator import ValidationError

# Pydantic Schemas for Request Data Validation
class PictureRecallRequest(BaseModel):
    transcript_text: str = Field(..., max_length=10000, example="I see a bench, green tree, and a dog")
    duration_seconds: Optional[float] = Field(default=60.0, ge=1.0, le=3600.0, example=60.0)


class StructuredSpeechRequest(BaseModel):
    transcript_text: str = Field(..., max_length=10000, example="I wake up early because I enjoy fresh morning air")
    duration_seconds: Optional[float] = Field(default=60.0, ge=1.0, le=3600.0, example=60.0)


class StroopRequest(BaseModel):
    accuracy_percent: int = Field(..., ge=0, le=100, example=90)
    avg_reaction_ms: int = Field(..., ge=100, le=5000, example=850)
    total_rounds: Optional[int] = Field(default=10, ge=1, le=100, example=10)


class DigitSpanRequest(BaseModel):
    max_span: int = Field(..., ge=0, le=20, example=5)
    correct_rounds: int = Field(..., ge=0, example=4)
    total_rounds: Optional[int] = Field(default=5, ge=1, le=50, example=5)


class TranscribeRequest(BaseModel):
    audio_path: str = Field(..., max_length=1000, example="path/to/recording.wav")
    model_size: Optional[str] = Field(default="tiny", example="tiny")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "DementAI Machine Learning Microservice Engine",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "picture_recall": "/evaluate/picture-recall",
            "structured_speech": "/evaluate/structured-speech",
            "stroop": "/evaluate/stroop",
            "digit_span": "/evaluate/digit-span",
            "transcribe": "/evaluate/transcribe"
        }
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "DementAI ML Microservice Engine",
        "version": "1.0.0",
        "port": 8000
    }


@app.post("/evaluate/picture-recall")
def evaluate_picture(req: PictureRecallRequest):
    try:
        result = evaluate_picture_recall(req.transcript_text, req.duration_seconds)
        return {"ok": True, "result": result}
    except (ValidationError, ValueError) as ve:
        raise HTTPException(status_code=400, detail=f"Picture recall validation error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Picture recall evaluation error: {str(e)}")


@app.post("/evaluate/structured-speech")
def evaluate_speech(req: StructuredSpeechRequest):
    try:
        result = evaluate_structured_speech(req.transcript_text, req.duration_seconds)
        return {"ok": True, "result": result}
    except (ValidationError, ValueError) as ve:
        raise HTTPException(status_code=400, detail=f"Structured speech validation error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Structured speech evaluation error: {str(e)}")


@app.post("/evaluate/stroop")
def evaluate_stroop_endpoint(req: StroopRequest):
    try:
        result = evaluate_stroop(req.accuracy_percent, req.avg_reaction_ms, req.total_rounds)
        return {"ok": True, "result": result}
    except (ValidationError, ValueError) as ve:
        raise HTTPException(status_code=400, detail=f"Stroop validation error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stroop evaluation error: {str(e)}")


@app.post("/evaluate/digit-span")
def evaluate_digit_endpoint(req: DigitSpanRequest):
    try:
        result = evaluate_digit_span(req.max_span, req.correct_rounds, req.total_rounds)
        return {"ok": True, "result": result}
    except (ValidationError, ValueError) as ve:
        raise HTTPException(status_code=400, detail=f"Digit span validation error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Digit span evaluation error: {str(e)}")


@app.post("/evaluate/transcribe")
def transcribe_endpoint(req: TranscribeRequest):
    try:
        result = transcribe_audio(req.audio_path, req.model_size)
        return {"ok": True, "result": result}
    except (ValidationError, ValueError) as ve:
        raise HTTPException(status_code=400, detail=f"Transcription validation error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
