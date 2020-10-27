import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'verti-addfile-modal',
    templateUrl: './addfile-modal.component.html',
    styleUrls: ['./addfile-modal.component.scss']
})
export class AddfileModalComponent implements OnInit {
    public title: string;
    public message: string;
    constructor(public dialogRef: MatDialogRef<AddfileModalComponent>, @Inject(MAT_DIALOG_DATA) public errorData) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() { }

    close(): void {
        this.dialogRef.close();
    }
}
