#include <Process.h>

void setup() {
  Bridge.begin();
  Serial.begin(9600);
  
  //while(!Serial);
  Serial.println("Process node");
}

void loop() {
    runNode();
    delay(2000);
}

void runNode() {
  Process node;
  node.begin("node");
  node.addParameter("/node/index.js");
  node.run();
  
  while(node.available() > 0) {
    char c = node.read(); 
    Serial.print(c);
  }
  
  Serial.flush();
}
