import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ShowService } from 'src/app/services/show.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private router: Router,
    private menuCtrl: MenuController,
    private showService: ShowService,
    public connectionService: ConnectionService,
    private positionService: PositionService
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
  }

  handleData(data: string) {
    // this.showService.showToast('received:');
    const message = data.split(':');
    if (message[0] === 'lat') {
      this.positionService.setArduinoLat(message[1]);
    } else {
      this.positionService.setArduinoLng(message[1]);
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

}
