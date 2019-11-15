import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'menu/home', pathMatch: 'full' },
  { path: 'menu/home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'menu/connect', loadChildren: './pages/connect/connect.module#ConnectPageModule' },
  { path: 'menu/contact', loadChildren: './pages/contact/contact.module#ContactPageModule' },
  { path: 'menu/search-date', loadChildren: './pages/search-date/search-date.module#SearchDatePageModule' },
  { path: 'menu/search-address', loadChildren: './pages/search-address/search-address.module#SearchAddressPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
