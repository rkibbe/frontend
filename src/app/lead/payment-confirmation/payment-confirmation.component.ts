import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PostLeadSuccessAction } from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { BindPolicyService } from '@services/bind-policy.service';
import { NavigationService } from '@services/navigation.service';
import { SignFormsService } from '@services/sign-forms.service';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Lead, PaymentDueDate } from 'src/app/store/models/lead.model';
import { MONTH_NAMES } from '@app/core/constants';

@Component({
    selector: 'verti-payment-confirmation',
    templateUrl: './payment-confirmation.component.html',
    styleUrls: ['./payment-confirmation.component.scss']
})
export class PaymentConfirmationComponent implements OnInit, OnDestroy {
    agreeCheckboxControl: FormControl;
    price: string;
    cardType: string;
    cardHolder: string;
    cardNumber: string;
    fullPay: boolean;
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    lead: Lead;
    // nextPaymentDueDate: PaymentDueDate;
    nextPaymentDueDate: string;
    nextPaymentMonthDate: string;
    nextPaymentDay: string;
    showContent: boolean;
    longitude: string;
    latitude: string;
    formattedAddress: string;
    ipAddr: string;
    monthsArr: string[];

    constructor(
        private store: Store<any>,
        private navService: NavigationService,
        private bindPolicyService: BindPolicyService,
        private service: SignFormsService,
        private deviceService: DeviceDetectorService
    ) {
        this.monthsArr = MONTH_NAMES;
        this.longitude = '';
        this.latitude = '';
        this.formattedAddress = 'Location Access Denied';
        if (this.navService.policyNumber) {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            this.showContent = false;
            window.location.href = window.location.origin;
            this.store.dispatch(new LoaderActions.StopLoaderAction());
            return;
        }
        this.showContent = true;
        this.fullPay = false;
        this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((lead: Lead) => {
                this.lead = lead;
                if (lead && lead.quote && lead.quote.paymentDetails) {
                    const quote = lead.quote;
                    const paymentDeatils = quote.paymentDetails;
                    this.cardType = paymentDeatils.cardType;
                    this.cardHolder = paymentDeatils.name;
                    this.cardNumber = paymentDeatils.cardNumber;
                    const selectedPaymentPlan = quote.selectedPaymentPlan;
                    if (selectedPaymentPlan === 'pp:01') {
                        this.fullPay = true;
                        this.price = quote.fullPremium.toString();
                    } else {
                        this.fullPay = false;
                        if (quote.paymentPlans) {
                            const selectedPlan = quote.paymentPlans.desktop.find(dueDate => {
                                return dueDate.planId === selectedPaymentPlan;
                            });
                            this.price = selectedPlan.dueToday.replace('$', '');
                            this.nextPaymentDueDate = selectedPlan.paymentSchedule[1].key;
                        }
                    }
                }
            });
    }

    ngOnInit() {
        this.navService.upDateMarketingData();
        this.service.getPosition().then(
            pos => {
                this.latitude = pos.lat;
                this.longitude = pos.long;
                this.formattedAddress = pos.addr.formatted_address;
            },
            err => {
                this.latitude = '';
                this.longitude = '';
                this.formattedAddress = 'Location Access Denied';
            }
        );
        this.service.getIp().subscribe(
            res => {
                this.ipAddr = res.ip;
            },
            err => { }
        );
        this.agreeCheckboxControl = new FormControl(false, Validators.required);
        // if (
        //     this.nextPaymentDueDate &&
        //     this.nextPaymentDueDate.year &&
        //     this.nextPaymentDueDate.month &&
        //     this.nextPaymentDueDate.day
        // ) {
        //     const nextPaymentDate = new Date(
        //         this.nextPaymentDueDate.year,
        //         this.nextPaymentDueDate.month - 1,
        //         this.nextPaymentDueDate.day
        //     );
        if (this.nextPaymentDueDate) {
            this.nextPaymentDay = this.nextPaymentDueDate.split(' ')[1];
            this.nextPaymentMonthDate =
                this.monthsArr.indexOf(this.nextPaymentDueDate.split(' ')[0]) + 1 + '/' + this.nextPaymentDay;
            // this.nextPaymentDay = nextPaymentDate.getDate().toString();
            // this.nextPaymentMonthDate = nextPaymentDate.getMonth() + 1 + '/' + this.nextPaymentDay;
        }
    }
    onSubmit() {
        this.triggerBindPolicyService();
    }
    triggerBindPolicyService() {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        const SignatureCertificates = {
            ipAddress: this.ipAddr,
            viewedOnDateAndTime: moment().format(),
            signedOnDateAndTime: moment().format(),
            signedSource: this.getDeviceType(),
            latitude: this.latitude,
            longitude: this.longitude,
            formattedAddress: this.formattedAddress
        };
        this.lead.quote.signatureCertificates = SignatureCertificates;
        this.bindPolicyService.bindPolicy(this.lead).subscribe(
            res => {
                this.store.dispatch(new LoaderActions.StopLoaderAction());
                if (!res['error']) {
                    const quoteData = res['lead'].quote;
                    const leadID = res['lead'].leadID;
                    const premium =
                        quoteData.selectedPaymentPlan === 'pp:02' ? quoteData.monthlyPremium : quoteData.fullPremium;
                    this.navService.policyNumber = quoteData.policyNumber;
                    this.store.dispatch(new PostLeadSuccessAction(res));
                    this.markTransactionComplete(premium, leadID);
                    this.navService.navigate();
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
    markTransactionComplete(premium, leadID) {
        window['conciergeReady'].then(() => {
            window['GoMoxie'].conciergeV2.transactionComplete({
                transactionTotal: premium,
                currentCartValue: premium,
                vendorTxnId: leadID
            });
        });
    }
    handleErrorScenario() {
        this.navService.gotoRouteByName('paymentfail');
    }
    public getDeviceType() {
        let signedSource;
        if (this.deviceService.isDesktop()) {
            signedSource = 'Desktop';
        } else if (this.deviceService.isTablet()) {
            signedSource = 'Tablet';
        } else if (this.deviceService.isMobile()) {
            signedSource = 'Mobile';
        } else {
            signedSource = '';
        }
        return signedSource;
    }
    ngOnDestroy() {
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
