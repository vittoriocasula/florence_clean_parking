import { Injectable } from '@angular/core';
import { ShowService } from './show.service';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private arduinoLat: string;
  private arduinoLng: string;

  constructor(private showService: ShowService) { }

  setArduinoLat(lat: string) {
    // this.showService.showToast(lat);
    this.arduinoLat = lat.replace('\n', '');
  }

  setArduinoLng(lng: string) {
    // this.showService.showToast(lng);
    this.arduinoLng = lng.replace('\n', '');
  }

  getArduinoLat() {
    return this.arduinoLat;
  }

  getArduinoLng() {
    return this.arduinoLng;
  }
}
