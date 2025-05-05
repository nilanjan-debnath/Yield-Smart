import os
from pathlib import Path
from google import genai
from dotenv import load_dotenv
from typing import AsyncGenerator
from .tools import web_search, image_analysis

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")


current_dir = Path(__file__).parent
preamble_chat_file = current_dir / "preamble_chat.txt"
preamble_image_file = current_dir / "preamble_image.txt"

try:
    with open(preamble_chat_file, "r") as f:
        preamble_chat = f.read()
except Exception:
    print(f"Unable to read {preamble_chat_file=}")
    preamble_chat = "Default system prompt: You are a helpful assistant."

try:
    with open(preamble_image_file, "r") as f:
        preamble_image = f.read()
except Exception:
    print(f"Unable to read {preamble_image_file=}")
    preamble_image = "Default system prompt: You are a helpful assistant."

history = []

async def direct_chat(user_input: str) -> AsyncGenerator[str, None]:
    config = {
        "tools": [web_search, image_analysis],
        "system_instruction": [preamble_chat],
    }
    client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))
    chat = client.chats.create(
        model="gemini-2.0-flash-001", 
        config=config, 
        history=history
    )
    input = f'{user_input["input"]}\nimage_url: {user_input["image"]}'

    for chunk in chat.send_message_stream(input):
        if chunk:
            yield chunk.text

async def direct_image(user_input: str) -> AsyncGenerator[str, None]:
    image_url = user_input["image"]
    async for chunk in image_analysis(instruction=preamble_image, image_url=image_url):
        if chunk:
            yield chunk
