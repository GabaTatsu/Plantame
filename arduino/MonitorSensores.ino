#include <dht_nonblocking.h>
#include <Wire.h>
#include <LiquidCrystal.h>

#define DHT_SENSOR_TYPE DHT_TYPE_11

static const int DHT_SENSOR_PIN = 2;
static const int EXTERNAL_LED_PIN = 6;
static const int LIGHT_SENSOR_PIN = A0;

DHT_nonblocking dht_sensor(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);

LiquidCrystal lcd(7, 8, 9, 10, 11, 12);

void setup()
{
  Serial.begin(9600);
  pinMode(EXTERNAL_LED_PIN, OUTPUT);
  digitalWrite(EXTERNAL_LED_PIN, HIGH);

  lcd.begin(16, 2);
}

static bool measure_environment(float *temperature, float *humidity, int *lightLevel)
{
  static unsigned long measurement_timestamp = millis();

  if (millis() - measurement_timestamp > 3000ul)
  {
    if (dht_sensor.measure(temperature, humidity) == true)
    {
      *lightLevel = analogRead(LIGHT_SENSOR_PIN);
      measurement_timestamp = millis();
      return (true);
    }
  }

  return (false);
}

void loop()
{
  float temperature;
  float humidity;
  int lightLevel;

  if (measure_environment(&temperature, &humidity, &lightLevel) == true)
  {
    unsigned long currentMillis = millis();

    unsigned long seconds = currentMillis / 1000;

    int hours = seconds / 3600;
    int minutes = (seconds % 3600) / 60;
    int secondsDisplay = seconds % 60;

    int intTemperature = static_cast<int>(temperature);
    int intHumidity = static_cast<int>(humidity);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Dur.:");
    lcd.print(hours);
    lcd.print(":");
    lcd.print(minutes);
    lcd.print(":");
    lcd.print(secondsDisplay);

    lcd.setCursor(0, 1);
    lcd.print("T:");
    lcd.print(intTemperature);
    lcd.print("C");
    lcd.print(" H:");
    lcd.print(intHumidity);
    lcd.print("%");

    lcd.setCursor(9, 1);
    lcd.print("L:");
    lcd.print(lightLevel);

    digitalWrite(EXTERNAL_LED_PIN, LOW);
    delay(100);
    digitalWrite(EXTERNAL_LED_PIN, HIGH);
    delay(100);
  }
  else
  {
    digitalWrite(EXTERNAL_LED_PIN, LOW);
  }
}
