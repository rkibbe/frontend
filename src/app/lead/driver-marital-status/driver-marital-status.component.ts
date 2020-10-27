import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Subscription, zip } from 'rxjs';
import { NavigationService } from '@services/navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take, skip } from 'rxjs/operators';
import { ErrorDialogModalComponent } from '@shared/error-dialog-modal/error-dialog-modal.component';
import { MatDialog } from '@angular/material';
import { DataLayerService } from '@services/data-layer.service';
import { TypeListService } from '@services/type-list.service';
import * as LoaderActions from '@app/store/actions/loader.actions';
import * as ErrorActions from '@app/store/actions/error.actions';
@Component({
    selector: 'verti-driver-marital-status',
    templateUrl: './driver-marital-status.component.html'
})
export class DriverMaritalStatusComponent implements OnInit, OnDestroy {
    driverMaritalStatusForm: FormGroup;
    driverMaritalStatusForm$: Subscription;
    imgSource: string;
    title: string;
    driverId: string;
    errorSubscription: Subscription;
    errorOccured: any;
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;
    count: number;
    driverObj: any;
    options;
    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private navService: NavigationService,
        private dataLayerService: DataLayerService,
        private typeListService: TypeListService,
    ) {
        this.imgSource = './assets/img/Icon_MaritalStatus.svg';
    }

    ngOnInit() {
        this.driverMaritalStatusForm = this.fb.group({
            maritalStatusCode: ['', Validators.compose([Validators.required])]
        });

        // this.activatedRoute.paramMap.subscribe(params => {
        //     this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
        //         const selectedDriver = drivers[0];
        //         if (selectedDriver) {
        //             this.driverId = selectedDriver['driverID'];
        //             this.title = `What's ${selectedDriver.firstName}'s marital status?`;
        //             this.driverMaritalStatusForm.patchValue(selectedDriver);
        //         }
        //     });
        // });
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        this.activatedRoute.paramMap.subscribe(params => {
            zip(this.store.select(fromStore.selectedDriver(params.get('id'))), this.typeListService
                .getMaritalStatusOptions()).pipe(take(1)).subscribe(([drivers, options]) => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    const selectedDriver = drivers[0];
                    if (selectedDriver) {
                        this.driverId = selectedDriver['driverID'];
                        this.title = `What's ${selectedDriver.firstName}'s marital status?`;
                        this.driverMaritalStatusForm.patchValue(selectedDriver);
                    }
                    this.options = options;
                    this.setDetails({ selected: { maritalStatusCode: selectedDriver.maritalStatusCode || '' } });
                },
                    (_err) => {
                        const customError = {
                            code: 600,
                            message: 'Service Failure/down'
                        };
                        this.store.dispatch(new ErrorActions.SetErrorAction(customError));
                        this.store.dispatch(new LoaderActions.StopLoaderAction());
                        this.navService.gotoRouteByName('systemfailure');
                    });
        });
        this.navService.upDateMarketingData();
    }

    setDetails(maritalObj) {
        this.driverObj = maritalObj.selected;
        this.driverObj.driverID = this.driverId;
        if (this.navService.isLastVisibleChildRoute()) {
            this.driverObj.isIncluded = true;
            this.driverObj.isAlreadyIncluded = true;
            this.driverObj.isVisible = true;
        }
        this.driverObj.maritalStatusValue = this.getMaritalStatusValue(maritalObj);
    }
    saveAndNavigate() {
        this.store.dispatch(new LeadActions.UpdateDriver(this.driverObj));
        this.navService.navigateSubRouteToSubRoute();
    }
    getMaritalStatusValue(data) {
        if (data && this.options) {
            const maritalStatusArr = this.options.filter(item => item.code.trim() === data.selected.maritalStatusCode.trim());
            return maritalStatusArr && maritalStatusArr.length ? maritalStatusArr[0].name : '';
        }
        return '';
    }
    navigateToNextPage() {
        this.count = 0;
        this.errorSubscription = this.store
            .select(state => state.error)
            .pipe(skip(1))
            .subscribe(error => {
                if (!this.errorOccured) {
                    this.count++;
                    this.errorOccured = true;
                    if (error.code === '') {
                        // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
                    } else {
                        this.dialog.open(ErrorDialogModalComponent, { data: error });
                    }
                }
            });
        setTimeout(() => {
            if (this.count === 0) {
                this.router.navigate(['drivermajorviolation/' + this.driverId], { queryParamsHandling: 'merge' });
            }
        });
    }
    ngOnDestroy() {
        if (this.driverMaritalStatusForm$) {
            this.driverMaritalStatusForm$.unsubscribe();
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
