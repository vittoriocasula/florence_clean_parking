import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  iconUrl = '../assets/icon/icon.png';
  imgSensorGPS = '../assets/modulogps.png';
  imgModuleBluetooth = '../assets/modulobluetooth.png';
  imgArduino = '../assets/arduinouno.png';
  imgKit = '../assets/kitelectronics.png';

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
