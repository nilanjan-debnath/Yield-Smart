# Running the scripts
## Run all the command on the terminal inside **SCRIPT** directory

## Run this command to create a new environment
`python -m venv env`<br>
`env\Scripts\activate`
## Install the required libraries using this command
`python.exe -m pip install --upgrade pip`<br>
`pip install pathlib pillow python-dotenv opencv-python google-generativeai gdown`

## Add your google api key at line 26
`GOOGLE_API_KEY="REPLACE_WITH_YOUR_API_KEY" `

## Downloading your custom field demo video
`gdown https://drive.google.com/uc?id=1FPj_SMQiiRSJVxZZEGsTDwZaYYNW6ES7`

## Run the script
`python main.py`

## Stop the script
`Enter "q" or "Q" to stop he scripts`