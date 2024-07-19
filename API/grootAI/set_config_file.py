import os
import json
from dotenv import load_dotenv
from django.conf import settings

load_dotenv()
os.environ["PROJECT_ID"] = os.getenv("PROJECT_ID")
os.environ["PRIVATE_KEY_ID"] = os.getenv("PRIVATE_KEY_ID")
os.environ["PRIVATE_KEY"] = os.getenv("PRIVATE_KEY")
os.environ["CLIENT_EMAIL"] = os.getenv("CLIENT_EMAIL")
os.environ["CLIENT_ID"] = os.getenv("CLIENT_ID")
os.environ["CLIENT_X509_CERT_URL"] = os.getenv("CLIENT_X509_CERT_URL")

data = {
    "type": "service_account",
    "project_id": os.environ["PROJECT_ID"],
    "private_key_id": os.environ["PRIVATE_KEY_ID"],
    "private_key": os.environ["PRIVATE_KEY"],
    "client_email": os.environ["CLIENT_EMAIL"],
    "client_id": os.environ["CLIENT_ID"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ["CLIENT_X509_CERT_URL"],
    "universe_domain": "googleapis.com"
}
config_file_path = 'firebase_config.json'

with open(config_file_path, "w") as jsonFile:
    json.dump(data, jsonFile)
