import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'verti-error-modal',
    templateUrl: './error-modal.component.html',
    styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
    imgSource: string;
    title: string;
    errorBody: string;
    emailPattern = /^[A-Za-z][A-Za-z0-9._-]+@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    constructor(public dialogRef: MatDialogRef<ErrorModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {
        if (this.data) {
            this.imgSource = this.data['imgSource'];
            this.title = this.data['title'];
            this.errorBody = this.data['body'];
        }
    }

    // onClose(): void {
    //   this.dialogRef.close();
    // }
}
