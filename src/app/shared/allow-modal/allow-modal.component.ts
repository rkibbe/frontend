import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '@env/environment';

@Component({
    selector: 'verti-allow-modal',
    templateUrl: './allow-modal.component.html',
    styleUrls: ['./allow-modal.component.scss']
})
export class AllowModalComponent implements OnInit {
    public title: string;
    public message: string;
    errorMessage: string;
    constructor(public dialogRef: MatDialogRef<AllowModalComponent>, @Inject(MAT_DIALOG_DATA) public errorData) {
        this.dialogRef.disableClose = true;
        this.errorMessage = '';
    }

    ngOnInit() {}

    close(): void {
        // errorCode might be string or number so used ==
        this.dialogRef.close();
    }
}
