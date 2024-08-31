import os
import json
import requests

from PIL import Image
from dotenv import load_dotenv
from django.conf import settings

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_core.tools import tool
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field

from langchain_community.tools.tavily_search import TavilySearchResults


load_dotenv()
os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
os.environ["TAVILY_API_KEY"] = os.getenv('TAVILY_API_KEY')

conversation = []
def set_conversation(conv: list):
    global conversation
    conversation = conv

@tool
def history() -> list:
    "All the conversation details between user and AI"
    global conversation
    return conversation['texts']

history.name = "history"
history.description = "All the conversation details between user and AI"

web_search_tool = TavilySearchResults()
web_search_tool.name = "Web_Search"
web_search_tool.description = "Retrieve relevant info from web."

class web_search_inputs(BaseModel):
   query: str = Field(description="query for searching on web")

web_search_tool.args_schema = web_search_inputs


@tool
def visual_tool(prompt: str, image_url: str) -> str:
    """Responding on image url input
    Args:
        prompt (str): prompt input
        image_url (str): url input
    """
    image_path = 'saved_image.jpg'
    response = requests.get(image_url)
    if response.status_code == 200:
        pass
        with open(image_path, "wb") as f:
            f.write(response.content)
    else:
        return(f"Error fetching image. Status code: {response.status_code}")

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": image_path}},
        ],
    )
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    try:
        response = model.invoke([message])
        print("Respond succesfully: ", response.content)
        return response.content
    except Exception as e: 
        print("Error found : ",e)
        return e

visual_tool.name = "visual"
visual_tool.description = "Get image details on given prompt"

class visual_inputs(BaseModel):
   prompt: str = Field(description="prompt for image")
   image_url: str = Field(description="url for image")
visual_tool.args_schema = visual_inputs

TOOLS = [history, web_search_tool, visual_tool]