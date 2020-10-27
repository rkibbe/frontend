import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'verti-timeout-modal',
    templateUrl: './timeout-modal.component.html',
    styleUrls: ['./timeout-modal.component.scss']
})
export class TimeoutModalComponent {
    title: string;
    imgSource: any;

    constructor(public dialogRef: MatDialogRef<TimeoutModalComponent>) {
        this.dialogRef.disableClose = true;
        this.imgSource = './assets/img/Blink_Icon.svg';
        this.title = `Sorry, we blinked`;
    }

    close() {
        this.dialogRef.close();
    }
}
