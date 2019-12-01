import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchDatePage } from './search-date.page';
import { DateResultComponent } from './date-result/date-result.component';

const routes: Routes = [
  {
    path: '',
    component: SearchDatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SearchDatePage, DateResultComponent],
  entryComponents: [DateResultComponent]
})
export class SearchDatePageModule {}
