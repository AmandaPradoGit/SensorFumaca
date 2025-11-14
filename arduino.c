const int mq2Pin = A0;

String sensor = "MQ2";

const int ledPin = 13;
const int buzzerPin = 12;

// Definindo níveis (ajuste conforme teste real)
int nivelNormal = 200;
int nivelAmarelo = 400;
int nivelVermelho = 600;


void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  digitalWrite(buzzerPin, LOW);
}

void loop() {
  int valor = analogRead(mq2Pin); // 0..1023
  // Envia um JSON simples por serial (fácil para o Node parsear)
  if (valor >= nivelAmarelo){
    String dados = "{\"sensor\":\"" + sensor + "\",\"valor\":\"" + String(valor) + "}";
    Serial.println(dados);
  }
  // Alerta local
  if (valor >= nivelVermelho) {
    digitalWrite(ledPin, HIGH);
    digitalWrite(buzzerPin, HIGH);
    
  } else {
    digitalWrite(ledPin, LOW);
    digitalWrite(buzzerPin, LOW);
  }

  delay(1000); // 1s entre leituras
}

//ESP32 :
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "joselia";
const char* password = "pamonha33";

const int mq2Pin = 34;  // pino analógico do ESP32
String sensor = "MQ2";

const int ledPin = 13;
const int buzzerPin = 2;

int nivelAmarelo = 400;
int nivelVermelho = 600;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  Serial.println("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWi-Fi conectado!");
  Serial.println(WiFi.localIP());
}

void loop() {
  int valor = analogRead(mq2Pin);
  String nivel;

  if (valor < nivelAmarelo) nivel = "normal";
  else if (valor < nivelVermelho) nivel = "amarelo";
  else nivel = "vermelho";

  if (WiFi.status() == WL_CONNECTED && valor >= nivelAmarelo) {
    HTTPClient http;
    http.begin("http://10.32.204.176:3001/dados"); // IP da API Node.js
    http.addHeader("Content-Type", "application/json");

    String body = "{\"sensor\":\"" + sensor + "\",\"valor\":" + String(valor) + ",\"nivel\":\"" + nivel + "\"}";
    int httpResponseCode = http.POST(body);

    Serial.print("Status: ");
    Serial.println(httpResponseCode);

    http.end();
  }

  if (valor >= nivelVermelho) {
    digitalWrite(ledPin, HIGH);
    digitalWrite(buzzerPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
    digitalWrite(buzzerPin, LOW);
  }
  Serial.print(valor);
  delay(1000); //aumentar ?
}
