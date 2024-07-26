import firebase_admin
from firebase_admin import credentials, firestore
from . import set_config_file

config_file_path = 'firebase_config.json'
cred = credentials.Certificate(config_file_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_data(id: str) -> dict:
    conversation = db.collection('conversations').document(id).get().to_dict()
    return conversation

def save_output(id, conversation):
    db.collection('conversations').document(id).update(conversation)