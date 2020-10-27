import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@services/navigation.service';
import { Store } from '@ngrx/store';
import { BindPolicyService } from '@services/bind-policy.service';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Lead } from 'src/app/store/models/lead.model';
import { take } from 'rxjs/operators';
import * as fromStore from '@app/store/reducers/lead.reducers';

@Component({
    selector: 'verti-payment-failed',
    templateUrl: './payment-failed.component.html',
    styleUrls: ['./payment-failed.component.scss']
})
export class PaymentFailedComponent implements OnInit {
    lead: Lead;
    constructor(private store: Store<any>, private navService: NavigationService, private bindPolicyService: BindPolicyService) {
        this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((lead: Lead) => {
                this.lead = lead;
            });
    }
    ngOnInit() { }

    public onChangePaymentMethodClick(): void {
        this.navService.gotoRouteByName('payer');
    }

    public onTryCardAgainClick(): void {
        this.triggerBindPolicyService();
    }
    triggerBindPolicyService() {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        this.bindPolicyService.bindPolicy(this.lead).subscribe(
            res => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                if (!res['error']) {
                    this.navService.gotoRouteByName('paymentsuccess', true);
                }
            },
            err => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
            }
        );
    }
    handleErrorScenario() {
        this.navService.gotoRouteByName('paymentfail');
    }
}
