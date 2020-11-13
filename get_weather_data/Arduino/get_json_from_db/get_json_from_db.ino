/*  This is a sketch that access the ITP Weather Station's database on weatherband.itp.io
 *  and get weather data one by one, starting from id #1.
 *  You'll need to parse the Json file to use specific values.
 *  
 *  April 2020: Modified by Yeseul Song & Arnab Chakravarty 
 *  November 2020: Modified by Yeseul Song for the ITP Weather Band, with the wip new database
 *  Based on Tom Igoe's Connected Devices example
*/
 
#include <ArduinoHttpClient.h>
#include <WiFiNINA.h> // you might want to use WiFi101.h instead depending on which arduino you're using

#include "arduino_secrets.h" 

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

const char serverAddress[] = "weatherband.itp.io";  // server address
int port = 3000;  // for https
int counter = 1;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;

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

  delay(10000);
}

void getData() {

  Serial.println("making GET request");
  String path = "/data/";
  path+= counter;
  
  client.get(path);
  
  counter++;
  
}
