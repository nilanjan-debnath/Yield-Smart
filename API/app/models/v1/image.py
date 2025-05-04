from pydantic import BaseModel, HttpUrl


class ImageInput(BaseModel):
    image: HttpUrl
