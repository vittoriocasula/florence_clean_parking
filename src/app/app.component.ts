import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './models/pages.model';

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
      title: 'Connetti',
      url: '/menu/connect',
      icon: 'bluetooth',
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
          title: 'Ricerca per data',
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
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }





}
