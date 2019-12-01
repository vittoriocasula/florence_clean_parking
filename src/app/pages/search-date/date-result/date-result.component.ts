import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonCheckbox } from '@ionic/angular';
import { Poc } from 'src/app/models/poc.model';

@Component({
  selector: 'app-date-result',
  templateUrl: './date-result.component.html',
  styleUrls: ['./date-result.component.scss'],
})
export class DateResultComponent implements OnInit {

  @Input() listPoc: Poc[];
  @Input() day: string;
  @Input() time: string;
  indexArray = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.time) { // filtro le ore
      const selectedTime: string[] = this.time.split(':');
      const selectedHour: number = +selectedTime[0];
      const selectedMinutes: number = +selectedTime[1];
      this.listPoc = this.listPoc.filter((poc: Poc) => { // true quando lo voglio
        let isContained = true;
        const timeStart: string[] = poc.ora_inizio.split(':');
        const hourStart: number = +timeStart[0];
        const minutesStart: number = +timeStart[1];
        const timeEnd: string[] = poc.ora_fine.split(':');
        const hourEnd: number = +timeEnd[0];
        const minutesEnd: number = +timeEnd[1];
        if (selectedHour < hourStart || selectedHour > hourEnd) {
          isContained = false;
        }
        if (selectedMinutes < minutesStart || selectedMinutes > minutesEnd) {
          isContained = false;
        }
        return isContained;
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
