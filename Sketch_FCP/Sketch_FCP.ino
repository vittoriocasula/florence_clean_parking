#include <SoftwareSerial.h> //libreria per la gestione delle istruzioni di utilizzo del modulo bluetooth
#include <TinyGPS++.h> //libreria per la visualizzazione delle coordinate gps

const int rxpin_ble = 10; //Andiamo ad assegnare al pin 2 l’indirizzo di ricezione dati (e lo colleghiamo al pin TXD del modulo)
const int txpin_ble = 11; //Assegnamo invece al pin 3 l’indirizzo di trasmissione dati (collegandolo al pin RXD del nostro componente)
const int rxpin_gps = 4;
const int txpin_gps = 3;

bool fetch;

char lat_prefix[5] = {'l', 'a', 't', ':'};
char lng_prefix[5] = {'l', 'n', 'g', ':'};

char result_lat[10];
char result_lng[10]; 

SoftwareSerial bluetooth(rxpin_ble, txpin_ble);
SoftwareSerial ss(rxpin_gps, txpin_gps);
TinyGPSPlus gps;

void setup() {
  Serial.begin(9600);  //Inizializziamo l’interfaccia seriale al baud rate dell’AT-mode 
  bluetooth.begin(9600);  //Inizializziamo l’interfaccia del modulo bluetooth sempre al baud rate riferito alla modalità AT
  ss.begin(9600);
  fetch = true;
}

void loop() {
  if (fetch) { //CARICAMENTO DATI
    if (ss.available()) {
      gps.encode(ss.read());
      if (gps.location.isUpdated() || gps.altitude.isUpdated()) {
        double lat = gps.location.lat();
        double lng = gps.location.lng();
        dtostrf(lat, 2, 6, result_lat);
        dtostrf(lng, 2, 6, result_lng);
        Serial.print("Latitude= ");
        for (int i = 0; i < 10; i++) {
          Serial.print(result_lat[i]);
        }
        Serial.print(" Longitude= ");
        for (int i = 0; i < 10; i++) {
          if (i < 9) {
            Serial.print(result_lng[i]);
          }
          else {
            Serial.println(result_lng[i]);
          }
        }
        fetch = false;
      }
    }
  }
  else { //INVIO DATI
    for (int i = 0; i < 5; i++) {
      bluetooth.write(lat_prefix[i]);
    }
    for (int i = 0; i < 10; i++) {
      bluetooth.write(result_lat[i]);
    }
    bluetooth.write(0xA);
    bluetooth.flush();
    for (int i = 0; i < 5; i++) {
      bluetooth.write(lng_prefix[i]);
    }
    for (int i = 0; i < 10; i++) {
      bluetooth.write(result_lng[i]);
    }
    bluetooth.write(0xA);
    bluetooth.flush();
    fetch = true;
  }
}
