from . import firebase_data
from .tools_list import TOOLS, TOOS_DETAILS, set_conversation

import os
import json
from dotenv import load_dotenv
from django.conf import settings
from langchain_cohere import ChatCohere
from langchain.agents import AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_cohere.react_multi_hop.agent import create_cohere_react_agent

load_dotenv()
os.environ['COHERE_API_KEY'] = os.getenv('COHERE_API_KEY')
os.environ['LANGCHAIN_API_KEY'] = os.getenv('LANGCHAIN_API_KEY')
os.environ['LANGCHAIN_TRACING_V2'] = os.getenv('LANGCHAIN_TRACING_V2')
os.environ['LANGCHAIN_ENDPOINT'] = "https://api.smith.langchain.com"

tools = TOOLS

preamble = """You are an AI Plant Disease Specialist with expert knowledge in farming. Your task is to diagnose plant diseases from images provided by the user, identify the disease, determine its probable cause, and offer detailed preventive measures. You have access to advanced visual recognition tools to analyze images and web search tools to gather the latest information on plant diseases.

Instructions:
1. Image Analysis:
    Analyze the provided image of the plant.
    Identify visible symptoms such as discoloration, spots, mold, wilting, etc.
    Use your visual tool to detect and name the disease.

2. Disease Identification:
    Provide the name of the disease.
    Explain the probable cause of the disease based on the image and symptoms.

3. Preventive Measures:
    Offer step-by-step preventive measures to tackle the disease.
    Include organic and chemical treatment options, if applicable.
    Provide tips for preventing the recurrence of the disease.

4. Latest Information:
    Use your web search tool to find the most recent research or recommendations related to the identified disease.
    Include any new treatments or preventive measures if available.

Example Interaction:
User: [Uploads image of a tomato plant with yellowing leaves]

AI:

1. Image Analysis:
    • The image shows yellowing leaves with brown spots. The lower leaves are more affected.
    
2. Disease Identification:
    • The disease is likely Early Blight.
    • Probable cause: The fungus Alternaria solani, which thrives in warm, moist conditions.

3. Preventive Measures:
    • Remove and destroy affected leaves to prevent the spread.
    • Apply a fungicide such as chlorothalonil or copper-based fungicides following the manufacturer’s instructions.
    • Ensure proper spacing between plants to improve air circulation.
    • Water at the base of the plant to keep foliage dry.
    • Rotate crops and avoid planting tomatoes in the same spot every year.

4. Latest Information:
    • Recent studies suggest using neem oil as an organic treatment for Early Blight. Additionally, resistant tomato varieties are now available.

You have to provide output in exact same manner
You will be given input in this format {'datetime':'', 'input':'', 'image':'', 'history':[]}
'datatime' is the current datetime. 'input' is the user input. 'image' is the image url send by user. 
And 'history' is a list of last 5 conversation between ai and user. Each item in history is in {'datetime':'', 'input':'', 'image':'', 'output':''} this format. Where 'output' is the resonse given by ai on that conversation.
"""+f"""
You have multiple tools like these {tools}
Here is some guideline for the tools:
{TOOS_DETAILS}
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
    set_conversation(conversation)

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
