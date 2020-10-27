import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as LeadActions from '@app/store/actions/lead.actions';
import { MarketingData } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { AppSettings } from '@shared/settings/app-settings';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { VERTI_CONTACT_NUMBERS } from '../../core/constants';
@Component({
    selector: 'verti-vehicle-summary',
    templateUrl: './vehicle-summary.component.html',
    styleUrls: ['./vehicle-summary.component.scss']
})
export class VehicleSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
    imgSource: string;
    title: string;
    vehicleData: any;
    numberOfVehicles: number;
    showAtleastMsg: boolean;
    vehicleObservable$: any;
    maxVehicles: boolean;
    maxVehicleLimit: boolean;
    disabledNextBtn: boolean;
    leadSub: Subscription;
    loaderStopped: boolean;
    loaderSubscription: any;
    leadID: string;
    leadIdSubscription: Subscription;
    vehicleCount$: Subscription;
    includedVehicles$: Subscription;
    appSettings: AppSettings;
    marketingData: MarketingData;
    marketingData$: Subscription;
    contactNumber: string;
    private ngDestroy$ = new Subject();
    constructor(
        private store: Store<any>,
        private navService: NavigationService,
        private dataLayerService: DataLayerService,
        private appSettingService: AppSettingsService
    ) {
        this.imgSource = './assets/img/Icon_AddVehicle.svg';
        this.title = 'Vehicle Summary';
        this.numberOfVehicles = 0;
        this.store.dispatch(new LeadActions.DeleteIncompleteVehicle());
        this.showAtleastMsg = false;
        this.maxVehicleLimit = false;
        this.disabledNextBtn = false;
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
        this.marketingData$ = this.store
            .select(fromStore.marketingData)
            .pipe(take(1))
            .subscribe(marketingData => {
                if (marketingData) {
                    this.marketingData = marketingData;
                }
            });
    }

    ngOnInit() {
        this.vehicleCount$ = this.store
            .select(fromStore.vehicleCount)
            .pipe(distinctUntilChanged())
            .subscribe(vehicleCount => {
                if (vehicleCount) {
                    this.numberOfVehicles = vehicleCount;
                }
            });
        this.includedVehicles$ = this.store.select(fromStore.includedVehicles).subscribe(count => {
            if (count.length < 1) {
                this.disabledNextBtn = true;
            } else {
                this.disabledNextBtn = false;
            }
            if (count.length >= 4) {
                this.maxVehicleLimit = true;
            } else {
                this.maxVehicleLimit = false;
            }
        });

        this.addIconExisted();
        this.leadIdSubscription = this.store
            .select(fromStore.leadID)
            .pipe(take(1))
            .subscribe(leadID => (this.leadID = leadID));
        this.navService.upDateMarketingData();
        this.contactNumber = VERTI_CONTACT_NUMBERS.DEFAULT;
    }
    addIconExisted() {
        this.vehicleObservable$ = this.store
            .select(fromStore.vehicles)
            .pipe(distinctUntilChanged())
            .subscribe(vehicles => {
                if (vehicles && vehicles.length) {
                    this.filterVehicles(vehicles);
                }
            });
    }
    ngAfterViewInit() { }
    filterVehicles(vehicles) {
        this.vehicleData = vehicles.filter(vehicle => {
            if (vehicle.isVisible) {
                if (this.marketingData && /Fusion/gi.test(this.marketingData.leadSource)) {
                    if (
                        vehicle['year'] > '1980' &&
                        vehicle['model'] &&
                        vehicle['make'] &&
                        vehicle['vinPrefix'] &&
                        vehicle['vinPrefix'].length >= 17
                    ) {
                        this.showAtleastMsg = true;
                        vehicle['iconExisted'] = this.checkBodyStyleCode(vehicle.bodyStyleCode);
                        return vehicle;
                    }
                } else {
                    this.showAtleastMsg = true;
                    vehicle['iconExisted'] = this.checkBodyStyleCode(vehicle.bodyStyleCode);
                    return vehicle;
                }
            }
        });
    }
    checkBodyStyleCode(bodyStyleCode) {
        if (bodyStyleCode) {
            return this.appSettings.VEHICLE_BODY_STYLES.includes(bodyStyleCode.trim());
        }
    }

    saveToDataLayer() {
        const includedVehciles = this.vehicleData.filter(v => v.isIncluded);
        const firstIncludedVehicle = includedVehciles[0];
        this.dataLayerService.pushToDataLayer({
            make: firstIncludedVehicle.make,
            model: firstIncludedVehicle.model,
            multi_product: includedVehciles.length > 1 ? 'yes' : 'no'
        });
    }
    saveDetails() {
        this.loaderStopped = false;
        this.saveToDataLayer();
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }
    addThisVehicle(vehicleData) {
        if (vehicleData.isAlreadyIncluded) {
            let vehicle = {};
            vehicle = {
                vehicleID: vehicleData.vehicleID,
                isIncluded: true,
                isQuoteVehicle: true
            };
            this.store.dispatch(new LeadActions.UpdateVehicle(vehicle));
        } else {
            this.navService.navigateToSubRoute(vehicleData.vehicleID);
        }
    }
    addNewVehicle() {
        const vehicle = {
            vehicleID: this.leadID + '-' + (this.numberOfVehicles + 1).toString(),
            isIncluded: false,
            isADPF: false,
            isQuoteVehicle: false,
            isAlreadyIncluded: false
        };
        this.store.dispatch(new LeadActions.AddVehicle(vehicle));
        this.navService.navigateToSubRoute(vehicle.vehicleID);
    }
    edit(vehicleID, e?) {
        if (e) {
            e.stopPropagation();
        }
        this.navService.navigateToSubRoute(vehicleID);
    }
    remove(vehicleID) {
        let vehicle = {};
        vehicle = {
            vehicleID: vehicleID,
            isIncluded: false,
            isQuoteVehicle: false
        };
        this.store.dispatch(new LeadActions.UpdateVehicle(vehicle));
    }
    splitPublicId(id) {
        id = id.split(':');
        return id[1].trim();
    }
    ngOnDestroy() {
        if (this.vehicleObservable$) {
            this.vehicleObservable$.unsubscribe();
        }
        this.ngDestroy$.next();
        if (this.vehicleCount$) {
            this.vehicleCount$.unsubscribe();
        }
        if (this.includedVehicles$) {
            this.includedVehicles$.unsubscribe();
        }
        if (this.leadIdSubscription) {
            this.leadIdSubscription.unsubscribe();
        }
    }

    isClickable(vehicle) {
        return vehicle.isIncluded || !this.maxVehicleLimit;
    }

    handleClick(vehicle) {
        if (vehicle.stubbedVIN === undefined || !vehicle.stubbedVIN) {
            this.edit(vehicle.vehicleID);
        } else {
            if (vehicle.isIncluded) {
                this.remove(vehicle.vehicleID);
            } else {
                this.addThisVehicle(vehicle);
            }
        }
    }
}
