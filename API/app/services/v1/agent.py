import os
import datetime
from dotenv import load_dotenv
from langchain_cohere import ChatCohere
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor
from langchain_cohere.react_multi_hop.agent import create_cohere_react_agent

from app.databases.v1.firebase_db import get_data, save_output
from . import tools

load_dotenv()
os.environ["COHERE_API_KEY"] = os.getenv("COHERE_API_KEY")
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2")
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"


preamble_chat_file = "app/services/v1/preamble_chat.txt"
try:
    with open(preamble_chat_file, "r") as f:
        preamble_chat = f.read()
except Exception:
    print(f"Unable to read {preamble_chat_file=}")
    preamble_chat = "Default system prompt: You are a helpful assistant."

preamble_image_file = "app/services/v1/preamble_image.txt"
try:
    with open(preamble_image_file, "r") as f:
        preamble_image = f.read()
except Exception:
    print(f"Unable to read {preamble_image_file=}")
    preamble_image = "Default system prompt: You are a helpful assistant."

    
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "{preamble}",
        ),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
)

llm = ChatCohere(model="command-r")
agent = create_cohere_react_agent(llm, tools.TOOLS, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools.TOOLS, verbose=True)


input_data = {"datetime": "", "input": "", "image": "", "history": []}


async def groot_ai(user_input):
    global input_data
    global conversation

    id = str(user_input["id"])
    index = int(user_input["index"])

    conversation = get_data(id)
    if not conversation:
        return "The conversation id isn't exist in database."

    tools.set_conversation(conversation)

    if index < 7:
        history = conversation["texts"][:index]
    else:
        history = conversation["texts"][index - 5 : index]

    input_data = {
        "datetime": conversation["texts"][index]["datetime"],
        "input": conversation["texts"][index]["input"],
        "image": conversation["texts"][index]["image"],
        "history": history,
    }
    response = agent_executor.invoke({"input": input_data, "preamble": preamble_chat})[
        "output"
    ]
    conversation["texts"][index]["output"] = response
    save_output(id, conversation)
    return response


async def direct_chat(user_input):
    global input_data
    input_data = {
        "datetime": str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
        "input": user_input["input"],
        "image": user_input["image"],
        "history": [],
    }
    response = agent_executor.invoke({"input": input_data, "preamble": preamble_chat})[
        "output"
    ]
    return response


async def direct_image(user_input):
    image_url = user_input["image"]
    return tools.visual_tool.invoke({"prompt": preamble_image, "image_url": image_url})
