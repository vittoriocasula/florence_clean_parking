import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { TutorialComponent } from './tutorial/tutorial.component';
import { ShowService } from 'src/app/services/show.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { PositionService } from 'src/app/services/position.service';
import { Poc } from 'src/app/models/poc.model';
import { Storage } from '@ionic/storage';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TimeService } from 'src/app/services/time.service';
import { Network } from '@ionic-native/network/ngx';
import { FirebaseDbService } from 'src/app/services/firebase-db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  memos: Poc[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private bluetoothSerial: BluetoothSerial,
    private router: Router,
    private menuCtrl: MenuController,
    private showService: ShowService,
    public connectionService: ConnectionService,
    private positionService: PositionService,
    private storage: Storage,
    private timeService: TimeService,
    private network: Network,
    private db: FirebaseDbService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(true);
    if (this.connectionService.connectionState) {
      this.bluetoothSerial.subscribe('\n').subscribe(success => {
        if (!((success + '').toString() === '\n')) {
          this.handleData(success);
        }
      }, error => {
        this.showService.showError(error);
      });
    }
    this.localStorage.watchStorage().subscribe((message: string) => {
      if (message === 'added') {
        this.localStorage.getItem('listPoc').then((listPoc) => {
          if (listPoc) {
            this.memos = listPoc;
          } else {
            this.memos = [];
          }
        });
      }
    });
    this.storage.get('listPoc').then((listPoc: Poc[]) => {
      if (listPoc) {
        this.memos = listPoc;
      } else {
        this.memos = [];
      }
    });
    this.storage.get('firstLogin').then((firstLogin: boolean) => {
      if (!(firstLogin)) {
        this.presentModal();
        this.storage.set('firstLogin', true);
      }
    });
  }

  presentModal() {
    const modal = this.modalCtrl.create({
      component: TutorialComponent
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  handleData(data: string) {
    const message = data.split(':');
    if (message[0] === 'lat') {
      let arduinoLat: string;
      arduinoLat = message[1].trim().replace('\n', '');
      arduinoLat = Array.from(arduinoLat).splice(1, arduinoLat.length - 2).join('');
      this.positionService.setArduinoLat(arduinoLat);
    } else {
      let arduinoLng: string;
      arduinoLng = message[1].trim().replace('\n', '');
      arduinoLng = Array.from(arduinoLng).splice(1, arduinoLng.length - 2).join('');
      this.positionService.setArduinoLng(arduinoLng);
    }
  }

  onConnect() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.router.navigateByUrl('/menu/connect');
    }, error => {
      this.showService.showToast('Attiva il bluetooth');
    });
  }

  onDisconnect() {
    this.bluetoothSerial.disconnect();
    this.connectionService.disconnect();
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
  }

  onCancel(memo: Poc) {
    this.memos = this.memos.filter((poc: Poc) => poc.id !== memo.id);
    this.storage.set('listPoc', this.memos);
  }

}
