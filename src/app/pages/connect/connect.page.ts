import { Component, OnInit } from '@angular/core';
import { IonRadio, LoadingController, NavController, MenuController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Device } from 'src/app/models/device.model';
import { ShowService } from 'src/app/services/show.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {
  associatedDevices: Device[];
  availableDevices: Device[];
  radio: IonRadio;
  isSelected: boolean;
  isDiscovering: boolean;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private showService: ShowService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.menuCtrl.swipeGesture(false);
    this.onRefresh();
  }

  onRefresh() {
    this.associatedDevices = [];
    this.bluetoothSerial.list().then((success: any[]) => {
      success.forEach((device: any) => {
        this.associatedDevices.push(new Device(device.name, device.id));
      });
    });
  }

  onDiscover() {
    this.availableDevices = [];
    this.isDiscovering = true;
    this.bluetoothSerial.discoverUnpaired().then((success: any[]) => {
      const discoveredMacs = [];
      const discoveredDevices = [];

      // toglie i duplicati
      success.forEach((device: any) => {
        if (discoveredMacs.indexOf(device.id) === -1) {
          discoveredMacs.push(device.id);
          discoveredDevices.push(new Device(device.name, device.id));
        }
      });

      // filtro i device già accoppiati
      discoveredDevices.forEach((discoveredDevice: Device) => {
        let deviceIsNew = true;
        this.associatedDevices.forEach((associatedDevice: Device) => {
          if (discoveredDevice.mac === associatedDevice.mac) {
            deviceIsNew = false;
          }
        });
        if (deviceIsNew) {
          this.availableDevices.push(discoveredDevice);
        }
      });
      this.isDiscovering = false;
      this.showService.showToast(`${this.availableDevices.length} Devices Found!`);
    }, error => {
      this.showService.showError('Something went wrong');
    });
  }

  onSelect(radio: IonRadio) {
    this.radio = radio;
    this.isSelected = true;
  }

  onConnect() {
    const selectedMac = this.radio.value;
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Mi sto connettendo...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bluetoothSerial.connect(selectedMac).subscribe(success => {
        loadingEl.dismiss();
        this.navCtrl.navigateBack('/menu/home');
      }, error => {
        loadingEl.dismiss();
        this.showService.showError('Connessione al Device fallita!');
      });
    });
  }

}
