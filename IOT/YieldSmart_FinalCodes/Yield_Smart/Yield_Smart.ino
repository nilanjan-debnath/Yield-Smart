#include <DHT.h>
#define Soil_Moisture_Sensor_pin 32
#define DHT_Sensor_pin 25
#define DHTTYPE DHT11

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "Abhi"
#define WIFI_PASS "ankufiber"
#define API_KEY "AIzaSyCXsFY6ri6v3Tidttf75Xqh3zvo9Y-79K4"
#define DATABASE_URL "https://yield-smart-default-rtdb.asia-southeast1.firebasedatabase.app/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

DHT dht(DHT_Sensor_pin, DHTTYPE);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(DHT_Sensor_pin, INPUT);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");

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

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // put your main code here, to run repeatedly:
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read soilMoisture
  float soilMoisture = analogRead(Soil_Moisture_Sensor_pin);

  Serial.print("t = ");
//  Serial.print(30);
  Serial.print(t);
  Serial.print(" | ");
  Serial.print("h = ");
//  Serial.print(80);
  Serial.print(h);
  Serial.print(" | ");
  Serial.print("SM = ");
//  Serial.println(50);
  Serial.println(soilMoisture);

  if(Firebase.ready() && signupOK && (millis()-sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();

    // Create a JSON object to hold all sensor data
    FirebaseJson jsonData;
    jsonData.set("moisture_val", soilMoisture);
    jsonData.set("temp_val", t);
    jsonData.set("humidity_val", h);

    // Send the JSON data to Firebase RTDB
    if(Firebase.RTDB.setJSON(&fbdo, "Sensor", &jsonData)){
      Serial.println("Data successfully saved to Firebase RTDB");
    } else {
      Serial.println("Failed to save data to Firebase RTDB");
      Serial.println("Error: " + fbdo.errorReason());
    }
  }
  
  delay(3000);
}
