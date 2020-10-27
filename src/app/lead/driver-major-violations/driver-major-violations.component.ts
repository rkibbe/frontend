import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';

@Component({
    selector: 'verti-driver-major-violations',
    templateUrl: './driver-major-violations.component.html'
})
export class DriverMajorViolationsComponent implements OnInit, OnDestroy {
    majorViolationsForm: FormGroup;
    title: string;
    violationsList: string[];
    majorViolationsForm$: Subscription;
    imgSource: string;
    eligibilityAnswers: any;
    driverId: string;
    errorSubscription: any;
    leadSub: any;
    loaderSubscription: any;
    loaderStopped: boolean;
    errorOccured: any;
    count: number;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private store: Store<any>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private dataLayerService: DataLayerService
    ) {
        // this.koTitle = 'In the last 5 years has your driver\'s license been suspended or revoked?';
        this.imgSource = './assets/img/Icon_Cop.svg';
        this.violationsList = [
            'Driving under the influence of alcohol',
            'Drag racing',
            'Fleeing or eluding police',
            'Passing stopped school bus',
            'Reckless driving',
            'Vehicle assault/felony/homicide'
        ];
    }

    ngOnInit() {
        this.majorViolationsForm = this.fb.group({
            majorViolations: ['', Validators.required]
        });
        this.activatedRoute.paramMap.subscribe(params => {
            this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
                const selectedDriver = drivers[0];
                if (selectedDriver) {
                    this.driverId = selectedDriver['driverID'];
                    this.title = `In the last 5 years, has ${
                        selectedDriver.firstName
                        } been convicted of any major violations like:`;
                    this.majorViolationsForm.patchValue(selectedDriver);
                }
            });
        });
        this.navService.upDateMarketingData();
    }
    saveDetails() {
        const driverObj = this.majorViolationsForm.value;
        driverObj.driverID = this.driverId;
        if (this.navService.isLastVisibleChildRoute()) {
            driverObj.isIncluded = true;
            driverObj.isAlreadyIncluded = true;
            driverObj.isVisible = true;
        }
        this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
        this.navService.navigateSubRouteToSubRoute();
    }
    ngOnDestroy() {
        if (this.majorViolationsForm$) {
            this.majorViolationsForm$.unsubscribe();
        }
        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
        }
        if (this.leadSub) {
            this.leadSub.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
