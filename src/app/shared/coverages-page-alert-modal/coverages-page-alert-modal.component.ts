import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { SharedService } from '@services/shared.service';

@Component({
    selector: 'verti-coverages-page-alert-modal',
    templateUrl: './coverages-page-alert-modal.component.html',
    styleUrls: ['./coverages-page-alert-modal.component.scss']
})
export class CoveragesPageAlertModalComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<CoveragesPageAlertModalComponent>,
        private router: Router,
        private navService: NavigationService,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: boolean
    ) {}
    ngOnInit(): void {}

    stayOnThePage() {
        this.dialogRef.close(false);
        // this.sharedService.navigateAwaySelection$.next(false);
    }

    leaveOnThePage() {
        this.dialogRef.close(true);
        //this.navService.gotoRouteByName(this.data);
        // this.sharedService.navigateAwaySelection$.next(true);
    }
}
