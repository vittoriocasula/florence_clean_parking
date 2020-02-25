import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Pages } from './models/pages.model';
import { FirebaseDbService } from './services/firebase-db.service';
import { Storage } from '@ionic/storage';
import { PositionService } from './services/position.service';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ConnectionService } from './services/connection.service';
import { Poc } from './models/poc.model';
import { TimeService } from './services/time.service';
import { Network } from '@ionic-native/network/ngx';
import { ShowService } from './services/show.service';

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
    private showService: ShowService,
    private timeService: TimeService,
    private network: Network,
    private connectionService: ConnectionService,
    private bluetoothSerial: BluetoothSerial,
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
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.statusBar.styleDefault();
      this.storage.get('arduinoLat').then((arduinoLat: string) => {
        if (arduinoLat) {
          this.positionService.setArduinoLat(arduinoLat);
        }
      });
      this.storage.get('arduinoLng').then((arduinoLng: string) => {
        if (arduinoLng) {
          this.positionService.setArduinoLng(arduinoLng);
        }
      });
      this.bluetoothSerial.isEnabled().then(success => {
        this.storage.get('lastDevice').then(device => {
          if (device) {
            this.bluetoothSerial.connect(device.mac).subscribe(connected => {
              this.connectionService.connect(device);
              this.splashScreen.hide();
            }, error => {
              if (this.connectionService.connectionState) {
                this.connectionService.connectionState = false;
                const arduinoLat = this.positionService.getArduinoLat();
                const arduinoLng = this.positionService.getArduinoLng();
                this.storage.set('arduinoLat', arduinoLat);
                this.storage.set('arduinoLng', arduinoLng);
                this.positionService.getStreet(arduinoLat, arduinoLng).subscribe(httpSuccess => {
                  // tslint:disable-next-line: no-string-literal
                  const address = httpSuccess['address']['road'];
                  if (this.network.type !== 'none') {
                    this.db.getPocByAddress(address.trim().toUpperCase()).then(dbSuccess => {
                      const days = ['DOMENICA', 'LUNEDI\'', 'MARTEDI\'', 'MERCOLEDI\'', 'GIOVEDI\'', 'VENERDI\'', 'SABATO'];
                      const currentListPoc = [];
                      const futureListPoc = [];
                      const currentDate = new Date();
                      const currentWeek = this.timeService.getWeek(currentDate);
                      const currentHour = currentDate.getHours();
                      const currentMinutes = currentDate.getMinutes();
                      dbSuccess.forEach((childSnapshot: any) => {
                        const poc: Poc = childSnapshot.val();
                        const hourStart = +poc.ora_inizio.split(':')[0];
                        const minutesStart = +poc.ora_inizio.split(':')[1];
                        const hourEnd = +poc.ora_fine.split(':')[0];
                        const minutesEnd = +poc.ora_fine.split(':')[1];
                        let isCurrent = false;
                        if (poc.giorno_set === days[currentDate.getDay()]) {
                          isCurrent = this.timeService.timeLower(currentHour, currentMinutes, hourEnd, minutesEnd);
                          if (isCurrent) {
                            isCurrent = this.timeService.timeGreater(currentHour, currentMinutes, hourStart, minutesStart);
                          }
                          if (isCurrent) {
                            isCurrent = false;
                            if (poc.sett_mese !== '') {
                              const weeks = poc.sett_mese.split(',');
                              weeks.forEach(week => {
                                if (currentWeek === +week) {
                                  isCurrent = true;
                                }
                              });
                            } else {
                              if (poc.giorno_pari === '1' && (currentDate.getDate() % 2) === 0) {
                                isCurrent = true;
                              }
                              if (poc.giorno_dispari === '1' && (currentDate.getDate() % 2) === 1) {
                                isCurrent = true;
                              }
                              if (poc.giorno_pari === '1' && poc.giorno_dispari === '1') {
                                isCurrent = true;
                              }
                            }
                          }
                        }
                        if (isCurrent) {
                          currentListPoc.push(poc);
                        } else {
                          futureListPoc.push(poc);
                        }
                      });
                      const numPart = currentListPoc.length + futureListPoc.length;
                      if (numPart === 0) {
                        this.showService.showNotification('Tranquillo!', 'La tua auto non si trova in una strada soggetta a pulizie.');
                      } else {
                        if (numPart === 1) {
                          if (currentListPoc.length === 1) {
                            this.showService.showNotification1(currentListPoc[0]);
                          } else {
                            this.showService.showNotification2(futureListPoc[0]);
                          }
                        } else {
                          if (currentListPoc.length === 0) {
                            this.showService.showNotification3(futureListPoc);
                          } else {
                            this.showService.showNotification4(currentListPoc, futureListPoc);
                          }
                        }
                      }
                    });
                  } else {
                    this.showService.showNotification('DEBUG', 'query a Firebase fallita');
                  }
                }, httpError => {
                  this.showService.showNotification('DEBUG', 'richiesta http a OpenStreetMap fallita');
                });
              } else {
                this.splashScreen.hide();
              }
            });
          } else {
            this.splashScreen.hide();
          }
        });
      }, error => {
        this.splashScreen.hide();
      });
    });
    this.platform.pause.subscribe(() => {
      this.db.disconnectFirebaseDb();
    });
  }
}
