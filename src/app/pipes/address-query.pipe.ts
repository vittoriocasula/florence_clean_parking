import { Pipe, PipeTransform } from '@angular/core';
import { Poc } from '../models/poc.model';

@Pipe({name: 'addressQuery'})
export class AddressQueryPipe implements PipeTransform {
  transform(value: Poc, arg: boolean): string {
    let text: string;
    if (arg) {
        if (value.sett_mese !== '') {
            text = 'Il ' + value.sett_mese.replace(',', '° e il ') + '° ' + value.giorno_set + ' del mese ';
            text += ' dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
        } else {
            if (value.giorno_pari === '1') {
                text = 'Ogni ' + value.giorno_set + ' pari del mese dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
            }
            if (value.giorno_dispari === '1') {
                text = 'Ogni ' + value.giorno_set + ' dispari del mese dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
            }
            if (value.giorno_dispari === '1' && value.giorno_pari === '1') {
                text = 'Ogni ' + value.giorno_set + ' del mese dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
            }
        }
    } else {
        if (value.sett_mese !== '') {
            text = 'Il ' + value.sett_mese.replace(',', '° e il ') + '° ' + value.giorno_set + ' del mese ';
            text += 'nel tratto ' + value.tratto_str + 'dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
        } else {
            if (value.giorno_pari === '1') {
                text = 'Ogni ' + value.giorno_set + ' pari del mese nel tratto ' + value.tratto_str;
                text += ' dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
            }
            if (value.giorno_dispari === '1') {
                text = 'Ogni ' + value.giorno_set + ' dispari del mese nel tratto ' + value.tratto_str;
                text += ' dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
            }
            if (value.giorno_dispari === '1' && value.giorno_pari === '1') {
                text = 'Ogni ' + value.giorno_set + ' del mese nel tratto ' + value.tratto_str;
                text += ' dalle ore ' + value.ora_inizio + ' alle ' + value.ora_fine;
            }
        }
    }
    return text;
  }
}
