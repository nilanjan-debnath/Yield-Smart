from pydantic import BaseModel

class ChatInput(BaseModel):
    id: str
    index: int