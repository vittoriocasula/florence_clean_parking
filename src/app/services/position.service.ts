import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private arduinoLat: string;
  private arduinoLng: string;

  constructor(private http: HttpClient) { }

  setArduinoLat(lat: string) {
    this.arduinoLat = lat;
  }

  setArduinoLng(lng: string) {
    this.arduinoLng = lng;
  }

  getArduinoLat() {
    return this.arduinoLat;
  }

  getArduinoLng() {
    return this.arduinoLng;
  }

  getStreet(lat: string, lng: string) {
    const url = 'https://nominatim.openstreetmap.org/reverse?format=json' + '&lat=' + lat + '&lon=' + lng;
    return this.http.get(url);
  }

}
