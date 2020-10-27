import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { Router } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { SharedService } from '@services/shared.service';

@Component({
    selector: 'verti-page-leaving-alert-modal',
    templateUrl: './page-leaving-alert-modal.component.html',
    styleUrls: ['./page-leaving-alert-modal.component.scss']
})
export class PageLeavingAlertModalComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<PageLeavingAlertModalComponent>,
        private router: Router,
        private navService: NavigationService,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: boolean
    ) { }
    ngOnInit(): void {
    }

    stayOnThePage() {
        this.dialogRef.close();
        this.sharedService.navigateAwaySelection$.next(false);
    }

    leaveAddVehicleFlow() {
        this.dialogRef.close();
        //this.navService.gotoRouteByName(this.data);
        this.sharedService.navigateAwaySelection$.next(true);
    }
}
