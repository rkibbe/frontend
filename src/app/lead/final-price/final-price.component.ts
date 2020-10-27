import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NavigationService } from '@services/navigation.service';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { ViewPorts } from '@app/store/models/lead.model';
import { DateSuffix } from '@shared/pipes/datesuffix.pipe';

@Component({
    selector: 'verti-final-price',
    templateUrl: './final-price.component.html',
    styleUrls: ['./final-price.component.scss'],
    providers: [DateSuffix]
})
export class FinalPriceComponent implements OnInit, OnDestroy {
    private ngDestroy$ = new Subject();
    constructor(private store: Store<any>, private navService: NavigationService) {}

    ngOnInit(): void {}

    doContinue(event): void {
        console.log('event plant id', event);
        // this.store.dispatch(new LeadActions.SaveQuote(this.finalPriceForm.value));
        this.store.dispatch(new LeadActions.SaveQuote({ selectedPaymentPlan: event }));
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }
}
