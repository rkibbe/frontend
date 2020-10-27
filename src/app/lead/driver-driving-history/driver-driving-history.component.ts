import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged, } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';
import { Driver } from '@app/store/models/lead.model';
@Component({
    selector: 'verti-driver-driving-history',
    templateUrl: './driver-driving-history.component.html',
    styleUrls: ['./driver-driving-history.component.scss']
})
export class DriverDrivingHistoryComponent implements OnInit, OnDestroy {
    @HostBinding('class.verti-driver-driving-history') mainClass = true;

    driverMinorViolation: FormGroup;
    data;
    allViolationsList;
    koTitle: string;
    koListTitle: string;
    koList: string[];
    driverMinorViolation$: Subscription;
    driverId: string;
    firstName = '';
    leadSub: Subscription;
    loaderSubscription: Subscription;
    errorSubscription: Subscription;
    errorOccured: any;
    loaderStopped: any;
    count: number;
    isQuoteFinalized: boolean;
    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private dataLayerService: DataLayerService
    ) {
        this.isQuoteFinalized = false;
    }

    ngOnInit() {
        this.driverMinorViolation = this.fb.group({
            noOfMovingViolations: ['none', Validators.required],
            noOfAtFaultAccidents: ['none', Validators.required],
            noOfNotAtFaultAccidents: ['none', Validators.required],
            noOfComprehensiveClaims: ['none', Validators.required]
        });
        this.store
            .select(fromStore.leadSelector)
            .pipe(distinctUntilChanged())
            .subscribe(leadData => {
                if (leadData && leadData.quote) {
                    this.isQuoteFinalized = leadData.quote.isQuoteFinalized || false;
                }
            });
        this.activatedRoute.paramMap.subscribe(params => {
            this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
                const selectedDriver = drivers[0];
                if (selectedDriver) {
                    this.driverId = selectedDriver['driverID'];
                    this.firstName = selectedDriver.firstName;
                    this.allViolationsList = [
                        {
                            formControl: 'noOfMovingViolations',
                            subtitle: 'How many moving violations has ' + this.firstName + ' had?',
                            listTitle: 'Common examples are:',
                            list: [
                                'Speeding',
                                'Running a red light/stop sign',
                                'Defective vehicle equipment',
                                'Improper passing',
                                'Failure to yield right of way',
                                'Following too close/tailgating',
                                'Driving on the wrong side of the road',
                                'Careless driving'
                            ]
                        },
                        {
                            formControl: 'noOfAtFaultAccidents',
                            subtitle: 'How many AT FAULT accidents has ' + this.firstName + ' been involved in?'
                        },
                        {
                            formControl: 'noOfNotAtFaultAccidents',
                            subtitle: 'How many NOT AT FAULT accidents has ' + this.firstName + ' been involved in?'
                        },
                        {
                            formControl: 'noOfComprehensiveClaims',
                            subtitle: 'How many comprehensive claims has ' + this.firstName + ' made?',
                            listTitle: 'Common examples are:',
                            list: [
                                'Glass repair or replacement',
                                'Collision with a bird or animal',
                                'Vandalism',
                                'Theft',
                                'Falling Objects (trees/hail)'
                            ]
                        }
                    ];
                    if (selectedDriver.noOfAccidentsAndViolations) {
                        this.driverMinorViolation.patchValue(selectedDriver.noOfAccidentsAndViolations);
                    }
                }
            });
        });
        this.navService.upDateMarketingData();
        // this.dataLayerService.pushStepTotal(this.navService.currentRoute.split('/')[0]);
    }

    saveDetails() {
        const driverObj = {} as Driver;
        if (this.navService.isLastVisibleChildRoute()) {
            driverObj.isIncluded = true;
            driverObj.isAlreadyIncluded = true;
            driverObj.isVisible = true;
        }
        driverObj.driverID = this.driverId;
        driverObj.noOfAccidentsAndViolations = this.driverMinorViolation.value;
        this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
        this.navService.navigateSubRouteToSubRoute();
    }

    ngOnDestroy() {
        if (this.driverMinorViolation$) {
            this.driverMinorViolation$.unsubscribe();
        }
    }
}
