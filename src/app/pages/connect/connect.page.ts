import { Component, OnInit } from '@angular/core';
import { IonRadio, LoadingController, NavController, MenuController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Device } from 'src/app/models/device.model';
import { ShowService } from 'src/app/services/show.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { DevicesService } from 'src/app/services/devices.service';
import { PositionService } from 'src/app/services/position.service';
import { Poc } from 'src/app/models/poc.model';
import { FirebaseDbService } from 'src/app/services/firebase-db.service';

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
    private devicesService: DevicesService,
    private positionService: PositionService,
    private db: FirebaseDbService
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
            this.connectionService.connectionState = false; // TODO correggere il pulsante disconnetti nella home page
            const arduinoLat = this.positionService.getArduinoLat();
            const arduinoLng = this.positionService.getArduinoLng();
            this.positionService.getStreet(arduinoLat, arduinoLng).subscribe(httpSuccess => {
              // tslint:disable-next-line: no-string-literal
              const address = httpSuccess['address']['road'];
              // this.showService.showNotification('Disconnesso', address);
              console.log(address);
              this.db.getPocByAddress(address.trim().toUpperCase()).then(dbSuccess => {
                /* const currentListPoc: Poc[] = []; // li notifico subito
                const imminentListPoc: Poc[] = []; // li notifico subito
                const futureListPoc: Poc[] = []; // li notifico un ora prima di quando avvengono
                // in questo caso i tratti identificano un posto, dato che la via è uguale per tutti
                const advertisedPartArray = []; // l'array dei tratti da notificare subito
                const unadvertisedPartArray = []; // l'array dei tratti da notificare in futuro
                const times = []; // lo mantengo per non ricalcolare i missingMinutes
                dbSuccess.forEach((childSnapshot: any) => {
                  const poc: Poc = childSnapshot.val();
                  const missingMinutes = poc.getMissingMinutes();
                  if (missingMinutes === 0) {
                    currentListPoc.push(poc);
                    advertisedPartArray.push(poc.tratto_str);
                  }
                  if (missingMinutes <= 60 && missingMinutes > 0) {
                    imminentListPoc.push(poc);
                    advertisedPartArray.push(poc.tratto_str);
                  }
                  if (missingMinutes > 60) {
                    if (advertisedPartArray.indexOf(poc.tratto_str) === -1) {
                      const index = unadvertisedPartArray.indexOf(poc.tratto_str);
                      if (index === -1) {
                        futureListPoc.push(poc);
                        unadvertisedPartArray.push(poc.tratto_str);
                        times.push(missingMinutes);
                      } else {
                        if (missingMinutes < times[index]) {
                          times[index] = missingMinutes;
                          futureListPoc[index] = poc;
                        }
                      }
                    }
                  }
                });
                console.log(currentListPoc);
                console.log(imminentListPoc);
                console.log(futureListPoc); */
                // i poc in currentListPoc sono già raggruppati li notifico tutti insieme
                // i poc in imminentListPoc sono già raggruppati devono mostrare nella notifica i missingTimes
                // i futureListPoc vanno raggruppati per missingMinutes e notificati un ora prima()
              }, dbError => {
                // db request fallisce
              });
            }, httpError => {
              this.showService.showNotification('Disconnesso', 'lat=' + arduinoLat + ' lng=' + arduinoLng);
              // http request fallisce
            });
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
