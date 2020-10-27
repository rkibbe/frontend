import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'verti-payment-method-modal',
    templateUrl: './payment-method-modal.component.html',
    styleUrls: ['./payment-method-modal.component.scss']
})
export class PaymentMethodModalComponent implements OnInit, OnDestroy {
    private dismissModalTimer: NodeJS.Timer;
    imgSource: string;
    title: string;
    constructor(private dialogRef: MatDialogRef<PaymentMethodModalComponent>) {
        this.imgSource = './assets/img/confirmation.svg';
        this.title = 'Your payment method is ready to be used.';
    }

    ngOnInit() {
        this.dismissModalTimer = setTimeout(() => this.dialogRef.close(), 3000);
    }

    public ngOnDestroy(): void {
        clearTimeout(this.dismissModalTimer);
    }
}
