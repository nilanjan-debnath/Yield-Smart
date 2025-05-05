import os
import requests
from google import genai
from google.genai import types
from tavily import TavilyClient
from dotenv import load_dotenv
from typing import AsyncGenerator

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")


def web_search(query: str) -> str:
    """"Returns the results after searching the query on web
    Args:
        query(str): The query for searching on web

    Returns:
        The top results with the source urls in string format
    """
    tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))
    context = tavily_client.get_search_context(query=query)
    return context


async def image_analysis(instruction: str, image_url: str) -> AsyncGenerator[str, None]:
    """"Returns the results after analyzing the image from the url according to the instruction
    Args:
        instruction(str): The instruction for analysis the image
        image_url(str): The url of the image

    Returns:
        The analysis report according to the instruction in string format
    """
    image_bytes = requests.get(image_url).content
    image = types.Part.from_bytes(
        data=image_bytes, mime_type="image/jpeg"
    )
    client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))
    for chunk in client.models.generate_content_stream(
        model='gemini-2.0-flash-001',
        contents=[instruction, image],
    ):
        if chunk:
            yield chunk.text
