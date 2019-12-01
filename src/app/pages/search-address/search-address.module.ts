import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchAddressPage } from './search-address.page';
import { AddressResultComponent } from './address-result/address-result.component';

const routes: Routes = [
  {
    path: '',
    component: SearchAddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SearchAddressPage, AddressResultComponent],
  entryComponents: [AddressResultComponent]
})
export class SearchAddressPageModule {}
