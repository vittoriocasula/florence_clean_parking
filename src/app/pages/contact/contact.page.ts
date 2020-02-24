import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  contacts = [
    {
      imageUrl: '../../assets/dave.png',
      eMail: 'femiadavide04@gmail.com',
      name: 'Davide',
      surname: 'Femia'
    },
    {
      imageUrl: '../../assets/vitto.jpg',
      eMail: 'vittoriocasula@gmail.com',
      name: 'Vittorio',
      surname: 'Casula'
    }
  ];

  constructor(
  ) { }

  ngOnInit() {
  }

}
