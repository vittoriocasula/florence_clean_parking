import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  contacts = [
    {
      imageUrl: '../../assets/person.png',
      eMail: 'femiadavide04@gmail.com',
      name: 'Davide',
      surname: 'Femia'
    },
    {
      imageUrl: '../../assets/person.png',
      eMail: 'vittoriocasula@gmail.com',
      name: 'Vittorio',
      surname: 'Casula'
    }
  ];

  constructor(
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.menuCtrl.swipeGesture(false);
  }

}
