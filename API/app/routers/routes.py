from ..agent import agent
from fastapi import APIRouter
from typing import Optional
from pydantic import BaseModel, HttpUrl

router = APIRouter(prefix="/agent")


class InputInfo(BaseModel):
    input: str
    image: Optional[HttpUrl] = None


@router.post("/")
async def read_items(input: InputInfo) -> dict:
    response = agent.direct_chat(input.model_dump())
    return {"output": response}


class FirebaseInfo(BaseModel):
    id: str
    index: int


@router.post("/chat")
async def chat(input: FirebaseInfo) -> dict:
    response = agent.groot_ai(input.model_dump())
    return {"output": response}


class ImageInfo(BaseModel):
    image: HttpUrl


@router.post("/image")
async def image(input: ImageInfo) -> dict:
    response = agent.direct_image(input.model_dump())
    return {"output": response}
