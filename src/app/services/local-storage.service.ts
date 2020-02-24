import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storageSub = new Subject<string>();

  constructor(
    private storage: Storage
  ) { }

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    this.storage.set(key, data);
    this.storageSub.next('added');
  }

  getItem(key: string) {
    this.storageSub.next('getted');
    return this.storage.get(key);
  }

  removeItem(key: string) {
    this.storage.remove(key);
    this.storageSub.next('removed');
  }
}
