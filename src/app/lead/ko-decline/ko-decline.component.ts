import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { Lead } from '@app/store/models/lead.model';
import { take } from 'rxjs/operators';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { WalmericDialogModalComponent } from '../../core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';
@Component({
    selector: 'verti-ko-decline',
    templateUrl: './ko-decline.component.html',
    styleUrls: ['./ko-decline.component.scss']
})
export class KoDeclineComponent implements OnInit, OnDestroy {
    @HostBinding('class.verti-ko-decline') mainClass = true;

    imgSource: string;
    title: string;
    subtitle: string;
    para1: string;
    para2: string;
    firstName: string;
    leadSub: Subscription;
    contactNumber: string;
    constructor(
        private store: Store<any>,
        public dialog: MatDialog
    ) {
        this.firstName = '';
        this.imgSource = './assets/img/Icon_SadRacoon.svg';
        this.title = 'Sorry.';
    }

    ngOnInit() {
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.firstName = leadData.firstName || '';
                this.subtitle = this.firstName + ' HAS BEEN DECLINED';
            });

        this.para1 =
            'Based on the answers you provided about your driving history and requirements for car insurance, ' +
            '' +
            "we can't offer you a policy at this time. You'll receive a notice in the mail shortly providing more details " +
            '' +
            'about why you were declined coverage.';
        this.para2 = " if there's more to discuss and maybe we can still make things work.";
        this.contactNumber = VERTI_CONTACT_NUMBERS.KODECLINE;
    }
    openWalmericModal() {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }
    ngOnDestroy() {
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
    }
}
