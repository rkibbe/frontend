import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Driver } from '@app/store/models/lead.model';

@Component({
    selector: 'verti-included-driver-modal',
    templateUrl: './included-driver-modal.component.html',
    styleUrls: ['./included-driver-modal.component.scss']
})
export class IncludedDriverModalComponent {
    constructor(
        private dialogRef: MatDialogRef<IncludedDriverModalComponent>,
        @Inject(MAT_DIALOG_DATA) public driver: Driver
    ) {
        this.dialogRef.disableClose = true;
    }

    onExcludeClick() {
        this.dialogRef.close(false);
    }

    onIncludeClick() {
        this.dialogRef.close(true);
    }
}
