import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '@env/environment';
@Component({
    selector: 'verti-error-dialog-modal',
    templateUrl: './error-dialog-modal.component.html',
    styleUrls: ['./error-dialog-modal.component.scss']
})
export class ErrorDialogModalComponent implements OnInit {
    public title: string;
    public message: string;
    public errorCode: string;
    public uwError = false;
    errorMessage: string;
    constructor(public dialogRef: MatDialogRef<ErrorDialogModalComponent>, @Inject(MAT_DIALOG_DATA) public errorData) {
        this.dialogRef.disableClose = true;
        this.errorMessage = '';
    }

    ngOnInit() {
        this.errorMessage = this.errorData ? this.errorData.message : '';
        this.errorCode = this.errorData ? this.errorData.code : '';
    }

    close(): void {
        // errorCode might be string or number so used ==
        this.dialogRef.close();
        if (+this.errorCode === 603 || +this.errorCode === 602) {
            window.location.href = environment.vertiurl;
        }
    }
}
