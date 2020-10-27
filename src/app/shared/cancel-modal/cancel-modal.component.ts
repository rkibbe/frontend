import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '@env/environment';

@Component({
    selector: 'verti-cancel-modal',
    templateUrl: './cancel-modal.component.html',
    styleUrls: ['./cancel-modal.component.scss']
})
export class CancelModalComponent implements OnInit {
    public title: string;
    public message: string;
    errorMessage: string;
    constructor(public dialogRef: MatDialogRef<CancelModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.dialogRef.disableClose = true;
        this.errorMessage = '';
    }

    ngOnInit() {}

    close(): void {
        // errorCode might be string or number so used ==
        this.dialogRef.close();
    }
}
