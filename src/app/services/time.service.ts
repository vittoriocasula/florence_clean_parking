import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  getWeek(date: Date) {
    let selectedDay = date.getDate() - 7;
    let selectedWeek = 1;
    while (selectedDay > 0) {
      selectedWeek++;
      selectedDay -= 7;
    }
    return selectedWeek;
  }

  timeGreater(hourTarget: number, minutesTarget: number, hour: number, minutes: number) {
    let isGreater = false;
    if (hourTarget > hour) {
      isGreater = true;
    }
    if (hourTarget === hour && minutesTarget > minutes) {
      isGreater = true;
    }
    return isGreater;
  }

  timeLower(hourTarget: number, minutesTarget: number, hour: number, minutes: number) {
    let isLower = false;
    if (hourTarget < hour) {
      isLower = true;
    }
    if (hourTarget === hour && minutesTarget < minutes) {
      isLower = true;
    }
    return isLower;
  }

  isLeapYear(year: number) {
    let isLeap = false;
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
      isLeap = true;
    }
    return isLeap;
  }
}
