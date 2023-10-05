#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "MiFibra-1054";      // Reemplaza con el nombre de tu red Wi-Fi
const char* password = "2DdvRknJ"; // Reemplaza con la contraseña de tu red Wi-Fi
const char* serverUrl = "http://192.168.1.75:4000/api/project/sensor/1"; // URL del servidor

void setup() {
  Serial.begin(9600);
  
  Serial.print("Conectándose a la red: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Wi-Fi conectado usando la siguiente IP:");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Crear un objeto JSON para almacenar los datos del sensor
  DynamicJsonDocument jsonDocument(1000);
  int lightLevel = analogRead(A0);
  jsonDocument["lightLevel"] = lightLevel;

  // Serializar el objeto JSON en una cadena JSON
  String jsonString;
  serializeJson(jsonDocument, jsonString);

  // Inicializar un cliente HTTP y pasarle el cliente WiFi
  WiFiClient client;
  HTTPClient http;

  // Enviar los datos al servidor
  http.begin(client, serverUrl); // Utiliza el cliente WiFi
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    String response = http.getString();
    
    Serial.println("Datos enviados:");
    Serial.println(jsonString);
    Serial.print("Código de respuesta HTTP: ");
    Serial.println(httpResponseCode);
    Serial.print("Respuesta del servidor: ");
    Serial.println(response);
  } else {
    Serial.print("Error HTTP: ");
    Serial.println(httpResponseCode);
  }

  http.end();

  delay(5000); // Esperar 5 segundos antes de enviar nuevamente
}
