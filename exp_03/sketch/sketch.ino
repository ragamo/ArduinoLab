#include <Process.h>
int Relay1 = A0; 
Process node;

void setup() {
    pinMode(13, OUTPUT);
    pinMode(Relay1, OUTPUT);
    
    Bridge.begin();
    Serial.begin(9600);
  
    //while(!Serial);
}

void loop() {
    if(!node.running()) {
      runNode();
    }
    delay(5000);
}

void runNode() {
    node.begin("node");
    node.addParameter("/node/index.js");
    node.run();
  
    String valObtenido;
    while(node.available() > 0) {
      char c = node.read(); 
      if(c != '\n') {
        valObtenido += c;
      }
    }
     Serial.println(valObtenido);
    
    if(valObtenido == "ON") {
      digitalWrite(13, HIGH);
      digitalWrite(Relay1, HIGH); 
    }
    if(valObtenido == "OFF") {
      digitalWrite(13, LOW);  
      digitalWrite(Relay1, LOW);
    }
    
    Serial.flush();
}
