import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
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
      header: 'Error',
      subHeader: error,
      buttons: ['Dismiss']
    });
    await alert.present();
  }
}
