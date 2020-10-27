import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NavigationService } from '@services/navigation.service';

@Component({
    selector: 'verti-recover-quote-not-found-modal',
    templateUrl: './recover-quote-not-found-modal.component.html',
    styleUrls: ['./recover-quote-not-found-modal.component.scss']
})
export class RecoverQuoteNotFoundModalComponent {
    constructor(private dialogRef: MatDialogRef<RecoverQuoteNotFoundModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private navService: NavigationService) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    onTryAgainClick(): void {
        this.dialogRef.close();
    }

    onStartNewQuoteClick(): void {
        this.dialogRef.close();
        this.navService.gotoRouteByName(this.data);
    }
}
