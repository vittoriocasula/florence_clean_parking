import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, Marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: Map;
  lat: number;
  lng: number;
  markerPosition: Marker<any>;
  markerArduino: Marker<any>;
  updateSecond = 2;

  markerIcon = icon({
    iconUrl: '../assets/simbolCurrentPositionRed.png',
    iconSize: [25, 25], // misura in pixel
  });

  markerIconArduino = icon({
    iconUrl: '../assets/car.png', // logo arduino o macchina
    iconSize: [25, 25], // misura in pixel
  });

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  constructor(private geolocation: Geolocation, public posService: PositionService) { }

  ngOnInit() {
    this.map = new Map('map');
    setInterval(() => {
      this.getGeolocation();
    }, this.updateSecond * 1000);
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      if (this.markerPosition === undefined) { // prima volta che entro nella pagina mappa
        this.setMarker(this.lat, this.lng);
        this.map.setView([this.lat, this.lng], 17);
      } else {
        this.markerPosition.remove(); // rimuovo il vecchio marker
        if (this.markerArduino !== undefined) {
          this.markerArduino.remove();
        }
        this.setMarker(this.lat, this.lng);
      }
    }).catch((error) => {
      // alert('Attiva il GPS');
    });
  }

  ionViewWillLeave() {
    // this.map.remove(); // controllare se funziona
    clearInterval();
  }

  setMarker(lat: number, lng: number) {
    // tslint:disable-next-line: max-line-length
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(this.map);
    this.markerPosition = new Marker([lat, lng], { icon: this.markerIcon });
    this.markerPosition.addTo(this.map);
    const arduinoLat = this.posService.getArduinoLat();
    const arduinoLng = this.posService.getArduinoLng();
    if (arduinoLat !== undefined && arduinoLng !== undefined) {
      this.markerArduino = new Marker([+arduinoLat, +arduinoLng], { icon: this.markerIconArduino });
      this.markerArduino.addTo(this.map);
    }
  }
}
