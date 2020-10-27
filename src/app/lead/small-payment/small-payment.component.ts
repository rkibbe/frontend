import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'verti-small-payment',
    templateUrl: './small-payment.component.html',
    styleUrls: ['./small-payment.component.scss']
})
export class SmallPaymentComponent implements OnInit {
    @Output() smallPayment = new EventEmitter();
    @Input() smallPlanPayment;
    constructor() {}

    ngOnInit() {}
    goToMedium() {
        this.smallPayment.emit(this.smallPlanPayment.planId);
    }
}
