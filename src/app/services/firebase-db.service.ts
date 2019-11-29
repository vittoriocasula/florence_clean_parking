import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
require('firebase/database');

const firebaseConfig = {
  apiKey: 'AIzaSyCq7s_bxSPetLzpOlFn6U8DqZv3JB90BtA',
  authDomain: 'florence-clean-parking.firebaseapp.com',
  databaseURL: 'https://florence-clean-parking.firebaseio.com',
  projectId: 'florence-clean-parking',
  storageBucket: 'florence-clean-parking.appspot.com',
  messagingSenderId: '259106426339',
  appId: '1:259106426339:web:ce09814b2fdde213'
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseDbService {
  private query: any;
  private database: any;

  constructor() { }

  setFirebaseDb() { // occorre richiamare questo metodi prima di una query ( se sono più query successive basta una sola volta)
    firebase.initializeApp(firebaseConfig);
    this.database = firebase.database();
  }

  getPocByAddress(address: string) {
    this.query = this.database.ref().orderByChild('indirizzo').equalTo(address);
    return this.query.once('value');
  }
  getPocByDay(day: string) {
    this.query = this.database.ref().orderByChild('giorno_set').equalTo(day);
    return this.query.once('value');
  }
}
