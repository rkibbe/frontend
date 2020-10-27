import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'verti-existing-damage',
    templateUrl: './existing-damage.component.html',
    styleUrls: ['./existing-damage.component.scss']
})
export class ExistingDamageComponent implements OnInit {
    title: string;
    imgSource: string;
    constructor(
        public dialogRef: MatDialogRef<ExistingDamageComponent> // @Inject(MAT_DIALOG_DATA) public data: DialogTitle
    ) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.title = 'What is ‘existing damage’?';
        this.imgSource = './assets/img/existing_damage.svg';
    }

    close(): void {
        this.dialogRef.close();
    }
}
