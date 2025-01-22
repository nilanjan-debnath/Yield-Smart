import os
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()
os.environ["PROJECT_ID"] = os.getenv("PROJECT_ID")
os.environ["PRIVATE_KEY_ID"] = os.getenv("PRIVATE_KEY_ID")
os.environ["PRIVATE_KEY"] = os.environ.get("PRIVATE_KEY").replace("\\n", "\n")
os.environ["CLIENT_EMAIL"] = os.getenv("CLIENT_EMAIL")
os.environ["CLIENT_ID"] = os.getenv("CLIENT_ID")
os.environ["CLIENT_X509_CERT_URL"] = os.getenv("CLIENT_X509_CERT_URL")

cred_info = {
    "type": "service_account",
    "project_id": os.environ.get("PROJECT_ID"),
    "private_key_id": os.environ.get("PRIVATE_KEY_ID"),
    "private_key": os.environ.get("PRIVATE_KEY"),
    "client_email": os.getenv("CLIENT_EMAIL"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "client_id": os.environ.get("CLIENT_ID"),
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("CLIENT_X509_CERT_URL"),
    "universe_domain": "googleapis.com",
}

cred = credentials.Certificate(cred_info)
firebase_admin.initialize_app(cred)
db = firestore.client()


def get_data(id: str) -> dict:
    conversation = db.collection("conversations").document(id).get().to_dict()
    return conversation


def save_output(id, conversation):
    db.collection("conversations").document(id).update(conversation)


get_data("G6yFv6mtHXPZRUvP91At")
