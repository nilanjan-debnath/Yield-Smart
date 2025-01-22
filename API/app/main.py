from .routers import routes
from fastapi import FastAPI


app = FastAPI()
app.include_router(routes.router)


@app.get("/")
async def index() -> dict:
    return {"message": "API is working!!!"}
