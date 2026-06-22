from pydantic import BaseModel

class QuestionBase(BaseModel):
    topic: str
    question_text: str
    answer_text: str

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    is_approved: bool

    class Config:
        from_attributes = True

class AdminLoginRequest(BaseModel):
    username: str
    password: str