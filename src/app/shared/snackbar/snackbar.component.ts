import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarData } from '@services/snackbar.service';

@Component({
    selector: 'verti-snackbar.component',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
    constructor(
        private ref: MatSnackBarRef<SnackbarComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData
    ) {}

    ngOnInit() {}
    onAction() {
        this.ref.dismissWithAction();
    }
}
