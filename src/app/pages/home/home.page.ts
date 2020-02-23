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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  memos: Poc[] = [];

  constructor(
    private modalCtrl: ModalController,
    private bluetoothSerial: BluetoothSerial,
    private router: Router,
    private menuCtrl: MenuController,
    private showService: ShowService,
    public connectionService: ConnectionService,
    private positionService: PositionService,
    private storage: Storage
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
      let realLat: string;
      realLat = message[1].trim().replace('\n', '');
      realLat = Array.from(realLat).splice(1, realLat.length - 2).join('');
      this.positionService.setArduinoLat(realLat);
      this.storage.set('arduinoLat', realLat);
      // this.positionService.setArduinoLat(message[1]);
    } else {
      let realLng: string;
      realLng = message[1].trim().replace('\n', '');
      realLng = Array.from(realLng).splice(1, realLng.length - 2).join('');
      this.positionService.setArduinoLat(realLng);
      this.storage.set('arduinoLng', realLng);
      // this.positionService.setArduinoLng(message[1]);
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
  }

  onCancel(memo: Poc) {
    this.memos = this.memos.filter((poc: Poc) => poc.id !== memo.id);
    this.storage.set('listPoc', this.memos);
  }

}
