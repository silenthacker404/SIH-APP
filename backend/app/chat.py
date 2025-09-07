from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas
import random

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock disease data
DISEASES = {
    "malaria": {
        "cause": "Plasmodium parasite spread by Anopheles mosquito.",
        "symptoms": ["Fever", "Chills", "Sweating", "Headache", "Nausea"],
        "precautions": ["Use mosquito nets", "Avoid stagnant water", "Wear full-sleeve clothing"],
        "cure": ["Antimalarial medications (e.g., chloroquine, artemisinin-based)"],
        "danger": "High if untreated – can cause organ failure or death."
    },
    "tuberculosis": {
        "cause": "Mycobacterium tuberculosis bacteria.",
        "symptoms": ["Persistent cough", "Weight loss", "Night sweats", "Chest pain"],
        "precautions": ["BCG vaccination", "Wear masks", "Avoid close contact with TB patients"],
        "cure": ["6-month antibiotic course (isoniazid, rifampicin, etc.)"],
        "danger": "High if untreated – can spread to others and cause lung damage."
    }
}

@router.post("/ask", response_model=schemas.ChatResponse)
def ask_question(query: schemas.ChatQuery, db: Session = Depends(get_db)):
    disease = query.question.lower().strip()
    if disease not in DISEASES:
        return {"response": "Sorry, I don't have detailed information about this disease yet."}

    info = DISEASES[disease]
    response = (
        f"🔹 Disease: {disease.title()}\n\n"
        f"1️⃣ Cause:\n{info['cause']}\n\n"
        f"2️⃣ Symptoms:\n- " + "\n- ".join(info["symptoms"]) + "\n\n"
        f"3️⃣ Precautions:\n- " + "\n- ".join(info["precautions"]) + "\n\n"
        f"4️⃣ Cure:\n" + ", ".join(info["cure"]) + "\n\n"
        f"5️⃣ Danger Level:\n{info['danger']}"
    )

    # Save chat in DB
    new_chat = models.ChatHistory(user_id=1, query=query.question, response=response)  # for demo user_id=1
    db.add(new_chat)
    db.commit()

    return {"response": response}
