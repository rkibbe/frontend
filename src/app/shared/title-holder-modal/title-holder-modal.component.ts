import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TitleHolder } from '@app/store/models/lead.model';

@Component({
    selector: 'verti-title-holder-modal',
    templateUrl: './title-holder-modal.component.html',
    styleUrls: ['./title-holder-modal.component.scss']
})
export class TitleHolderModalComponent {
    get title() {
        switch (this.titleHolderType) {
            case TitleHolder.TRUST:
                return 'Trusts are unique.';
            case TitleHolder.COMPANY:
                return 'Fleets and company vehicles are unique.';
            case TitleHolder.UNKNOWN:
                return 'Nobody knows everything.';
            default:
                return '';
        }
    }

    get subtitle() {
        switch (this.titleHolderType) {
            case TitleHolder.TRUST:
            case TitleHolder.COMPANY:
                return 'Please call us to make sure you’re getting the right coverage.';
            case TitleHolder.UNKNOWN:
            default:
                return 'Give us a call. Our licensed agents are happy to help to make sure you’re getting the right coverage.';
        }
    }

    constructor(
        public dialogRef: MatDialogRef<TitleHolderModalComponent>,
        @Inject(MAT_DIALOG_DATA) public titleHolderType: TitleHolder
    ) {}

    onContactClick() {
        this.dialogRef.close(true);
    }

    onCloseClick() {
        this.dialogRef.close(false);
    }
}
