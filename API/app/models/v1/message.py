from typing import Optional
from pydantic import BaseModel, HttpUrl


class MessageInput(BaseModel):
    input: str
    image: Optional[HttpUrl] = None
