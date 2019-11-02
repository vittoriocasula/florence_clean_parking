import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children:
    [
      { path: 'home', loadChildren: '../pages/home/home.module#HomePageModule'},
      { path: 'connect', loadChildren: '../pages/connect/connect.module#ConnectPageModule' },
      { path: 'contact', loadChildren: '../pages/contact/contact.module#ContactPageModule' },
      { path: 'search-date', loadChildren: '../pages/search-date/search-date.module#SearchDatePageModule' },
      { path: 'search-address', loadChildren: '../pages/search-address/search-address.module#SearchAddressPageModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
