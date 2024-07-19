from .tools import TOOLS, TOOLS_DETAILS
from . import set_config_file

import os
import json
from dotenv import load_dotenv
from django.conf import settings
from langchain_cohere import ChatCohere
from langchain.agents import AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_cohere.react_multi_hop.agent import create_cohere_react_agent

import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()
os.environ['COHERE_API_KEY'] = os.getenv('COHERE_API_KEY')
os.environ['LANGCHAIN_API_KEY'] = os.getenv('LANGCHAIN_API_KEY')
os.environ['LANGCHAIN_TRACING_V2'] = os.getenv('LANGCHAIN_TRACING_V2')
os.environ['LANGCHAIN_ENDPOINT'] = "https://api.smith.langchain.com"

tools = TOOLS

preamble = """you're a helpful ai assistant.
You will be given input in this format {'datetime':'', 'input':'', 'image':'', 'history':[]}
'datatime' is the current datetime. 'input' is the user input. 'image' is the image url send by user. 
And 'history' is a list of all the previous conversation between ai and user. Each item in history is in {'datetime':'', 'input':'', 'image':'', 'output':''} this format. Where 'output' is the resonse given by ai on that conversation.
"""+f"""
You have multiple tools like these {TOOLS}
Here is some guideline for the tools:
{TOOLS_DETAILS}
Always awar of the conversation history. Use it if you find any relevent information to help in responding the current input.
"""
prompt = ChatPromptTemplate.from_template("{input}")

llm = ChatCohere(model="command-r")
agent = create_cohere_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# firebase_config_folder = os.path.join(settings.STATIC_URL,'firebase')
# config_file_path = os.path.join(firebase_config_folder, 'firebase_config.json')
config_file_path = 'firebase_config.json'
cred = credentials.Certificate(config_file_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

input = {
    'datetime':'',
    'input':'',
    'image':'',
    'history':[]
}
def groot_ai(user_input):
    global input
    global conversation

    id = str(user_input["id"])
    index = int(user_input["index"])
    conversation = db.collection('conversations').document(id).get().to_dict()
    conv = conversation['texts']
    chat =  conv[index]

    input['datetime']=chat['datetime']
    input['input']=chat['input']
    input['image']=chat['image']
    input['history']=conv[:index]

    response = agent_executor.invoke({"input": input, "preamble": preamble})

    conversation['texts'][index]['output'] = response['output']
    db.collection('conversations').document(id).update(conversation)
    return response['output']
