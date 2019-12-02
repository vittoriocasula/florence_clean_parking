import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, Marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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

  markerIcon = icon({
    iconUrl: '../assets/simbolCurrentPositionRed.png',
    iconSize: [25, 25], // misura in pixel
  });

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  constructor( private geolocation: Geolocation) { }

  ngOnInit() {
    this.map = new Map('map');
    setInterval(() => {
      this.getGeolocation();
    }, 5000);
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      if (this.markerPosition === undefined) { // prima volta che entro nella pagina mappa
        this.setMap(this.lat, this.lng);
        this.map.setView([this.lat, this.lng], 17);
      } else {
        this.markerPosition.remove(); // rimuovo il vecchio marker
        this.setMap(this.lat, this.lng);
      }
    }).catch((error) => {
      // alert('Attiva il GPS');
    });
  }

  ionViewWillLeave() {
    // this.map.remove(); // controllare se funziona
    clearInterval();
  }

  setMap(lat: number, lng: number) {
    // tslint:disable-next-line: max-line-length
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' }).addTo(this.map);
    this.markerPosition = new Marker([lat, lng], { icon: this.markerIcon });
    this.markerPosition.addTo(this.map);

  }
}
