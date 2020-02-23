import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './models/pages.model';
import { FirebaseDbService } from './services/firebase-db.service';
import { Storage } from '@ionic/storage';
import { PositionService } from './services/position.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages: Pages[] = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home',
      children: [],
      open: false
    },
    {
      title: 'Mappa',
      url: '/menu/map',
      icon: 'map',
      children: [],
      open: false
    },
    {
      title: 'Ricerca',
      icon: 'search',
      url: '',
      children: [
        {
          title: 'Ricerca per indirizzo',
          url: '/menu/search-address',
          icon: 'pin',
          children: [],
          open: false
        },
        {
          title: 'Ricerca per giorno',
          url: '/menu/search-date',
          icon: 'calendar',
          children: [],
          open: false
        }],
      open: false
    },
    {
      title: 'Contattaci',
      url: '/menu/contact',
      icon: 'contacts',
      children: [],
      open: false
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: FirebaseDbService,
    private storage: Storage,
    private positionService: PositionService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.db.initFirebaseDb();
      // this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      // provo a connettermi automaticamente
      // setta arduinoLat e arduinoLng
      this.storage.get('ardinoLat').then((arduinoLat: string) => {
        if (arduinoLat) {
          this.positionService.setArduinoLat(arduinoLat);
        }
      });
      this.storage.get('arduinoLng').then((arduinoLng: string) => {
        if (arduinoLng) {
          this.positionService.setArduinoLng(arduinoLng);
        }
      });
      this.splashScreen.hide();
    });
    this.platform.pause.subscribe(() => {
      this.db.disconnectFirebaseDb();
    });
  }





}
