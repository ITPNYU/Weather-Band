#include <ArduinoJson.h>

/*  This is a sketch that access the ITP Weather Bandn's database 
 *  and get weather data one by one every 1 second.
 *  History:
 *  Based on Tom Igoe's Connected Devices example
 *  Modified by Yeseul Song & Arnab Chakravarty for the ITP Weather Band on April 2020
 *  Modifed by Yeseul Song to get data from the new database and parse with ArduinoJson on November 2020
 *  Feel free to modify to make your cool projects!
*/
 
#include <ArduinoHttpClient.h>
#include <WiFiNINA.h> // you might want to use WiFi101.h instead depending on which arduino you're using

#include "arduino_secrets.h" 

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
String mac_identity = MAC_ID;
String session_identity = SESSION_KEY;

const char serverAddress[] = "weatherband.itp.io";  // server address
int port = 8000;  // for https. will change later after PM setup
int counter = 10; // decide the starting point id #

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;

// for json parsing; Inside the brackets, 200 is the capacity of the memory pool in bytes.
DynamicJsonDocument doc(200);
  
void setup() {
  Serial.begin(9600);
  while (!Serial);
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);     // print the network name (SSID);

    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);
  }

  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  
}

void loop() {  
  
  getData();

  // read the status code and body of the response
  
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  parseJson(response);

  delay(10000);
   
}

void getData() {

  Serial.println("making GET request");
  String path = "/data/id/";
  path+= counter;

  String getBody = ""; // add mac address, session key, category, data, etc 

  client.beginRequest();
  client.get(path);  
  client.beginBody();
  client.print(getBody);
  client.endRequest();
  
  counter++;
  
}

void parseJson(String response) {
  
  const size_t capacity = JSON_OBJECT_SIZE(19) + 270; // calculated at https://arduinojson.org/v6/assistant/
  DynamicJsonDocument doc(capacity);

  deserializeJson(doc, response);
  DeserializationError error = deserializeJson(doc, response);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  int id = doc["id"]; // e.g., 10
  const char* mac_address = doc["mac_address"]; // e.g., "A4:CF:12:8A:C8:24"
  const char* recorded_at = doc["recorded_at"]; // e.g., "2020-11-13T01:59:15.000Z"
  int wind_dir = doc["wind_dir"]; // e.g., 248
  int winddir_avg2m = doc["winddir_avg2m"]; // e.g., 0
  int windspeedmph = doc["windspeedmph"]; // e.g., 0
  int windgustdir_10m = doc["windgustdir_10m"]; // e.g., 0
  int windgustmph_10m = doc["windgustmph_10m"]; // e.g., 0
  int rainin = doc["rainin"]; // e.g., 0
  int dailyrainin = doc["dailyrainin"]; // e.g, 0
  float temperature = doc["temperature"]; // e.g., 30.03
  float humidity = doc["humidity"]; // e.g., 115.37
  float pressure = doc["pressure"]; // e.g., 101.84
  float illuminance = doc["illuminance"]; // e.g., 17.74
  int uva = doc["uva"]; // 0
  int uvb = doc["uvb"]; // 0
  int uvindex = doc["uvindex"]; // 0

  Serial.print("Weather data recorded at ");
  Serial.print(recorded_at);
  Serial.println(" has been saved to the weather variables and they're ready to use.");

}
