import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SavePNIData } from '@app/store/actions/lead.actions';
import { Lead } from '@app/store/models/lead.model';
import { leadSelector } from '@app/store/reducers/lead.reducers';
import { select, Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { phoneValidator } from '@shared/validators/phone-validator';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'verti-pni-phone',
    templateUrl: './pni-phone.component.html'
})
export class PniPhoneComponent implements OnInit, OnDestroy {
    public phoneControl: FormControl;

    public showPhoneError = false;

    private _showPhonePrefix = false;
    get showPhonePrefix(): boolean {
        return this._showPhonePrefix || !!this.phoneControl.value;
    }
    set showPhonePrefix(show: boolean) {
        this._showPhonePrefix = show;
    }

    private ngDestroy$ = new Subject();

    constructor(
        public phoneFormatter: PhoneFormatter,
        private store: Store<any>,
        private navService: NavigationService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.prefillPhoneNumber();
        this.navService.upDateMarketingData();
    }

    private buildForm(): void {
        this.phoneControl = new FormControl(
            '',
            Validators.compose([Validators.required, phoneValidator(this.phoneFormatter)])
        );
    }

    private prefillPhoneNumber(): void {
        if (this.navService.currentRouteObj.preFill) {
            this.store
                .pipe(
                    select(leadSelector),
                    take(1),
                    takeUntil(this.ngDestroy$)
                )
                .subscribe((lead: Lead) =>
                    this.phoneControl.setValue(this.phoneFormatter.format(lead.phoneNumber || ''))
                );
        }
    }

    public onPhoneBlur() {
        this.showPhonePrefix = !!this.phoneControl.value;
        this.showPhoneError = this.phoneControl.hasError('phone');
    }

    public onPhoneFocus(): void {
        this.showPhonePrefix = true;
    }

    public shouldShowPhoneError(): boolean {
        return this.showPhoneError && this.phoneControl.hasError('phone');
    }

    public onSubmit(): void {
        this.store.dispatch(
            new SavePNIData({
                phoneNumber: this.phoneFormatter.removeUnimportantChars(this.phoneControl.value)
            } as Partial<Lead>)
        );

        this.navService.setPhonePageFlag(true);
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }

    ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}
