import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProgressbarService {
    fullQuoteProgressValue: number;
    constructor() {
        this.fullQuoteProgressValue = 0;
    }
}
