import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '@env/environment';

@Component({
    selector: 'verti-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
    public title: string;
    public message: string;
    errorMessage: string;
    constructor(public dialogRef: MatDialogRef<DeleteModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.dialogRef.disableClose = true;
        this.errorMessage = '';
    }

    ngOnInit() {}

    close(): void {
        this.dialogRef.close();
    }
}
