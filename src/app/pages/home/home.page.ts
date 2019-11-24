import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ShowService } from 'src/app/services/show.service';
import { ConnectionService } from 'src/app/services/connection.service';

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
    public connectionService: ConnectionService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(true);
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
