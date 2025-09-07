from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth, chat

app = FastAPI(title="AI-Driven Public Health Chatbot")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Welcome to AI-Driven Public Health Chatbot API"}
