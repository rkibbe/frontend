import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NavigationService } from '@services/navigation.service';
import { WalmericDialogModalComponent } from '../../core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';
@Component({
    selector: 'verti-price-change',
    templateUrl: './price-change.component.html',
    styleUrls: ['./price-change.component.scss']
})
export class PriceChangeComponent implements OnInit, OnDestroy {
    @HostBinding('class.verti-price-change') mainClass = true;

    public priceChange: number;
    public monthlyPremiumPrice: string;
    public fullPremium: string;
    public premiumChangeIndicator: number;
    contactNumber: string;
    private ngDestroy$ = new Subject();
    constructor(
        private store: Store<any>,
        private navService: NavigationService,
        public dialog: MatDialog
    ) {
    }

    public ngOnInit(): void {
        this.store
            .select(fromStore.quoteSelector)
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(quote => {
                this.priceChange = +quote.changedMonthlyPrice;
                this.monthlyPremiumPrice = quote.monthlyPremium.toString();
                this.fullPremium = quote.fullPremium.toString();
                this.premiumChangeIndicator = quote.premiumChangeIndicator;
                if (this.premiumChangeIndicator < 0) {
                    this.priceChange = this.priceChange * -1;
                }

                this.navService.upDateMarketingData();
            });
        this.contactNumber = VERTI_CONTACT_NUMBERS.PRICECHANGE;
    }

    public doContinue(): void {
        this.navService.navigate();
    }

    public openWalmaric(): void {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }

    public ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}
