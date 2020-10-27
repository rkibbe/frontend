import { Injectable } from '@angular/core';
import { Formatter } from './formatter';

@Injectable({
    providedIn: 'root'
})
export class EmailFormatter implements Formatter {
    constructor() {}

    format(value: string): string {
        return this.removeUnimportantChars(value);
    }

    removeUnimportantChars(value) {
        return value.replace(/[^\w\-\@\.]/g, '');
    }
}
