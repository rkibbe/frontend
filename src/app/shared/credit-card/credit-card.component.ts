import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'verti-credit-card',
    templateUrl: './credit-card.component.html',
    styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
    @HostBinding('class.verti-credit-card') mainClass = true;
    @Input() cardType: string;
    @Input() cardHolder: string;
    @Input() cardNumber: string | number;

    constructor() {}

    ngOnInit() {
        this.cardNumber = '**** **** **** ' + this.cardNumber.toString().substr(this.cardNumber.toString().length - 4);
        if (this.cardType) {
            this.cardType = this.cardType.toLocaleLowerCase();
        }
    }
}
