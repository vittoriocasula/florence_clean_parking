import { Pipe, PipeTransform } from '@angular/core';
import { Poc } from '../models/poc.model';

@Pipe({name: 'addressQuery'})
export class AddressQueryPipe implements PipeTransform {
  transform(poc: Poc, part: boolean): string {
    let text: string;
    if (part) {
        if (poc.sett_mese !== '') {
            if (poc.giorno_set === 'DOMENICA') {
                text = 'La ' + poc.sett_mese.replace(',', '° e la ') + '° ' + poc.giorno_set;
            } else {
                text = 'Il ' + poc.sett_mese.replace(',', '° e il ') + '° ' + poc.giorno_set;
            }
            text += ' del mese dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
        } else {
            if (poc.giorno_pari === '1') {
                text = 'Ogni ' + poc.giorno_set + ' pari del mese dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
            }
            if (poc.giorno_dispari === '1') {
                text = 'Ogni ' + poc.giorno_set + ' dispari del mese dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
            }
            if (poc.giorno_dispari === '1' && poc.giorno_pari === '1') {
                text = 'Ogni ' + poc.giorno_set + ' del mese dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
            }
        }
    } else {
        if (poc.sett_mese !== '') {
            if (poc.giorno_set === 'DOMENICA') {
                text = 'La ' + poc.sett_mese.replace(',', '° e la ') + '° ' + poc.giorno_set;
            } else {
                text = 'Il ' + poc.sett_mese.replace(',', '° e il ') + '° ' + poc.giorno_set;
            }
            text += ' del mese';
            if (poc.tratto_str !== '') {
                text += ' nel tratto ' + poc.tratto_str;
            }
            text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
        } else {
            if (poc.giorno_pari === '1') {
                text = 'Ogni ' + poc.giorno_set + ' pari del mese';
                if (poc.tratto_str !== '') {
                    text += ' nel tratto ' + poc.tratto_str;
                }
                text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
            }
            if (poc.giorno_dispari === '1') {
                text = 'Ogni ' + poc.giorno_set + ' dispari del mese';
                if (poc.tratto_str !== '') {
                    text += ' nel tratto ' + poc.tratto_str;
                }
                text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
            }
            if (poc.giorno_dispari === '1' && poc.giorno_pari === '1') {
                text = 'Ogni ' + poc.giorno_set + ' del mese';
                if (poc.tratto_str !== '') {
                    text += ' nel tratto ' + poc.tratto_str;
                }
                text += ' dalle ore ' + poc.ora_inizio + ' alle ' + poc.ora_fine;
            }
        }
    }
    return text;
  }
}
