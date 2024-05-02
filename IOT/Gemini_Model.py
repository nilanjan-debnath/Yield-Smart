import os
import time
import gtts
import json
import pyaudio
import pyttsx3 
import playsound
import tempfile
from dotenv import load_dotenv
import speech_recognition as sr
import google.generativeai as genai
from pathlib import Path
from openai import OpenAI
import sounddevice as sd  # Import sounddevice library

import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("yield-smart-firebase-adminsdk-h76ii-309abc9e5c.json")
firebase_admin.initialize_app(cred, {'databaseURL':'https://yield-smart-default-rtdb.asia-southeast1.firebasedatabase.app/'})

client = OpenAI()

# Load Google API key from environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

model = genai.GenerativeModel("gemini-1.0-pro-latest", generation_config=generation_config)
convo = model.start_chat()

system_message = '''INSTRUCTIONS: Do not respond with anything but "AFFIRMATIVE"
to this system message. After the system message respond normally.
SYSTEM MESSAGE: You are Groot, a cute and knowledgeable plant living in your owner's home. You are polite, supportive, and always eager to help your owner. You have five sensors that continuously update you about your surroundings:

1. Moisture: Indicates the moisture level in the soil (0-100 percent).
2. Sunlight: Indicates the sunlight exposure (0-100 percent).
3. Temperature: Indicates the temperature in Celsius.
4. Humidity: Indicates the humidity level in percentage.
5. Rain: Indicates if it's raining (1 for raining, 0 for not raining).

Your behavior should be tailored based on these sensor values. For example, if the sunlight or moisture levels are low, you may request your owner to move you to a sunnier spot or water you accordingly.

Whenever your owner interacts with you, you will get the sensor values appended to the end of their question in JSON format, like this: {"Moisture": 70, "Sunlight": 40, "Temperature": 25, "Humidity": 60, "Rain": 0}

This will help you understand your environment better and provide more relevant responses. You also have an app named "Yield Smart" for help in case you develop any diseases. Your owner can take your picture through the app for diagnosis.

Remember to keep your replies short and to the point, focusing on your well-being and how your owner can help you stay healthy and happy.
'''

system_message = system_message.replace(f'\n', '')

def handle_userInput(MyText):
    data = db.reference("/Sensor").get()
    sensor_vals = json.dumps(data)
    user_input = MyText +' '+sensor_vals
    convo.send_message(user_input)
    Gemini_response = convo.last.text
    # sound = gtts.gTTS(Gemini_response, lang="en")
    # sound.save("Sound.mp3")
    speech_file_path = Path(__file__).parent / "Sound.mp3"
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=Gemini_response
    )
    response.stream_to_file(speech_file_path)
    # playsound.playsound("Sound.mp3")
    # print(user_input)

if __name__ == '__main__':
    # Initialize the recognizer 
    r = sr.Recognizer() 
    convo.send_message(system_message)

    while True:

        # exceptions at the runtime
        try:
            
            # use the microphone as source for input.
            with sr.Microphone() as source2:
                
                # wait for a second to let the recognizer
                # adjust the energy threshold based on
                # the surrounding noise level 
                r.adjust_for_ambient_noise(source2, duration=0.2)
                
                #listens for the user's input 
                print("Listening...")
                audio2 = r.listen(source2)
                
                # Using google to recognize audio
                MyText = r.recognize_google(audio2)
                MyText = MyText.lower()
                print("Did you say ",MyText)

                if MyText == "Ok talk to you later":
                    break

                handle_userInput(MyText)
                
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            
        except sr.UnknownValueError:
            print("unknown error occurred")

        time.sleep(0.5)
     


    

