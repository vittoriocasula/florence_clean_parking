import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ShowService } from 'src/app/services/show.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  bluetoothEnabled = true;
  isConnected: boolean;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(true);
    this.bluetoothSerial.isEnabled().then(success => {
      this.bluetoothSerial.isConnected().then(connect => {
        this.isConnected = true;
      }, error => {
        this.isConnected = false;
      });
    }, error => { });
  }

  onConnect() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.bluetoothEnabled = true;
      this.router.navigateByUrl('/menu/connect');
    }, error => {
      this.bluetoothEnabled = false;
    });
  }

  onDisconnect() {
    this.bluetoothSerial.disconnect();
    this.isConnected = false;
  }

}
