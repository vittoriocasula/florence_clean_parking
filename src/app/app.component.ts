import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Connetti',
      url: '/connect',
      icon: 'bluetooth'
    },
    {
      title: 'Ricerca',
      icon: 'search',
      children: [
        {
          title: 'Ricerca per indirizzo',
          url: '/searchAddress',
          icon: 'pin'
        },
        {
          title: 'Ricerca per data',
          url: '/searchDate',
          icon: 'calendar'
        }]
    },
    {
      title: 'Contattaci',
      url: '/contact',
      icon: 'contacts'
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
