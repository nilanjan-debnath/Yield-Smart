from . import firebase_data
from . import tools_list

import os
import json
from dotenv import load_dotenv
from django.conf import settings
from langchain_core.tools import tool
from langchain_cohere import ChatCohere
from langchain.agents import AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_cohere.react_multi_hop.agent import create_cohere_react_agent

load_dotenv()
os.environ['COHERE_API_KEY'] = os.getenv('COHERE_API_KEY')
os.environ['LANGCHAIN_API_KEY'] = os.getenv('LANGCHAIN_API_KEY')
os.environ['LANGCHAIN_TRACING_V2'] = os.getenv('LANGCHAIN_TRACING_V2')
os.environ['LANGCHAIN_ENDPOINT'] = "https://api.smith.langchain.com"

conversation = []
@tool
def history() -> list:
    "All the conversation details between user and AI"
    global conversation
    return conversation['texts']

history.name = "history"
history.description = "All the conversation details between user and AI"

tools = [history, tools_list.weather_tool, tools_list.visual_tool]

preamble = """you're a helpful ai assistant.
You will be given input in this format {'datetime':'', 'input':'', 'image':'', 'history':[]}
'datatime' is the current datetime. 'input' is the user input. 'image' is the image url send by user. 
And 'history' is a list of last 5 conversation between ai and user. Each item in history is in {'datetime':'', 'input':'', 'image':'', 'output':''} this format. Where 'output' is the resonse given by ai on that conversation.
"""+f"""
You have multiple tools like these {tools}
Here is some guideline for the tools:
{tools_list.visual_tool_details}
{tools_list.weather_tool_details}
history:
If you think you need more history of conversation, then use this tool to get all previous conversation history.

Always awar of the conversation history. Use it if you find any relevent information to help in responding the current input.
"""
prompt = ChatPromptTemplate.from_template("{input}")

llm = ChatCohere(model="command-r")
agent = create_cohere_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)


input_data = {
    'datetime':'',
    'input':'',
    'image':'',
    'history':[]
}

def groot_ai(user_input):
    global input_data
    global conversation

    id = str(user_input["id"])
    index = int(user_input["index"])

    conversation = firebase_data.get_data(id)
    if index < 7:
        history = conversation['texts'][:index]
    else:
        history = conversation['texts'][index-5:index]

    input_data = {
        'datetime':conversation['texts'][index]['datetime'],
        'input':conversation['texts'][index]['input'],
        'image':conversation['texts'][index]['image'],
        'history':history
    }
    response = agent_executor.invoke({"input": input_data, "preamble": preamble})['output']
    conversation['texts'][index]['output'] = response
    firebase_data.save_output(id, conversation)
    return response

import datetime
def direct_chat(user_input):
    global input_data
    input_data = {
        'datetime':str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
        'input':user_input['input'],
        'image':user_input['image'],
        'history':[]
    }
    response = agent_executor.invoke({"input": input_data, "preamble": preamble})['output']
    return response
