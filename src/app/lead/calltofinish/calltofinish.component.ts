import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Lead } from '@app/store/models/lead.model';

@Component({
    selector: 'verti-calltofinish',
    templateUrl: './calltofinish.component.html',
    styleUrls: ['./calltofinish.component.scss']
})
export class CalltofinishComponent implements OnInit, OnDestroy, AfterViewInit {
    imgSource: string;
    title: string;
    contactForm: FormGroup;
    phoneNumber: any;
    mobileFormInvalid: boolean;
    mobileErrorMsg: boolean;

    IsChecked: boolean;
    contactForm$: Subscription;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    loaderStopped: boolean;
    isWorkingHours: boolean;
    leadData$: Subscription;
    leadData: Lead;
    premiumPrice: string;

    constructor(private store: Store<any>, private httpClient: HttpClient) {
        this.imgSource = './assets/img/Icon_contact.svg';
        this.title = 'Where can we send your quote?';
        this.mobileFormInvalid = true;
        this.mobileErrorMsg = false;
        this.IsChecked = false;
        this.isWorkingHours = false;
    }

    ngOnInit() {
        this.leadData$ = this.store
            .select(fromStore.leadSelector)
            .pipe(distinctUntilChanged())
            .subscribe((leadData: Lead) => {
                this.leadData = leadData;
            });

        this.premiumPrice = this.leadData.quickQuote.monthlyPremiumPrice || '';

        this.getUtilTime().subscribe(workHours => {
            const estDate = this.getESTTime();
            const estDay = estDate.getDay(); // 0 is sunday, in API 0 is monday
            const workingHours = workHours['workingHours'];
            if (estDay === 0) {
                const apiValue = workHours['workingDays'][6];
                if (
                    apiValue['isIncluded'] &&
                    this.compareTime(workingHours['startTime'], true) &&
                    this.compareTime(workingHours['endTime'], false)
                ) {
                    this.isWorkingHours = true;
                }
            } else {
                const apiValue = workHours['workingDays'][estDay - 1];
                if (
                    apiValue['isIncluded'] &&
                    this.compareTime(workingHours['startTime'], true) &&
                    this.compareTime(workingHours['endTime'], false)
                ) {
                    this.isWorkingHours = true;
                }
            }
        });
    }
    ngAfterViewInit() {
        window['statusDFI'].addDelioClientToForms = false;
        const idForm = document.querySelector('section > form');
        window['DFI'].addDelioClientToForms(idForm);

        // window['DFI'].addDelioClientToForms();
        if (window['DCL']) {
            window['DCL']['set'].forms();
        }
    }
    getUtilTime() {
        const url = environment.nodeserver + 'util/time';
        return this.httpClient.get(url);
    }

    getESTTime() {
        // get local time
        const d = new Date();
        // convert to msec since Jan 1 1970
        const localTime = d.getTime();
        // obtain local UTC offset and convert to msec
        const localOffset = d.getTimezoneOffset() * 60000;
        // obtain UTC time in msec
        const utc = localTime + localOffset;
        const isDstOn = this.isDstOn();
        // which is UTC + 5/4 hours is EST
        let offset = -5;
        if (isDstOn) {
            offset = -4;
        }
        const est = utc + 3600000 * offset;
        return new Date(est);
    }
    stdTimezoneOffset = function() {
        const d = new Date();
        const jan = new Date(d.getFullYear(), 0, 1);
        const jul = new Date(d.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };
    isDstOn = function() {
        const d = new Date();
        return d.getTimezoneOffset() < this.stdTimezoneOffset();
    };
    compareTime(timeToCheck: string, checkGreate: boolean) {
        const startHour = parseInt(timeToCheck.split(':')[0], 10);
        const startMinute = parseInt(timeToCheck.split(':')[1], 10);
        const startSecond = 0;

        // Create date object and set the time to that
        const startTimeObject = this.getESTTime();
        // startTimeObject.setHours(startHour, startMinute, startSecond);

        // Create date object and set the time to that
        const endTimeObject = new Date(startTimeObject);
        endTimeObject.setHours(startHour, startMinute, startSecond);

        // Now we are ready to compare both the dates
        if (checkGreate) {
            if (startTimeObject > endTimeObject) {
                return true;
            }
        } else {
            if (startTimeObject < endTimeObject) {
                return true;
            }
        }
        return false;
    }
    onBlur() {
        const phoneNum = this.contactForm.get('phoneNumber').value;
        if (phoneNum && (phoneNum.length < 12 || phoneNum.substr(0, 1) === '0' || phoneNum.substr(0, 1) === '1')) {
            this.contactForm.get('phoneNumber').setErrors({ incorrect: true });
            this.mobileErrorMsg = true;
            this.mobileFormInvalid = true;
        }
    }
    onKey(event: any) {
        const OnlyNumbers = event.target.value.replace(/[^0-9]/g, '');
        this.formatPhoneNumber('phoneNumber');
        if (this.contactForm.get('phoneNumber').value.length > 10) {
            return false;
        }
        this.contactForm.patchValue({
            phonenumber: OnlyNumbers
        });
    }

    formatPhoneNumber(field) {
        let value = this.contactForm.get(field).value;
        const numbers = value.replace(/\D/g, ''),
            char = { 3: ' ', 6: ' ' };
        value = '';
        for (let i = 0; i < numbers.length; i++) {
            value += (char[i] || '') + numbers[i];
        }
        this.contactForm.get(field).patchValue(value);
        if (
            this.contactForm.get(field).value === '' ||
            this.contactForm.get(field).value === undefined ||
            value.length < 12
        ) {
            this.mobileFormInvalid = true;
        } else {
            this.mobileFormInvalid = false;
        }
    }

    saveDetails(): void {
        const conatctValObj = this.contactForm.value;
        conatctValObj.phoneNumber = this.contactForm.get('phoneNumber').value;
    }

    ngOnDestroy() {
        if (this.contactForm$) {
            this.contactForm$.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
