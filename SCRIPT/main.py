import os
import sys
import cv2
import time
import pickle
import threading
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image, ImageTk
import google.generativeai as genai

width = 458
height = 407
try:
    with open('Feild_Pos', 'rb') as f:
        posList = pickle.load(f)
except:
    posList = []

state = []
for _ in posList:
    state.append(-1)

processing = False
stop_event = threading.Event()

load_dotenv()
API_KEY=os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=API_KEY)
generation_config = {
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32,
    "max_output_tokens": 4096,
}
safety_settings = [
    {"category": f"HARM_CATEGORY_{category}", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    for category in ["HARASSMENT", "HATE_SPEECH", "SEXUALLY_EXPLICIT", "DANGEROUS_CONTENT"]
]
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)
input_prompt = """
As a highly skilled plant pathologist, your expertise is indispensable in our pursuit of maintaining optimal plant health. You will be provided with information or samples related to plant diseases, and your role involves conducting a detailed analysis to identify the plat is disease or not.
only tell "True" if the plant is diseased else "Flase" and nothing else withit.
"""
def generate_gemini_response(image_path):
    prompt = input_prompt
    response = model.generate_content([prompt, image_path])
    return response.text

def get_response(image):
    filename = "tmp.jpg"
    cv2.imwrite(filename, image)
    image_path = Path(filename)
    image_data = {"mime_type": "image/jpeg", "data": image_path.read_bytes()}
    response = generate_gemini_response(image_data)
    # print(response)
    return response

def feild_check(image, i):
    global processing
    global stop_event
    global state
    for i, pos in enumerate(posList):
        if stop_event.is_set():
            break
        x, y = pos
        imgcrop = image[y:y+height, x:x+width]
        state[i] = 0
        response = get_response(imgcrop)
        if "True" in response:
            state[i] = 2
        if "False" in response:
            state[i] = 1
    processing = False

def border(image):
    global state
    for i, pos in enumerate(posList):
        thickness = 5
        if state[i] == 0:
            colour = (0, 0, 0)
        elif state[i] == 1:
            colour = (0, 255, 0)
        elif state[i] == 2:
            colour = (0, 0, 255)
        else: colour = (255, 0, 0)

        cv2.rectangle(image, pos, (pos[0] + width, pos[1] + height), colour, thickness)


def opencv_window():
    global processing
    global stop_event
    cap = cv2.VideoCapture("feild_vid.mp4")
    while True:
        success, image = cap.read()
        if success:
            if not processing:
                process =  threading.Thread(target=feild_check, args=(image, 0))
                process.start()
                processing = True
            border(image)
            aspect_ratio = image.shape[1] / image.shape[0]
            height = 720
            width = int(height * aspect_ratio)
            cv2.namedWindow('custom window', cv2.WINDOW_KEEPRATIO)
            cv2.imshow('custom window', image)
            cv2.resizeWindow('custom window', width, height)
        key = cv2.waitKey(4) & 0xFF
        if key == ord('q') or key == ord('Q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    stop_event.set()

if __name__ == "__main__":
    opencv_window()