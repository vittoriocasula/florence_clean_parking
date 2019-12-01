import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonCheckbox } from '@ionic/angular';
import { Poc } from 'src/app/models/poc.model';

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


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.part) {
      this.listPoc = this.listPoc.filter((poc: Poc) => { // true se lo voglio false altrimenti
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
    this.indexArray.forEach(index => {
      const poc = this.listPoc[index]; // qui ottengo la lista dei poc selezionati
    });
  }

}
