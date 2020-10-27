import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { EMPTY, forkJoin, Observable, Subject } from 'rxjs';
import { catchError, finalize, first, takeUntil } from 'rxjs/operators';
import { NavigationService } from '@services/navigation.service';
import { TypeListOption, TypeListService } from '@services/type-list.service';
import { WalmericDialogModalComponent } from '../../core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { StartLoaderAction, StopLoaderAction } from '@app/store/actions/loader.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';
@Component({
    selector: 'verti-discount-saving-modal',
    templateUrl: './discount-saving-modal.component.html',
    styleUrls: ['./discount-saving-modal.component.scss']
})
export class DiscountSavingModalComponent implements OnInit, OnDestroy {
    public savings: string;
    public discountsAvailable: TypeListOption[] = [];
    private ngDestroy$ = new Subject();
    contactNumber: string;
    constructor(
        public dialogRef: MatDialogRef<DiscountSavingModalComponent>,
        public dialog: MatDialog,
        private typeListService: TypeListService,
        private navService: NavigationService,
        private store: Store<any>
    ) {
        this.dialogRef.disableClose = true;
    }

    public ngOnInit() {
        this.store.dispatch(new StartLoaderAction());
        forkJoin(this.store.select(fromStore.quoteSelector).pipe(first(quote => !!quote)), this.getDiscountTypes())
            .pipe(
                takeUntil(this.ngDestroy$),
                finalize(() => this.store.dispatch(new StopLoaderAction()))
            )
            .subscribe(([quote, discountTypes]) => {
                this.savings = quote.savings || '';
                this.discountsAvailable = this.getQuoteDiscountTypes(discountTypes, quote.discounts || []);
            });
        this.contactNumber = VERTI_CONTACT_NUMBERS.DEFAULT;
    }

    public close(): void {
        this.dialogRef.close();
    }

    public openWalmaric(): void {
        this.dialog.open(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    }

    private getDiscountTypes(): Observable<TypeListOption[]> {
        return this.typeListService.getDiscountTypes().pipe(
            catchError(_ => {
                this.navService.routeToSystemFailure();
                return EMPTY;
            })
        );
    }

    private getQuoteDiscountTypes(discountTypes: TypeListOption[], quoteDiscounts: string[]): TypeListOption[] {
        return discountTypes.filter(discount =>
            quoteDiscounts.find(qDiscount => qDiscount.trim() === discount.code.trim())
        );
    }

    public ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}
