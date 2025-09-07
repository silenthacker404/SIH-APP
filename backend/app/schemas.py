from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChatQuery(BaseModel):
    question: str

class ChatResponse(BaseModel):
    response: str
