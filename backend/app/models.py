from sqlalchemy import Column, Integer, String, Boolean, Text
from .database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(50), index=True, nullable=False) # e.g., "k8s", "aws", "network"
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False)  # Pending admin approval by default