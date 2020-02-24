import { Injectable, ChangeDetectorRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { Poc } from '../models/poc.model';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  private storageSub = new Subject<string>();

  constructor(
    private localStorage: LocalStorageService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications
  ) { }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  async showError(error: string) {
    const alert = await this.alertCtrl.create({
      header: 'Errore',
      subHeader: error,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

  showNotification(title: string, text: string) {
    this.localNotifications.schedule({
      title,
      text,
      led: '0000FF',
    });
  }

  showNotification1(poc: Poc) {
    this.localNotifications.schedule([
      {
        id: 1,
        title: 'Attenzione! Sposta l\'auto',
        text: this.currentPocToText(poc),
        actions: [
          { id: 'button1', title: 'Sposto l\'auto' },
          { id: 'button2', title: 'Aggiungi a Promemoria' }
        ],
      }
    ]
    );
    this.localNotifications.on('button1').subscribe(() => {
      this.localNotifications.clear(1);
    });
    this.localNotifications.on('button2').subscribe(() => {
      this.storage.get('listPoc').then((memos: Poc[]) => {
        if (memos) {
          if (!(memos.find(memo => memo.id === poc.id))) {
            memos.push(poc);
          }
        } else {
          memos = [];
          memos.push(poc);
        }
      });
      this.localNotifications.clear(1);
    });
  }

  showNotification2(poc: Poc) {
    this.localNotifications.schedule([
      {
        id: 1,
        title: 'Attenzione!',
        text: this.pocToText(poc),
        actions: [
          { id: 'button1', title: 'Aggiungi a Promemoria' }
        ],
      }
    ]
    );
    this.localNotifications.on('button1').subscribe(() => {
      this.storage.get('listPoc').then((memos: Poc[]) => {
        if (memos) {
          if (!(memos.find(memo => memo.id === poc.id))) {
            memos.push(poc);
          }
        } else {
          memos = [];
          memos.push(poc);
        }
      });
      this.localNotifications.clear(1);
    });
  }

  showNotification3(listPoc: Poc[]) {
    const arrayNotification: ILocalNotification[] = [];
    let i = 0;
    for (i = 0; i < listPoc.length; i++) {
      arrayNotification.push({
        id: i,
        title: 'Attenzione!',
        text: this.pocToText(listPoc[i]),
        actions: [
          { id: 'button' + i.toString(), title: 'Aggiungi a Promemoria' }
        ],
        group: 'type1'
      });
    }
    arrayNotification.push(
      {
        id: -1,
        summary: 'main',
        group: 'type1',
        groupSummary: true
      }
    );
    this.localNotifications.schedule(
      arrayNotification
    );
    for (i = 0; i < listPoc.length; i++) {
      const j = i;
      this.localNotifications.on('button' + i.toString()).subscribe(() => {
        this.storage.get('listPoc').then((memos: Poc[]) => {
          if (memos) {
            if (!(memos.find(memo => memo.id === listPoc[j].id))) {
              memos.push(listPoc[j]);
            }
          } else {
            memos = [];
            memos.push(listPoc[j]);
          }
          /*this.storage.set('listPoc', memos);
          this.storageSub.next('added');*/
          this.localStorage.setItem('listPoc', memos);
        });
        this.localNotifications.clear(i);

      });
    }

  }

  showNotification4(currentListPoc: Poc[], futureListPoc: Poc[]) {
    const arrayNotification: ILocalNotification[] = [];
    let i = 0;
    for (i = 0; i < futureListPoc.length; i++) {
      arrayNotification.push({
        id: i,
        title: 'Attenzione!',
        text: this.pocToText(futureListPoc[i]),
        actions: [
          { id: 'button' + i.toString(), title: 'Aggiungi a Promemoria' }
        ],
        group: 'type2'
      });
    }
    for (i = 0; i < currentListPoc.length; i++) {
      arrayNotification.push({
        id: i + futureListPoc.length,
        title: 'Attenzione!, Sposta l\'auto!',
        text: this.currentPocToText(currentListPoc[i]),
        actions: [
          { id: 'button' + (i + futureListPoc.length).toString(), title: 'Aggiungi a Promemoria' },
          { id: 'closeButton' + i.toString(), title: 'Sposta l\'auto' }
        ],
        group: 'type1'
      });
    }

    arrayNotification.push(
      {
        id: -1,
        summary: 'main',
        group: 'type1',
        groupSummary: true
      }
    );
    arrayNotification.push(
      {
        id: -2,
        summary: 'main',
        group: 'type2',
        groupSummary: true
      }
    );
    this.localNotifications.schedule(
      arrayNotification
    );

    for (i = 0; i < (currentListPoc.length + futureListPoc.length); i++) {
      const j = i;
      this.localNotifications.on('button' + i.toString()).subscribe(() => {
        if (i < futureListPoc.length) {
          this.storage.get('listPoc').then((memos: Poc[]) => {
            if (memos) {
              if (!(memos.find(memo => memo.id === futureListPoc[j].id))) {
                memos.push(futureListPoc[j]);
              }
            } else {
              memos = [];
              memos.push(futureListPoc[j]);
            }
          });
        } else {
          this.storage.get('listPoc').then((memos: Poc[]) => {
            if (memos) {
              if (!(memos.find(memo => memo.id === currentListPoc[j - futureListPoc.length].id))) {
                memos.push(currentListPoc[j - futureListPoc.length]);
              }
            } else {
              memos = [];
              memos.push(currentListPoc[j - futureListPoc.length]);
            }
          });
        }
        console.log('Aggiungi a Local Storage listPoc[i]');
        this.localNotifications.clear(i);
      });
      if (i >= futureListPoc.length) {
        this.localNotifications.on('closeButton' + (i - futureListPoc.length).toString()).subscribe(() => {
          this.localNotifications.clear(i);
        });
      }
    }

  }



  pocToText(poc: Poc) {
    let text: string = 'In ' + poc.indirizzo + ' c\'è pulizia strade ';
    if (poc.sett_mese !== '') {
      if (poc.giorno_set === 'DOMENICA') {
        text += 'la ' + poc.sett_mese.replace(',', '° e la ') + '° ' + poc.giorno_set;
      } else {
        text += 'il ' + poc.sett_mese.replace(',', '° e il ') + '° ' + poc.giorno_set;
      }
      text += ' del mese';
      if (poc.tratto_str !== '') {
        text += ' nel tratto ' + poc.tratto_str;
      }
      text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
    } else {
      if (poc.giorno_pari === '1') {
        text += 'ogni ' + poc.giorno_set + ' pari del mese';
        if (poc.tratto_str !== '') {
          text += ' nel tratto ' + poc.tratto_str;
        }
        text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
      }
      if (poc.giorno_dispari === '1') {
        text += 'ogni ' + poc.giorno_set + ' dispari del mese';
        if (poc.tratto_str !== '') {
          text += ' nel tratto ' + poc.tratto_str;
        }
        text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
      }
      if (poc.giorno_dispari === '1' && poc.giorno_pari === '1') {
        text += 'ogni ' + poc.giorno_set + ' del mese';
        if (poc.tratto_str !== '') {
          text += ' nel tratto ' + poc.tratto_str;
        }
        text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
      }
    }
    return text;
  }

  currentPocToText(poc: Poc) {
    let text: string = 'In ' + poc.indirizzo + ' è in corso la pulizia strade ';
    if (poc.tratto_str !== '') {
      text += 'nel tratto ' + poc.tratto_str;
    }
    return text;
  }
}
