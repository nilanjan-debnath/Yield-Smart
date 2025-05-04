import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import routes

app = FastAPI()
app.include_router(routes.router)

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
async def index() -> dict:
    return {"message": "API is working!!!"}
