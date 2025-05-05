from fastapi import APIRouter
from app.models.v1.message import MessageInput
from app.models.v1.image import ImageInput
from fastapi.responses import StreamingResponse

from app.services.v2.agent import direct_chat, direct_image

router = APIRouter(prefix="/v2", tags=["v2"])


@router.post("/")
async def direct(input: MessageInput):
    response = direct_chat(input.model_dump())
    return StreamingResponse(response, media_type="text/plain")


@router.post("/image")
async def image(input: ImageInput):
    response = direct_image(input.model_dump())
    return StreamingResponse(response, media_type="text/plain")