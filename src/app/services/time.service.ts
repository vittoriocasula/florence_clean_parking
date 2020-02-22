import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  public bilateralTimeConstraint(targetTime: string, lowerBound: string, upperBound: string) {
    return this.upperTimeConstraint(targetTime, upperBound) && this.lowerTimeConstraint(targetTime, lowerBound);
  }

  public upperTimeConstraint(targetTime: string, upperBound: string): boolean {
    let timeParser = targetTime.split(':');
    const targetHour = +timeParser[0];
    const targetMinutes = +timeParser[1];
    timeParser = upperBound.split(':');
    const boundHour = +timeParser[0];
    const boundMinutes = +timeParser[1];
    let isLower = false;
    if (targetHour < boundHour) {
      isLower = true;
    }
    if (targetHour === boundHour && targetMinutes <= boundMinutes) {
      isLower = true;
    }
    return isLower;
  }

  public lowerTimeConstraint(targetTime: string, lowerBound: string): boolean {
    let timeParser = targetTime.split(':');
    const targetHour = +timeParser[0];
    const targetMinutes = +timeParser[1];
    timeParser = lowerBound.split(':');
    const boundHour = +timeParser[0];
    const boundMinutes = +timeParser[1];
    let isGreater = false;
    if (targetHour > boundHour) {
      isGreater = true;
    }
    if (targetHour === boundHour && targetMinutes >= boundMinutes) {
      isGreater = true;
    }
    return isGreater;
  }
}
