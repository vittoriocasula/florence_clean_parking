import { Component } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AddressResultComponent } from './address-result/address-result.component';
import { NgForm } from '@angular/forms';
import { Poc } from 'src/app/models/poc.model';
import { FirebaseDbService } from 'src/app/services/firebase-db.service';
import { ShowService } from 'src/app/services/show.service';

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.page.html',
  styleUrls: ['./search-address.page.scss'],
})
export class SearchAddressPage {

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private db: FirebaseDbService,
    private showService: ShowService
  ) { }

  ionViewWillEnter() { }

  presentModal(address: string, part: string, listPoc: Poc[]) {
    const modal = this.modalCtrl.create({
      component: AddressResultComponent,
      componentProps: {
        address,
        part,
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
      this.db.getPocByAddress(f.form.value.address.trim().toUpperCase()).then((success: any) => {
        loadingEl.dismiss();
        success.forEach((childSnapshot: any) => {
          listPoc.push(childSnapshot.val());
        });
        this.presentModal(f.form.value.address, f.form.value.part, listPoc);
      }, (error: any) => {
        loadingEl.dismiss();
        this.showService.showError('Ricerca Fallita');
      });
    });
  }


}
