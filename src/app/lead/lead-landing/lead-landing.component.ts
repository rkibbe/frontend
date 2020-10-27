import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { takeUntil } from 'rxjs/operators';
import { Lead, PrimaryAddress } from 'src/app/store/models/lead.model';
import { AppState } from 'src/app/store/reducers';
import { NavigationService } from '@services/navigation.service';
import { PhoneFormatter } from '@shared/formatters/phone-formatter';
import { DateFormatter } from '@shared/formatters/date-formatter';

@Component({
    selector: 'verti-lead-landing',
    templateUrl: './lead-landing.component.html',
    styleUrls: ['./lead-landing.component.scss']
})
export class LeadLandingComponent implements OnInit, OnDestroy {
    isPriceAvailable: boolean;
    firstName: string;
    destroy$ = new Subject();
    monthlyPremiumPrice: number;
    fullTermPremiumPrice: number;
    name: string;
    dob: string;
    email: string;
    phoneNum: string;
    address: PrimaryAddress;
    constructor(private store: Store<AppState>, private navService: NavigationService,
        private phoneFormatter: PhoneFormatter, private dateFormatter: DateFormatter) {
    }

    ngOnInit() {
        this.store
            .select(fromStore.leadSelector)
            .pipe(takeUntil(this.destroy$))
            .subscribe((leadData: Lead) => {
                this.firstName = leadData.firstName;
                this.name = `${this.firstName} ${leadData.lastName}`;
                this.email = leadData.primaryEmailAddress;
                const phoneNumber = leadData.phoneNumber;
                this.phoneNum = phoneNumber ? this.formatPhoneNumber(phoneNumber) : '';
                this.address = leadData.primaryAddress;
                const quickQuote = leadData.quickQuote;
                this.dob = this.formatPniDob(leadData.dateOfBirth);
                this.monthlyPremiumPrice = +quickQuote.monthlyPremiumPrice;
                this.isPriceAvailable = this.monthlyPremiumPrice > 0;
                this.fullTermPremiumPrice = quickQuote.fullTermPremiumPrice;
            });
    }
    continue() {
        this.navService.saveLeadAndNavigate(this.destroy$);
    }
    formatPhoneNumber(phoneNum) {
        return this.phoneFormatter.format(phoneNum);
    }
    formatPniDob(dob) {
        return this.dateFormatter.format(
            ('00' + dob.month).substr(-2, 2) +
            ('00' + dob.day).substr(-2, 2) +
            ('0000' + dob.year).substr(-4, 4)
        );
    }
    goToBasicInfo() {
        this.navService.gotoRouteByName('basicinfo');
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
