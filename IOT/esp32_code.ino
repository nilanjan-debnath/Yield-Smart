#include <WiFi.h>
#include "Audio.h" 
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "Abhi"
#define WIFI_PASS "ankufiber"
#define API_KEY "AIzaSyCXsFY6ri6v3Tidttf75Xqh3zvo9Y-79K4"
#define DATABASE_URL "https://yield-smart-default-rtdb.asia-southeast1.firebasedatabase.app/"

#define rain_pin 25
#define soil_moisture_pin 26
#define LED_pin 2

int rain_val=0;
float soil_moisture_val;
float percentage_soil_Humididy;
float wet=410.00, dry=784.00;
const int trig=34;         
const int echo=35;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

bool pump_flag = false;
int moisture_val = 10;
int sunlight_val = 0;
int Auto = 1;
int pump_state = 0;
int prev_state = 0;
float distance;

String greet = "Hi";
String User;
String Response;

float distanceData(){        // function to get distance data.
  float time;
  digitalWrite(trig,0);      // initially setting the trigger pin to low.
  delay(4);
  digitalWrite(trig,1);      // after a delay of 4 microsec, setting the trigger pin to high. 
  delay(10);                 // giving a delay of 10 microsec.
  digitalWrite(trig,0);      // setting the trigger pin to low.

  time=pulseIn(echo,1);      // fetching the time taken by the sound pulse after echoing, using the pulseIn function.
  float dis=time*0.0343/2;   // calculating the distance at which the obstacle is.
  return dis;                
}

void handleGeminiResponse() {
  if (Firebase.RTDB.getString(&fbdo, "/Gemini/response/")) {
    String response = fbdo.StringData();
    Serial.println("Gemini response: " + response);
    audio.connecttospeech(response.c_str(), "en");
    audio.loop();
  }
}

void Now_We_are_talking() {
  if(Firebase.RTDB.setString(&fbdo, "Gemini/user", greet)) {
    Serial.println(greet);

    if (Firebase.RTDB.streamAvailable(&fbdo)) {
      handleGeminiResponse();
    }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("connecting to Wifi");

  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(100);
  }

  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if(Firebase.signUp(&config, &auth, "", "")){
    Serial.println("SignUp OK");
    signupOK = true;
  }
  // else{
  //   Serial.println("%s\n", config.signer.signupError.message.c_str());
  // }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  pinMode(rain_pin, INPUT);
  pinMode(soil_moisture_pin, INPUT);
  pinMode(LED_pin, OUTPUT);

  
  audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
  audio.setVolume(100);
  audio.connecttospeech("Starting", "en"); // Google TTS
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(LED_pin, HIGH);
  moisture_val = analogRead(soil_moisture_pin);
  sunlight_val = 80;
  rain_val = analogRead(rain_pin);

  if(rain_val > 60){
    rain_val = 1;
  }
  else rain_val = 0;

  distance = distanceData();

  if(!Auto || rain_val){
    Serial.println("Auto Mode OFF");
    pump_state = 0;
  }
  else if(moisture_val < 40 && Auto){
    // pump_flag = true;
    pump_state = 1;
  }
  else if(moisture_val > 90 && Auto){
    // pump_flag = false;
    pump_state = 0;
  }

  
  if(Firebase.ready() && signupOK && (millis()-sendDataPrevMillis > 100 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    //...........storing data to the RTDB..............//
    
    //moisture
    if(Firebase.RTDB.setInt(&fbdo, "Sensor/moisture_val", moisture_val)){
      Serial.println(); Serial.print(moisture_val);
      // Serial.print("-- Successfully saved to: " + fbdo.dataPath());
    }
    else{
      Serial.println("FAILED! --- " + fbdo.errorReason());
    }

    //sunlight
    if(Firebase.RTDB.setInt(&fbdo, "Sensor/sunlight_val", sunlight_val)){
      Serial.println(); Serial.print(sunlight_val);
      // Serial.print("-- Successfully saved to: " + fbdo.dataPath());
    }
    else{
      Serial.println("FAILED! --- " + fbdo.errorReason());
    }

    //rain
    if(Firebase.RTDB.setInt(&fbdo, "Sensor/rain_val", rain_val)){
      Serial.println(); Serial.print(rain_val);
      // Serial.print("-- Successfully saved to: " + fbdo.dataPath());
    }
    else{
      Serial.println("FAILED! --- " + fbdo.errorReason());
    }

    //pump status
    if(pump_state != prev_state){

      if(Firebase.RTDB.setInt(&fbdo, "Pump/pump_state", pump_state)){
        Serial.println(); Serial.print(pump_state);
        // Serial.print("-- Successfully saved to: " + fbdo.dataPath());
      }
      else{
        Serial.println("FAILED! --- " + fbdo.errorReason());
      }

      prev_state = pump_state;
    }

  }

  //---------------------------------reading------------------------------------------//

  //Pump
  if(Firebase.RTDB.getInt(&fbdo, "/Pump/Auto/")){
    if(fbdo.dataType() == "int"){
      Auto = fbdo.intData();
    }
  }


  //------------If some one is in the 30 CM range then greet them!-----------------------//

  if(distance <= 30){
    Now_We_are_talking()
  }

}
