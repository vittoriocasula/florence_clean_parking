import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonCheckbox } from '@ionic/angular';
import { Poc } from 'src/app/models/poc.model';
import { Storage } from '@ionic/storage';
import { ShowService } from 'src/app/services/show.service';

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

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private showService: ShowService
  ) { }

  ngOnInit() {
    this.listPoc = this.listPoc.filter(poc => {
      let isValid: boolean;
      if (poc.sett_mese !== '') {
        const selectedWeek = this.getSelectedWeek();
        isValid = false;
        const weeks = poc.sett_mese.split(',');
        weeks.forEach(week => {
          if (selectedWeek === +week) {
            isValid = true;
          }
        });
      } else {
        const selectedDate = this.getSelectedDate();
        if (poc.giorno_pari === '1') {
          isValid = (selectedDate.getDate() % 2) === 0;
        }
        if (poc.giorno_dispari === '1') {
          isValid = (selectedDate.getDate() % 2) === 1;
        }
        if (poc.giorno_dispari === '1' && poc.giorno_pari === '1') {
          isValid = true;
        }
      }
      if (this.time && isValid) {
        const selectedHour = +this.time.split(':')[0];
        const selectedMinutes = +this.time.split(':')[1];
        const hourStart = +poc.ora_inizio.split(':')[0];
        const minutesStart = +poc.ora_inizio.split(':')[1];
        const hourEnd = +poc.ora_fine.split(':')[0];
        const minutesEnd = +poc.ora_fine.split(':')[1];
        if (this.timeLower(selectedHour, selectedMinutes, hourStart, minutesStart)) {
          isValid = false;
        }
        if (this.timeGreater(selectedHour, selectedMinutes, hourEnd, minutesEnd)) {
          isValid = false;
        }
      }
      return isValid;
    });
  }

  private getSelectedWeek() {
    const selectedDate = this.getSelectedDate();
    let selectedDay = selectedDate.getDate() - 7;
    let selectedWeek = 1;
    while (selectedDay > 0) {
      selectedWeek++;
      selectedDay -= 7;
    }
    return selectedWeek;
  }

  private getSelectedDate(): Date {
    const days = ['LUNEDI\'', 'MARTEDI\'', 'MERCOLEDI\'', 'GIOVEDI\'', 'VENERDI\'', 'SABATO', 'DOMENICA'];
    const dayOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let selectedHour: number;
    let selectedMinutes: number;
    if (this.time) {
      selectedHour = +this.time.split(':')[0];
      selectedMinutes = +this.time.split(':')[1];
    }
    const currentDate = new Date();
    let selectedMonth = currentDate.getMonth();
    let selectedYear = currentDate.getFullYear();
    if (this.isLeapYear(selectedYear)) {
      dayOfMonths[1]++;
    }
    let selectedDay = currentDate.getDate() + (days.indexOf(this.day) + 8 - currentDate.getDay()) % 7;
    if (selectedDay > dayOfMonths[selectedMonth]) {
      selectedDay -= dayOfMonths[selectedMonth];
      selectedMonth++;
      if (selectedMonth === 12) {
        selectedMonth = 0;
        selectedYear++;
      }
    }
    let selectedDate: Date;
    if (this.time) {
      selectedDate = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinutes);
    } else {
      selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    }
    return selectedDate;
  }

  private isLeapYear(year: number) {
    let isLeap = false;
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
      isLeap = true;
    }
    return isLeap;
  }

  private timeGreater(hourTarget: number, minutesTarget: number, hour: number, minutes: number) {
    let isGreater = false;
    if (hourTarget > hour) {
      isGreater = true;
    }
    if (hourTarget === hour && minutesTarget > minutes) {
      isGreater = true;
    }
    return isGreater;
  }

  private timeLower(hourTarget: number, minutesTarget: number, hour: number, minutes: number) {
    let isLower = false;
    if (hourTarget < hour) {
      isLower = true;
    }
    if (hourTarget === hour && minutesTarget < minutes) {
      isLower = true;
    }
    return isLower;
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
