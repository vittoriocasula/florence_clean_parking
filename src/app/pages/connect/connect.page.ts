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
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { TimeService } from 'src/app/services/time.service';

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
    private timeService: TimeService,
    private network: Network,
    private storage: Storage,
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
        console.log('ONREFRESH:\n');
        console.log(devices);
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
        console.log('ONDISCOVER:\n');
        const discoveredMacs = [];
        const discoveredDevices = [];

        // toglie i duplicati
        devices.forEach((device: any) => {
          if (discoveredMacs.indexOf(device.id) === -1) {
            discoveredMacs.push(device.id);
            console.log(device); // ci sono anche gli accoppiati
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
          this.storage.set('lastMacDevice', selectedMac);
          const device = this.devicesService.getDevice(selectedMac);
          this.connectionService.connect(device);
          this.storage.set('lastDevice', device);
          this.navCtrl.navigateBack('/menu/home');
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
                this.showService.showNotification('Error', 'Interrogazione a Firebase fallita');
              }
            }, httpError => {
              this.showService.showNotification('Errore', 'Richiesta http a OpenStreetMap fallita');
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
