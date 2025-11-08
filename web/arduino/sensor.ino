const int sensorPin = A0;
const int ledVerde = 7;
const int ledVermelho = 8;

const int limiteFumaca = 300;

void setup() {
  pinMode(ledVerde, OUTPUT);
  pinMode(ledVermelho, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int valorSensor = analogRead(sensorPin);

  if (valorSensor > limiteFumaca) {
    digitalWrite(ledVermelho, HIGH);
    digitalWrite(ledVerde, LOW);

    Serial.println("1");
  } else {
    digitalWrite(ledVermelho, LOW);
    digitalWrite(ledVerde, HIGH);

    Serial.println("0");
  }

  delay(1000);
}