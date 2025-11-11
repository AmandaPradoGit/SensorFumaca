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
