import { Component, OnInit } from '@angular/core';
import { IonRadio, LoadingController, NavController, MenuController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Device } from 'src/app/models/device.model';
import { ShowService } from 'src/app/services/show.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { DevicesService } from 'src/app/services/devices.service';

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
    private menuCtrl: MenuController,
    private connectionService: ConnectionService,
    private devicesService: DevicesService
  ) { }

  ngOnInit() {
    this.menuCtrl.swipeGesture(false);
    this.onRefresh();
  }

  onRefresh() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.associatedDevices = [];
      this.bluetoothSerial.list().then((devices: any[]) => {
        devices.forEach((device: any) => {
          const newDevice = new Device(device.name, device.id);
          this.associatedDevices.push(newDevice);
          this.devicesService.add(newDevice);
        });
      });
    }, error => {
      this.navCtrl.navigateBack('/menu/home');
      this.showService.showToast('Attiva il bluetooth');
    });
  }

  onDiscover() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.availableDevices = [];
      this.isDiscovering = true;
      this.bluetoothSerial.discoverUnpaired().then((devices: any[]) => {
        const discoveredMacs = [];
        const discoveredDevices = [];

        // toglie i duplicati
        devices.forEach((device: any) => {
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
            this.devicesService.add(discoveredDevice);
          }
        });
        this.isDiscovering = false;
        this.showService.showToast(`${this.availableDevices.length} dispostivi trovati!`);
      }, error => {
        this.showService.showError('Qualcosa è andato storto');
      });
    }, error => {
      this.navCtrl.navigateBack('/menu/home');
      this.showService.showToast('Attiva il bluetooth');
    });
  }

  onSelect(radio: IonRadio) {
    this.radio = radio;
    this.isSelected = true;
  }

  onConnect() {
    this.bluetoothSerial.isEnabled().then(success => {
      const selectedMac = this.radio.value;
      this.loadingCtrl.create({
        keyboardClose: true,
        message: 'Mi sto connettendo...'
      }).then(loadingEl => {
        loadingEl.present();
        this.bluetoothSerial.connect(selectedMac).subscribe(connected => {
          loadingEl.dismiss();
          const device = this.devicesService.getDevice(selectedMac);
          this.connectionService.connect(device);
          this.navCtrl.navigateBack('/menu/home');
        }, error => {
          if (this.connectionService.connectionState) {
            this.connectionService.connectionState = false;
            this.showService.showNotification('Florence Clean Parking', 'Disconnesso');
            // TODO correggere il pulsante disconnetti nella home page
          } else {
            loadingEl.dismiss();
            this.showService.showError('impossibile connettersi a questo dispositivo!');
          }
        });
      });
    }, error => {
      this.navCtrl.navigateBack('/menu/home');
      this.showService.showToast('Attiva il bluetooth');
    });
  }

}
