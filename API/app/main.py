import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.v1 import routes as v1_routers

app = FastAPI(title="AI Agent API")
app.include_router(v1_routers.router)

load_dotenv()
os.environ["ORIGINS"] = os.getenv("ORIGINS")
origins = os.environ.get("ORIGINS").split(" ")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to the AI Agent API"
    }
