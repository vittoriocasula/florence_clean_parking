import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'Connetti',
      url: '/menu/connect',
      icon: 'bluetooth'
    },
    {
      title: 'Ricerca',
      icon: 'search',
      children: [
        {
          title: 'Ricerca per indirizzo',
          url: '/menu/search-address',
          icon: 'pin'
        },
        {
          title: 'Ricerca per data',
          url: '/menu/search-date',
          icon: 'calendar'
        }]
    },
    {
      title: 'Contattaci',
      url: '/menu/contact',
      icon: 'contacts'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
