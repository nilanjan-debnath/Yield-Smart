#include <Arduino.h>
#include "SPI.h"
#include <WiFi.h>
#include <WiFiMulti.h>
#include "Audio.h"

// WiFi credentials
#define WIFI_SSID ""
#define PASSWORD ""
#define OPENAI_API_KEY ""

// Configure I2S pins
#define I2S_DOUT      25
#define I2S_BCLK      27
#define I2S_LRC       26
#define I2S_MCLK 0

// Vars
bool isWIFIConnected;

String result = "Hi Aman, how are you? All the best for your CDS exam!";

// Inits
WiFiMulti wifiMulti;
TaskHandle_t playaudio_handle;
QueueHandle_t audioQueue;
Audio audio;

// Declaration
void audio_info(const char *info);
void wifiConnect(void *pvParameters);
void playaudio(void *pvParameters);

// Default
void setup() {
    Serial.begin(115200);
    isWIFIConnected = false;

    // Create queue
    audioQueue = xQueueCreate(1, sizeof(int));
    if (audioQueue == NULL) {
        Serial.println("Failed to create audioQueue");
        while(1);
    }

    // Create tasks
    xTaskCreate(wifiConnect, "wifi_Connect", 4096, NULL, 0, NULL);
    delay(500);
    xTaskCreate(playaudio, "playaudio", 1024 * 8, NULL, 3, &playaudio_handle);
}

void loop(void) {
    audio.loop();
}

void audio_info(const char *info) {
    Serial.print("audio_info: ");
    Serial.println(info);
}

void wifiConnect(void *pvParameters) {
    while(1) {
        if (!isWIFIConnected) {
            wifiMulti.addAP(WIFI_SSID, PASSWORD);
            Serial.println("Connecting to WiFi...");
            while (wifiMulti.run() != WL_CONNECTED) {
                vTaskDelay(500);
            }
            Serial.print("Connected to WiFi\nIP: ");
            Serial.println(WiFi.localIP());
            isWIFIConnected = true;

            Serial.println("Sending result...");
            int eventMessage;
            if (xQueueSend(audioQueue, &eventMessage, 0) != pdPASS) {
                Serial.println("Failed to send result to queue");
            }
        } else {
            vTaskDelay(1000 / portTICK_PERIOD_MS);
        }
    }
}

void playaudio(void *pvParameters) {
    while(1) {
        if (isWIFIConnected && audioQueue != 0) {
            int eventMessage;
            Serial.println("Waiting for result...");
            if (xQueueReceive(audioQueue, &eventMessage, portMAX_DELAY) == pdPASS) {
                Serial.print("Received result: ");
                Serial.println(result);

                // Speech
                audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT, -1);
                audio.setVolume(21); // 0...21
                audio.openai_speech(OPENAI_API_KEY, "tts-1", result, "alloy", "mp3", "1");
            }
        } else {
            vTaskDelay(1000 / portTICK_PERIOD_MS);
        }
    }
}
