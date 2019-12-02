import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { DateResultComponent } from './date-result/date-result.component';
import { FirebaseDbService } from 'src/app/services/firebase-db.service';
import { Poc } from 'src/app/models/poc.model';
import { ShowService } from 'src/app/services/show.service';

@Component({
  selector: 'app-search-date',
  templateUrl: './search-date.page.html',
  styleUrls: ['./search-date.page.scss'],
})
export class SearchDatePage {

  public days = [
    {value: 'LUNEDI\'', text: 'Lunedì'},
    {value: 'MARTEDI\'', text: 'Martedì'},
    {value: 'MERCOLEDI\'', text: 'Mercoledì'},
    {value: 'GIOVEDI\'', text: 'Giovedì'},
    {value: 'VENERDI\'', text: 'Venerdì'},
    {value: 'SABATO', text: 'Sabato'},
    {value: 'DOMENICA', text: 'Domenica'}
  ];

  constructor(
    private modalCtrl: ModalController,
    private db: FirebaseDbService,
    private showService: ShowService,
    private loadingCtrl: LoadingController
  ) { }

  ionViewWillEnter() { }

  presentModal(day: string, time: string, listPoc: Poc[]) {
    const modal = this.modalCtrl.create({
      component: DateResultComponent,
      componentProps: {
        day,
        time,
        listPoc
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  onSubmit(f: NgForm) {
    const listPoc = [];
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Sto cercando...'
    }).then(loadingEl => {
      loadingEl.present();
      this.db.getPocByDay(f.value.selectedDay).then((success: any) => {
        loadingEl.dismiss();
        success.forEach((childSnapshot: any) => {
          listPoc.push(childSnapshot.val());
        });
        this.presentModal(f.value.selectedDay, f.value.selectedTime.substring(11, 16), listPoc);
      }, (error: any) => {
        loadingEl.dismiss();
        this.showService.showError('Ricerca Fallita');
      });
    });
    // this.presentModal(f.value.selectedDay, f.value.selectedTime.substring(11, 16));
  }

}
