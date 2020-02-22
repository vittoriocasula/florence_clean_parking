import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dateHeader'})
export class DateHeaderPipe implements PipeTransform {
  transform(day: string, time): string {
    const days = ['DOMENICA', 'LUNEDI\'', 'MARTEDI\'', 'MERCOLEDI\'', 'GIOVEDI\'', 'VENERDI\'', 'SABATO'];
    const currentDate = new Date();
    let text: string;
    if (days[currentDate.getDay()] === day) {
        text = 'Oggi';
    } else if (day === 'DOMENICA') {
        text = 'La prossima ' + day;
    } else {
        text = 'Il prossimo ' + day;
    }
    if (time) {
        text += ' alle ' + time;
    }
    text += ' c\'è pulizia strade nelle seguenti zone:';
    return text;
  }
}
