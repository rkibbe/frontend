import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NavigationService } from '@app/core/services/navigation.service';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { skip } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ErrorDialogModalComponent } from '@app/shared/error-dialog-modal/error-dialog-modal.component';
import { MatDialog } from '@angular/material';
import { dateValidator } from '@shared/validators/date-validator';
import { DateFormatter } from '@shared/formatters/date-formatter';
import { DataLayerService } from '@app/core/services/data-layer.service';

@Component({
    selector: 'verti-add-driver',
    templateUrl: './add-driver.component.html'
})
export class AddDriverComponent implements OnInit, OnDestroy {
    public addDriverForm: FormGroup;
    imgSource: string;
    title: string;
    addDriverForm$: Subscription;
    dobInvalid: boolean;
    selectedDriverObj: Object;
    driverId: string;
    genderOptions: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private store: Store<any>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private dateFormatter: DateFormatter,
        private dataLayerService: DataLayerService
    ) {
        this.imgSource = './assets/img/Icon_Add_Driver.svg';
        this.title = 'Add a driver to your policy.';
        this.genderOptions = [{ code: 'M', value: 'Male' }, { code: 'F', value: 'Female' }];
    }

    ngOnInit() {
        this.addDriverForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            DOB: ['', Validators.compose([Validators.required, dateValidator(this.dateFormatter)])],
            genderCode: ['', Validators.required],
            age: [{ value: '', disabled: true }, Validators.required]
        });

        this.activatedRoute.paramMap.subscribe(params => {
            this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
                const selectedDriver = drivers[0];
                if (selectedDriver) {
                    this.driverId = selectedDriver['driverID'];
                    this.selectedDriverObj = selectedDriver;
                    const dateOfBirth = selectedDriver.dateOfBirth;
                    this.addDriverForm.patchValue(selectedDriver);
                    if (selectedDriver.genderCode) {
                        this.addDriverForm.controls.genderCode.patchValue(selectedDriver.genderCode);
                    }
                    if (selectedDriver.isADPF && selectedDriver.age) {
                        this.addDriverForm.removeControl('DOB');
                        this.addDriverForm.updateValueAndValidity();
                    } else {
                        if (dateOfBirth && dateOfBirth.month && dateOfBirth.day && dateOfBirth.year) {
                            const dobMonth = dateOfBirth.month < 10 ? '0' + dateOfBirth.month : dateOfBirth.month;
                            const dobDay = dateOfBirth.day < 10 ? '0' + dateOfBirth.day : dateOfBirth.day;
                            const dobString = dobMonth + '/' + dobDay + '/' + dateOfBirth.year;
                            this.addDriverForm.controls.DOB.patchValue(dobString);
                        } else {
                            if (dateOfBirth) {
                                const dobStamp: any = dateOfBirth;
                                const dobStampArr = dobStamp.split('T');
                                const dob = dobStampArr[0].split('-');
                                const dobMon = +dob[1];
                                const dobD = +dob[2];
                                const dobYear = +dob[0];
                                const dobMonth = dobMon < 10 ? '0' + dobMon : dobMon;
                                const dobDay = dobD < 10 ? '0' + dobD : dobD;
                                const dobString = dobMonth + '/' + dobDay + '/' + dobYear;
                                this.addDriverForm.controls.DOB.patchValue(dobString);
                            }
                        }
                        this.addDriverForm.removeControl('age');
                        this.addDriverForm.updateValueAndValidity();
                    }
                }
            });
        });
        this.navService.upDateMarketingData();
    }

    saveDetails(newValue) {
        const driverObj = newValue;
        if (this.navService.isLastVisibleChildRoute()) {
            driverObj.isIncluded = true;
            driverObj.isAlreadyIncluded = true;
            driverObj.isVisible = true;
        }
        driverObj['driverID'] = this.driverId;
        if (!this.selectedDriverObj['isADPF']) {
            const dob = driverObj.DOB.split('/');
            const dateOfBirth = {
                year: +dob[2],
                month: +dob[0],
                day: +dob[1]
            };
            delete driverObj.DOB;
            driverObj['dateOfBirth'] = dateOfBirth;
            driverObj['age'] = this.calcAge(driverObj);
        } else if (this.selectedDriverObj['isADPF'] && !this.selectedDriverObj['age']) {
            const dob = driverObj.DOB.split('/');
            const dateOfBirth = {
                year: +dob[2],
                month: +dob[0],
                day: +dob[1]
            };
            delete driverObj.DOB;
            driverObj['dateOfBirth'] = dateOfBirth;
            driverObj['age'] = this.calcAge(driverObj);
            driverObj['dateOfBirth'] = {
                year: +dob[2],
                month: +dob[0],
                day: +dob[1]
            };
        }
        driverObj.genderValue = this.getGenderValueByCode(newValue.genderCode);
        this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
        this.navService.navigateSubRouteToSubRoute();
    }
    calcAge(obj) {
        if (obj.age) {
            return obj.age;
        } else if (obj.dateOfBirth) {
            const dateOfBirth: any = obj.dateOfBirth.year + '-' + obj.dateOfBirth.month + '-' + obj.dateOfBirth.day;
            const dob: any = new Date(dateOfBirth);
            const ageDiff = Math.abs(Date.now() - dob);
            return Math.floor(ageDiff / (1000 * 3600 * 24) / 365);
        }
    }
    getGenderValueByCode(genderCode) {
        return this.genderOptions.filter(item => item.code === genderCode)[0].value;
    }
    ngOnDestroy() {
        if (this.addDriverForm$) {
            this.addDriverForm$.unsubscribe();
        }
    }
}
