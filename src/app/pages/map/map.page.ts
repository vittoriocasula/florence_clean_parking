import { Component } from '@angular/core';
import { Map, tileLayer, Marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PositionService } from 'src/app/services/position.service';
import { Network } from '@ionic-native/network/ngx';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  gpsAvailable: boolean;
  networkAvailable: boolean;
  lat: number;
  lng: number;
  markerPosition: Marker<any>;
  markerArduino: Marker<any>;
  updateSecond = 1;

  markerIcon = icon({
    iconUrl: '../assets/simbolCurrentPositionRed.png',
    iconSize: [25, 25], // misura in pixel
  });

  markerIconArduino = icon({
    iconUrl: '../assets/car.png', // logo macchina
    iconSize: [25, 25], // misura in pixel
  });

  options = {
    enableHighAccuracy: true,
    timeout: 1000 * this.updateSecond,
    maximumAge: 0
  };

  map: Map;
  constructor(
    private network: Network,
    private menuCtrl: MenuController,
    private geolocation: Geolocation,
    public posService: PositionService) { }

  ionViewWillEnter() {
    // this.menuCtrl.swipeGesture(false);
    this.network.onDisconnect().subscribe(() => {
      this.networkAvailable = false;
      this.destroyMap(this.map);
    });
    this.network.onConnect().subscribe(() => {
      this.networkAvailable = true;
      this.buildMap();
      this.getGeolocation(this.map);
    });

    if (this.network.type === 'none') {
      this.networkAvailable = false;
    } else { this.networkAvailable = true; }
    if (this.networkAvailable) {
      this.buildMap();
      this.getGeolocation(this.map);
    }

  }

  buildMap() {
    if (this.map === undefined) {
      console.log('sono entrato in build map');
      this.map = new Map('map');
      this.map.invalidateSize(); // rerender map
    }
  }

  destroyMap(map: Map) {
    if (map) {
      map.remove();
      map.getContainer().remove();
    }
  }

  getGeolocation(map: Map) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      if (this.markerPosition === undefined) { // prima volta che entro nella pagina mappa
        this.setMarker(map, this.lat, this.lng);
        map.setView([this.lat, this.lng], 17);
      } else {
        this.markerPosition.remove(); // rimuovo il vecchio marker
        if (this.markerArduino !== undefined) {
          this.markerArduino.remove();
        }
        this.setMarker(map, this.lat, this.lng);
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      if (this.lat !== data.coords.latitude && this.lng !== data.coords.longitude) {
        this.lat = data.coords.latitude;
        this.lng = data.coords.longitude;

        this.markerPosition.remove(); // rimuovo il vecchio marker
        if (this.markerArduino !== undefined) {
          this.markerArduino.remove();
        }
        this.setMarker(map, this.lat, this.lng);
      }
    });

  }

  setMarker(map: Map, lat: number, lng: number) {
    // tslint:disable-next-line: max-line-length
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(map);
    this.markerPosition = new Marker([lat, lng], { icon: this.markerIcon });
    this.markerPosition.addTo(map);
    const arduinoLat = this.posService.getArduinoLat();
    const arduinoLng = this.posService.getArduinoLng();
    if (arduinoLat !== undefined && arduinoLng !== undefined) {
      this.markerArduino = new Marker([+arduinoLat, +arduinoLng], { icon: this.markerIconArduino });
      this.markerArduino.addTo(map);
    }
  }

  ionViewWillLeave() {
    this.destroyMap(this.map);
  }

  setViewCurrentPosition() {
    this.markerPosition.remove();
    this.markerPosition = new Marker([this.lat, this.lng], { icon: this.markerIcon });
    this.markerPosition.addTo(this.map);
    this.map.setView([this.lat, this.lng], 17);
  }

  setArduinoPosition() {
    const arduinoLat = this.posService.getArduinoLat();
    const arduinoLng = this.posService.getArduinoLng();
    if (arduinoLat !== undefined && arduinoLng !== undefined) {
      this.markerArduino.remove();
      this.markerArduino = new Marker([+arduinoLat, +arduinoLng], { icon: this.markerIconArduino });
      this.markerArduino.addTo(this.map);
    }
    this.map.setView([+arduinoLat, +arduinoLng], 17);
  }
}
