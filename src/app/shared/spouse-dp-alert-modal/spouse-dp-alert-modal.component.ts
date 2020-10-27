import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'verti-spouse-dp-alert-modal',
    templateUrl: './spouse-dp-alert-modal.component.html',
    styleUrls: ['./spouse-dp-alert-modal.component.scss']
})
export class SpouseDPAlertModalComponent {
    title: string;
    imgSource: string;
    text: string;
    ctaText: string;
    constructor(public dialogRef: MatDialogRef<SpouseDPAlertModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.dialogRef.disableClose = true;
        this.imgSource = './assets/img/Phone.svg';
        this.title = `Missing Information`;
        if (this.data === 'M') {
            this.text = 'Your marital status is MARRIED. Please provide more details.';
            this.ctaText = 'ADD SPOUSE';
        } else if (this.data === 'C') {
            this.text = 'Your marital status is DOMESTIC PARTNER. Please provide more details.';
            this.ctaText = 'ADD PARTNER';
        } else {
            this.title = `Conflicting information`;
            this.text = 'You can only have one spouse OR domestic partner on a policy in Pennsylvania.';
            this.ctaText = 'Fix this conflict';
        }
    }

    close() {
        this.dialogRef.close();
    }
}
