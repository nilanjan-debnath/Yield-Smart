import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.v1 import routers as v1_routers
from app.controllers.v2 import routers as v2_routers

app = FastAPI(title="Yield Smart API")
app.include_router(v1_routers.router)
app.include_router(v2_routers.router)

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

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Yield Smart API</title>
    </head>
    <body>
        <div class="bg-gray-200 p-4 rounded-lg shadow-lg">
            <h1>Welcome to the Yield Smart API for AI Agent</h1>
            <ul>
                <li><a href="/docs">/docs</a></li>
                <li><a href="/redoc">/redoc</a></li>
            </ul>
        </div>
    </body>
</html>
"""


@app.get("/")
async def root():
    return HTMLResponse(html)
