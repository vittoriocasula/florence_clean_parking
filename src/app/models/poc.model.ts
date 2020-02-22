export class Poc {
    // tslint:disable-next-line: variable-name
    codice_via: number;
    comune: string;
    // tslint:disable-next-line: variable-name
    giorno_set: string;
    id: number;
    indirizzo: string;
    // tslint:disable-next-line: variable-name
    ora_fine: string;
    // tslint:disable-next-line: variable-name
    ora_inizio: string;
    // tslint:disable-next-line: variable-name
    tratto_str: string;
    // tslint:disable-next-line: variable-name
    sett_mese: string;
    // tslint:disable-next-line: variable-name
    giorno_pari: string;
    // tslint:disable-next-line: variable-name
    giorno_dispari: string;

    /* public getFutureDate() {
        const days = ['LUNEDI\'', 'MARTEDI\'', 'MERCOLEDI\'', 'GIOVEDI\'', 'VENERDI\'', 'SABATO', 'DOMENICA'];
        const dayOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const currentDate = new Date();
        const splitTimes = this.ora_inizio.split(':');
        const hourOfPocMoment = +splitTimes[0];
        const minutesOfPocMoment = +splitTimes[1];
        let bestFutureDate: Date;
        if (this.sett_mese !== '') {
            const weeks = this.sett_mese.split(',');
            let missingTime: number;
            let bestMissingTime = Number.MAX_VALUE;
            weeks.forEach(week => {
                if (this.isLeapYear(currentDate.getFullYear())) {
                    dayOfMonths[1] = 29;
                } else {
                    dayOfMonths[1] = 28;
                }
                const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                let futureDate: Date;
                let firstPocDayOfMonth = 1 + (days.indexOf(this.giorno_set) + 8 - firstOfMonth.getDay()) % 7;
                let dayOfPocMoment = firstPocDayOfMonth + 7 * (+week - 1);
                let monthOfPocMoment = currentDate.getMonth();
                let yearOfPocMoment = currentDate.getFullYear();
                while (dayOfPocMoment > dayOfMonths[monthOfPocMoment]) {
                    monthOfPocMoment++;
                    if (monthOfPocMoment === 12) {
                        monthOfPocMoment = 0;
                        yearOfPocMoment++;
                        if (this.isLeapYear(yearOfPocMoment)) {
                            dayOfMonths[1] = 29;
                        } else {
                            dayOfMonths[0] = 28;
                        }
                        firstOfMonth.setFullYear(yearOfPocMoment);
                    }
                    firstOfMonth.setMonth(monthOfPocMoment);
                    firstPocDayOfMonth = 1 + (days.indexOf(this.giorno_set) + 8 - firstOfMonth.getDay()) % 7;
                    dayOfPocMoment = firstPocDayOfMonth + 7 * (+week - 1);
                }
                futureDate = new Date(yearOfPocMoment, monthOfPocMoment, dayOfPocMoment, hourOfPocMoment, minutesOfPocMoment);
                missingTime = futureDate.getTime() - currentDate.getTime();
                if (missingTime < 0) {
                    monthOfPocMoment++;
                    if (monthOfPocMoment === 12) {
                        monthOfPocMoment = 0;
                        yearOfPocMoment++;
                        if (this.isLeapYear(yearOfPocMoment)) {
                            dayOfMonths[1] = 29;
                        } else {
                            dayOfMonths[0] = 28;
                        }
                        firstOfMonth.setFullYear(yearOfPocMoment);
                    }
                    firstOfMonth.setMonth(monthOfPocMoment);
                    firstPocDayOfMonth = 1 + (days.indexOf(this.giorno_set) + 8 - firstOfMonth.getDay()) % 7;
                    dayOfPocMoment = firstPocDayOfMonth + 7 * (+week - 1);
                    while (dayOfPocMoment > dayOfMonths[monthOfPocMoment]) {
                        monthOfPocMoment++;
                        if (monthOfPocMoment === 12) {
                            monthOfPocMoment = 0;
                            yearOfPocMoment++;
                            if (this.isLeapYear(yearOfPocMoment)) {
                                dayOfMonths[1] = 29;
                            } else {
                                dayOfMonths[0] = 28;
                            }
                            firstOfMonth.setFullYear(yearOfPocMoment);
                        }
                        firstOfMonth.setMonth(monthOfPocMoment);
                        firstPocDayOfMonth = 1 + (days.indexOf(this.giorno_set) + 8 - firstOfMonth.getDay()) % 7;
                        dayOfPocMoment = firstPocDayOfMonth + 7 * (+week - 1);
                    }
                    futureDate = new Date(yearOfPocMoment, monthOfPocMoment, dayOfPocMoment, hourOfPocMoment, minutesOfPocMoment);
                    missingTime = futureDate.getTime() - currentDate.getTime();
                }
                if (missingTime < bestMissingTime) {
                    bestMissingTime = missingTime;
                    bestFutureDate = futureDate;
                }
            });
        } else {
            if (this.isLeapYear(currentDate.getFullYear())) {
                dayOfMonths[1] = 29;
            } else {
                dayOfMonths[1] = 28;
            }
            let dayOfPocMoment: number;
            let monthOfPocMoment = currentDate.getMonth();
            let yearOfPocMoment = currentDate.getFullYear();
            let bestEvenDay = currentDate.getDate() + (days.indexOf(this.giorno_set) + 8 - currentDate.getDay()) % 7;
            if (bestEvenDay > dayOfMonths[monthOfPocMoment]) {
                bestEvenDay -= dayOfMonths[monthOfPocMoment];
                monthOfPocMoment++;
                if (monthOfPocMoment === 12) {
                    monthOfPocMoment = 0;
                    yearOfPocMoment++;
                    if (this.isLeapYear(yearOfPocMoment)) {
                        dayOfMonths[1] = 29;
                    } else {
                        dayOfMonths[0] = 28;
                    }
                }
            }
            let bestOddDay = bestEvenDay;
            bestEvenDay += (bestEvenDay % 2) * 7;
            bestOddDay += (1 - bestOddDay % 2) * 7;
            if (this.giorno_pari === '1') {
                dayOfPocMoment = bestEvenDay;
            }
            if (this.giorno_dispari === '1') {
                dayOfPocMoment = bestOddDay;
            }
            if (this.giorno_dispari === '1' && this.giorno_pari === '1') {
                if (bestOddDay < bestEvenDay) {
                    dayOfPocMoment = bestOddDay;
                } else {
                    dayOfPocMoment = bestEvenDay;
                }
            }
            if (dayOfPocMoment > dayOfMonths[monthOfPocMoment]) {
                dayOfPocMoment += (dayOfMonths[monthOfPocMoment] % 2) * 7 - dayOfMonths[monthOfPocMoment];
                monthOfPocMoment++;
                if (monthOfPocMoment === 12) {
                    monthOfPocMoment = 0;
                    yearOfPocMoment++;
                    if (this.isLeapYear(currentDate.getFullYear())) {
                        dayOfMonths[1] = 29;
                    } else {
                        dayOfMonths[1] = 28;
                    }
                }
            }
            bestFutureDate = new Date(yearOfPocMoment, monthOfPocMoment, dayOfPocMoment, hourOfPocMoment, minutesOfPocMoment);
            const missingTime = bestFutureDate.getTime() - currentDate.getTime();
            if (missingTime < 0) {
                if (this.giorno_dispari === '1' && this.giorno_pari === '1') {
                    dayOfPocMoment += 7;
                    if (dayOfPocMoment > dayOfMonths[monthOfPocMoment]) {
                        dayOfPocMoment -= dayOfMonths[monthOfPocMoment];
                        monthOfPocMoment++;
                        if (monthOfPocMoment === 12) {
                            monthOfPocMoment = 0;
                            yearOfPocMoment++;
                            if (this.isLeapYear(yearOfPocMoment)) {
                                dayOfMonths[1] = 29;
                            } else {
                                dayOfMonths[1] = 28;
                            }
                        }
                    }
                } else {
                    dayOfPocMoment += 14;
                    if (dayOfPocMoment > dayOfMonths[monthOfPocMoment]) {
                        dayOfPocMoment += (dayOfMonths[monthOfPocMoment] % 2) * 7 - dayOfMonths[monthOfPocMoment];
                        monthOfPocMoment++;
                        if (monthOfPocMoment === 12) {
                            monthOfPocMoment = 0;
                            yearOfPocMoment++;
                            if (this.isLeapYear(yearOfPocMoment)) {
                                dayOfMonths[1] = 29;
                            } else {
                                dayOfMonths[1] = 28;
                            }
                        }
                    }
                }
                bestFutureDate = new Date(yearOfPocMoment, monthOfPocMoment, dayOfPocMoment, hourOfPocMoment, minutesOfPocMoment);
            }
        }
        return bestFutureDate;
    }

    public getMissingMinutes() {
        const currentDate = new Date();
        const futureDate = this.getFutureDate();
        let missingMinutes = futureDate.getTime() - currentDate.getTime();
        missingMinutes -= missingMinutes % 1000;
        missingMinutes /= 1000;
        missingMinutes -= missingMinutes % 60;
        missingMinutes /= 60;
        return missingMinutes;
    }

    private isLeapYear(year: number) {
        let isLeap = false;
        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
            isLeap = true;
        }
        return isLeap;
    } */
}
