import os
import secrets
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from .database import engine, Base, get_db
from . import models, schemas

# Secure, random admin session token generated dynamically at server start
ADMIN_SESSION_TOKEN = secrets.token_hex(32)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Retry database connection in case the db container is still initializing
    retries = 5
    connected = False
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            connected = True
            print("Successfully connected to database and created tables.")
            break
        except Exception as e:
            retries -= 1
            print(f"Database connection failed: {e}. Retrying in 2 seconds... ({retries} retries left)")
            time.sleep(2)
    if not connected:
        print("CRITICAL: Failed to establish database connection during startup.")
    yield

app = FastAPI(title="PipelinePrep API", version="1.0.0", lifespan=lifespan)

# Enable CORS for cross-platform decoupling (crucial for future S3 integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Fine for MVP development; restrict this later in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. User Submission Route (Saves as pending approval)
@app.post("/questions", response_model=schemas.QuestionResponse, status_code=201)
def submit_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_question = models.Question(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# 2. Public Route: Fetch only approved entries by default
@app.get("/questions", response_model=List[schemas.QuestionResponse])
def get_approved_questions(topic: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Question).filter(models.Question.is_approved == True)
    if topic:
        query = query.filter(models.Question.topic == topic.lower())
    return query.all()

# 3. Admin Login & Authorization Security Handler
def verify_admin_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Credentials required (invalid token format)")
    token = authorization.split(" ")[1]
    if token != ADMIN_SESSION_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid admin token")
    return token

@app.post("/admin/login")
def admin_login(credentials: schemas.AdminLoginRequest):
    expected_user = os.getenv("ADMIN_USER", "admin")
    expected_pass = os.getenv("ADMIN_PASS", "Omer2001")
    if credentials.username == expected_user and credentials.password == expected_pass:
        return {"token": ADMIN_SESSION_TOKEN}
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

# 4. Admin Route: Fetch all pending submissions
@app.get("/admin/pending", response_model=List[schemas.QuestionResponse])
def get_pending_questions(db: Session = Depends(get_db), token: str = Depends(verify_admin_token)):
    return db.query(models.Question).filter(models.Question.is_approved == False).all()

# 5. Admin Route: Approve a pending question
@app.put("/admin/questions/{question_id}/approve", response_model=schemas.QuestionResponse)
def approve_question(question_id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin_token)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="Question entry not found")
    
    db_question.is_approved = True
    db.commit()
    db.refresh(db_question)
    return db_question

# 6. Admin Route: Reject a pending question
@app.delete("/admin/questions/{question_id}/reject")
def reject_question(question_id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin_token)):
    db_question = db.query(models.Question).filter(models.Question.id == question_id).first()
    
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    db.delete(db_question)
    db.commit()
    return {"message": "Question successfully rejected and deleted"}