import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'verti-big-price',
    templateUrl: './big-price.component.html',
    styleUrls: ['./big-price.component.scss']
})
export class BigPriceComponent implements OnChanges {
    @HostBinding('class.verti-big-price') mainClass = true;

    @Input() price: number | string;
    @Input() rate: string;
    @Input() savings: boolean;

    public dollar: string;
    public change: string;

    constructor() {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.price && typeof changes.price.currentValue !== 'undefined') {
            this.splitPriceComponents(changes.price.currentValue.toString());
        }
    }

    private splitPriceComponents(price: string): void {
        if (price) {
            const priceArr: string[] = price.split('.');
            this.dollar = priceArr[0];
            if (priceArr.length > 1) {
                this.change = (priceArr[1].length > 1 ? priceArr[1] : +priceArr[1] * 10).toString();
            } else {
                this.change = '00';
            }
        } else {
            this.dollar = '';
            this.change = '';
        }
    }
}
