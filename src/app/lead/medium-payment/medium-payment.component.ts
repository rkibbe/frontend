import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'verti-medium-payment',
    templateUrl: './medium-payment.component.html',
    styleUrls: ['./medium-payment.component.scss']
})
export class MediumPaymentComponent implements OnInit {
    @Input() mediumPlanPayment;
    @Output() selectedPlan = new EventEmitter();
    paymentSchedule: boolean;
    rateValue: string;
    constructor() {
        this.paymentSchedule = false;
    }

    ngOnInit() {
        this.rateValue = this.mediumPlanPayment.planId.split(':')[1] === '01' ? 'today' : 'mo';
        console.log('ratevalue---', this.rateValue);
        if (this.mediumPlanPayment.displaySize === 'large') {
            this.paymentSchedule = true;
        }
    }
    showPaymentSchedule() {
        this.paymentSchedule = true;
    }
    doContinue(planId) {
        this.selectedPlan.emit(planId);
    }
}
