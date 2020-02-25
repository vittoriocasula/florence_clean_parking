import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonCheckbox } from '@ionic/angular';
import { Poc } from 'src/app/models/poc.model';
import { Storage } from '@ionic/storage';
import { ShowService } from 'src/app/services/show.service';

@Component({
  selector: 'app-address-result',
  templateUrl: './address-result.component.html',
  styleUrls: ['./address-result.component.scss'],
})
export class AddressResultComponent implements OnInit {

  @Input() address: string;
  @Input() part: string;
  @Input() listPoc: Poc[];
  indexArray = [];


  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private showService: ShowService
  ) { }

  ngOnInit() {
    if (this.part) {
      this.listPoc = this.listPoc.filter((poc: Poc) => {
        return poc.tratto_str === this.part.trim().toUpperCase();
      });
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onChange(box: IonCheckbox, poc: Poc) {
    if (box.checked) {
      this.indexArray.push(this.listPoc.indexOf(poc));
    } else {
      this.indexArray = this.indexArray.filter(index => {
        return index !== this.listPoc.indexOf(poc);
      });
    }
  }

  onMemo() {
    this.storage.get('listPoc').then((listPoc: Poc[]) => {
      if (listPoc) {
        this.indexArray.forEach(index => {
          if (!(listPoc.find(poc => poc.id === this.listPoc[index].id))) {
            listPoc.push(this.listPoc[index]);
          }
        });
      } else {
        listPoc = [];
        this.indexArray.forEach(index => {
          listPoc.push(this.listPoc[index]);
        });
      }
      this.storage.set('listPoc', listPoc);
      this.modalCtrl.dismiss(null, 'cancel');
    }, error => {
      this.showService.showToast('Qualcosa è andato storto');
    });
  }

}
