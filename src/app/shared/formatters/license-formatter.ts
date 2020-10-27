import { Injectable } from '@angular/core';
import { Formatter } from './formatter';

@Injectable({
    providedIn: 'root'
})
export class LicenseFormatter implements Formatter {
    constructor() {}

    format(value: string): string {
        return this.removeUnimportantChars(value).toUpperCase();
    }

    removeUnimportantChars(value) {
        return value.replace(/[^a-zA-Z0-9*]/g, '');
    }
}
