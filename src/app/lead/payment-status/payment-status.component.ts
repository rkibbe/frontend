import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { CallBackService } from '@services/call-back.service';
import { NavigationService } from '@services/navigation.service';
import { PaymentMethodModalComponent } from '@shared/payment-method-modal/payment-method-modal.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
    selector: 'verti-payment-status',
    templateUrl: './payment-status.component.html'
})
export class PaymentStatusComponent implements OnInit, OnDestroy {
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    replaceUrl: boolean;
    constructor(
        private store: Store<any>,
        private navService: NavigationService,
        private dialog: MatDialog,
        private paymentCallBack: CallBackService
    ) {
        this.replaceUrl = true;
    }

    ngOnInit() {
        this.navService.upDateMarketingData();
        this.store.dispatch(new LoaderActions.StopLoaderAction());
        this.saveAndNavigateToNextPage();
    }
    private saveAndNavigateToNextPage(): void {
        // TODO save address and navigate
        this.loaderStopped = false;
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((leadData: Lead) => {
                this.triggerPaymentCallBackService(leadData.quote.evoToken.paymentToken);
            });
    }
    triggerPaymentCallBackService(token: string) {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        this.paymentCallBack.doCallBack(token).subscribe(
            res => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                if (!res['error']) {
                    this.navService.paymentCallBackCompleted = true;
                    this.store.dispatch(new LeadActions.SaveQuote({ paymentDetails: res }));
                    const dialogRef = this.dialog.open(PaymentMethodModalComponent, {
                        panelClass: 'payment-confirmation'
                    });
                    dialogRef.afterClosed().subscribe(() => {
                        // this.navService.gotoRouteByName('paymentconfirm', this.replaceUrl);
                        this.navService.navigate();
                    });
                } else {
                    this.handleErrorScenario();
                }
            },
            err => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                this.handleErrorScenario();
            }
        );
    }
    handleErrorScenario() {
        this.navService.gotoRouteByName('payer', this.replaceUrl);
    }
    ngOnDestroy() { }
}
