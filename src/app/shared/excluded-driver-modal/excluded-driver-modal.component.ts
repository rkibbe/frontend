import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Driver } from '@app/store/models/lead.model';

@Component({
    selector: 'verti-excluded-driver-modal',
    templateUrl: './excluded-driver-modal.component.html',
    styleUrls: ['./excluded-driver-modal.component.scss']
})
export class ExcludedDriverModalComponent {
    constructor(
        private dialogRef: MatDialogRef<ExcludedDriverModalComponent>,
        @Inject(MAT_DIALOG_DATA) public driver: Driver
    ) {
        this.dialogRef.disableClose = true;
    }

    onUnderstandClick() {
        this.dialogRef.close();
    }
}
