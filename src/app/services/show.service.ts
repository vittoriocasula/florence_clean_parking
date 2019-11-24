import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications
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
      header: 'Errore',
      subHeader: error,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

  showNotification(title: string, text: string) {
    this.localNotifications.schedule({
      title,
      text,
      led: '0000FF',
    });
  }
}
