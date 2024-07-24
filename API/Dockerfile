FROM python:3.11.4-slim-bullseye
WORKDIR /app

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# install system dependencies
RUN apt-get update

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /app/
RUN pip install django djangorestframework requests pillow python-dotenv langchain langchain_core langchain_cohere langchain-google-genai duckduckgo-search faiss-cpu beautifulsoup4 tiktoken firebase-admin whitenoise gunicorn

COPY . /app

ENTRYPOINT [ "gunicorn", "AI_Agent.wsgi", "-b", "0.0.0.0:8000"]