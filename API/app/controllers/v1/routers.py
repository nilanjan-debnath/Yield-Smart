from fastapi import APIRouter
from app.models.v1.message import MessageInput
from app.models.v1.chat import ChatInput
from app.models.v1.image import ImageInput

from app.services.v1.agent import direct_chat, groot_ai, direct_image

router = APIRouter(prefix="/v1", tags=["v1"])


@router.post("/")
async def direct(input: MessageInput) -> dict:
    response = await direct_chat(input.model_dump())
    return {"output": response}


@router.post("/chat")
async def chat(input: ChatInput) -> dict:
    response = await groot_ai(input.model_dump())
    return {"output": response}


@router.post("/image")
async def image(input: ImageInput) -> dict:
    response = await direct_image(input.model_dump())
    return {"output": response}
