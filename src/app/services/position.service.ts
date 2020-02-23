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
    /*const realLat = lat.trim().replace('\n', '');
    this.arduinoLat = Array.from(realLat).splice(1, realLat.length - 2).join('');*/
    this.arduinoLat = lat;
  }

  setArduinoLng(lng: string) {
    /*const realLng = lng.trim().replace('\n', '');
    this.arduinoLng = Array.from(realLng).splice(1, realLng.length - 2).join('');*/
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
