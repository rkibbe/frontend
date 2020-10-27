import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { DiscountSavingModalComponent } from '@shared/discount-saving-modal/discount-saving-modal.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { WalmericDialogModalComponent } from '../../core/walmeric-dialog-modal/walmeric-dialog-modal.component';


@Component({
    selector: 'verti-rc-decline',
    templateUrl: './rc-decline.component.html',
    styleUrls: ['./rc-decline.component.scss']
})
export class RcDeclineComponent implements OnInit, OnDestroy {
    @HostBinding('class.verti-rc-decline') mainClass = true;

    imgSource: string;
    title: string;
    subtitle: string;
    para1: string;
    para2: string;
    firstName: string;
    leadSub: Subscription;

    constructor(private store: Store<any>, public dialog: MatDialog) {
        this.firstName = '';
        this.imgSource = './assets/img/Icon_SadRacoon.svg';
        this.title = 'You’ve been declined, sorry.';
        // this.subtitle = 'YOU HAVE BEEN DECLINED';
        // this.para1 = 'Based on current violation activity we can\'t offer you a policy at this time.' + ' ' +
        //   'You\'ll receive a notice in the mail shortly providing more details about why you were declined coverage.';
        // this.para2 = ' if there is more to this story & maybe we can still make things work.';
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
            'Any policy with more than 2 comprehensive losses above $1,000 or more than 2 not at fault accidents must have an otherwise clean driving record in the past 36 months.';
        this.para2 =
            "Based on current loss activity we can't offer you a policy at this time. You'll receive a notice in the mail shortly providing more details about why you were declined coverage.";
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

    openDialog() {
        this.dialog.open(DiscountSavingModalComponent, {
            panelClass: 'verti-discount-saving-modal'
        });
    }
}
