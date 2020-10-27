import { Injectable } from '@angular/core';
import { Formatter } from './formatter';

@Injectable({
    providedIn: 'root'
})
export class PhoneFormatter implements Formatter {
    constructor() {}

    format(value: string): string {
        value = this.removeUnimportantChars(value);
        value = this.insertSpecialChars(value);
        return value;
    }

    removeUnimportantChars(value) {
        return value.replace(/\D/g, '');
    }

    insertSpecialChars(value: string): string {
        if (value.length < 3) {
            return value;
        } else if (value.length < 6) {
            return value.replace(/^(\d{3})?(\d{0,3})?/, '$1-$2');
        }

        return value.substr(0, 10).replace(/^(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
    }
}
