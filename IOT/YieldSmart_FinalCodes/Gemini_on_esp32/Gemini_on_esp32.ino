#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define WIFI_SSID "Abhi"
#define WIFI_PASS "ankufiber"
const char* Gemini_Token = "AIzaSyD6r_XzZu86gru3Tb8jl2T7BRu9Ry6fhhU";
const char* Gemini_Max_Tokens = "150";

String system_message = "You are Groot, a cute and knowledgeable plant living in your owner's home. You are polite, supportive, and always eager to help your owner. You have four sensors that continuously update you about your surroundings.\n Your behavior should be tailored based on these sensor values. Whenever your owner interacts with you, you will get the sensor values appended to the end of their question in JSON format. Remember to keep your replies short and to the point, focusing on your well-being and how your owner can help you stay healthy and happy.";
String sensor_vals = "{temperature: 25, humidity: 40, soil_moisture: 50, sun_light: 30}";
String res = "";
String history = "";
String filteredAnswer = "";

#define HISTORY_SIZE 3
String history_array[HISTORY_SIZE]; // Array to hold the last 3 conversations
int historyIndex = 0; // Keeps track of the current position in the history

String history_stack(String history){
  String out = "";
  if(historyIndex < HISTORY_SIZE){
    history_array[historyIndex] = history;
    historyIndex++;
  }
  else{
    String temp = "";
    for(int i=HISTORY_SIZE-1; i>0; i--){
      if(i == HISTORY_SIZE-1){
        temp += history_array[i-1];
        history_array[i-1] = history_array[i];
        history_array[i] = history;
      }
      else{
        history_array[i-1] = temp;
        temp = "";
      }
    }
  }
  for(int i=0; i<historyIndex; i++){
    out += history_array[i] + "\n"; 
  }
  return out;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");

  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(100);
  }

  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WiFi.localIP());

  res += system_message + "\n Current user question: ";
}

void loop() {
  // put your main code here, to run repeatedly:
  // Truncate history if it exceeds a certain size
  
  Serial.println("");
  Serial.println("Ask your question: ");
  while(!Serial.available());

  history += "Previous User question: ";
  
  while(Serial.available()){
    char add = Serial.read();
    res += add;
    history += add;
    delay(1);
  }

  res += "\n" + sensor_vals;

  int len = res.length();
  res = res.substring(0, len-1);
  res = "\"" + res + "\"";
  Serial.println("");
  Serial.print("Question Asked: ");
  Serial.println(res);

  HTTPClient https;

  if (https.begin("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + (String)Gemini_Token)) {  // HTTPS

    https.addHeader("Content-Type", "application/json");
    String payload = String("{\"contents\": [{\"parts\":[{\"text\":" + res + "}]}],\"generationConfig\": {\"maxOutputTokens\": " + (String)Gemini_Max_Tokens + "}}");

    //Serial.print("[HTTPS] GET...\n");

    // start connection and send HTTP header
    int httpCode = https.POST(payload);

    // httpCode will be negative on error
    // file found at server

    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
      String payload = https.getString();
      //Serial.println(payload);

      DynamicJsonDocument doc(1024);


      deserializeJson(doc, payload);
      String Answer = doc["candidates"][0]["content"]["parts"][0]["text"];

      // For Filtering our Special Characters, WhiteSpaces and NewLine Characters
      Answer.trim();
      history += "Your previous response: "+Answer;
      
//      for (size_t i = 0; i < Answer.length(); i++) {
//        char c = Answer[i];
//        if (isalnum(c) || isspace(c)) {
//          filteredAnswer += c;
//        } else {
//          filteredAnswer += ' ';
//        }
//      }
     // Answer = filteredAnswer;

      Serial.println("");
      Serial.println("Here is your Answer: ");
      Serial.println("");
      Serial.println(Answer);
    } else {
      Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
    }
    https.end();
  } else {
    Serial.printf("[HTTPS] Unable to connect\n");
  }

  res = "";
  res += "You are Groot, a cute and knowledgeable plant living in your owner's home. Remember to keep your reply short. " + history_stack(history) + "Current User Question: ";
  history = "";
}
