import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Subject } from 'rxjs';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { takeUntil } from 'rxjs/operators';
import { Lead } from '@app/store/models/lead.model';

@Component({
    selector: 'verti-discount-savings',
    templateUrl: './discount-savings.component.html',
    styleUrls: ['./discount-savings.component.scss']
})
export class DiscountSavingsComponent implements OnInit, OnDestroy {
    @Input('topSection') topSection;
    @Input('savingPrice') savingPrice;
    @Output() scrollToClassName = new EventEmitter();
    leadSub: Subscription;
    firstName: string;
    private ngDestroy$ = new Subject();
    constructor(private store: Store<any>) {
        this.firstName = '';
    }

    ngOnInit() {
        this.leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe((leadData: Lead) => {
                if (leadData.firstName) {
                    this.firstName = leadData.firstName;
                }
            });
    }
    scrollTo(className: string) {
        this.scrollToClassName.emit(className);
    }
    ngOnDestroy(): void {
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }
}
