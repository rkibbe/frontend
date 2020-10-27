import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationService } from '@services/navigation.service';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take, skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Driver, Vehicle } from '@app/store/models/lead.model';
import {
    DISABLE_BACK_BUTTON_FULL_QUOTE_WITH_ADDL_DRIVERS,
    DISABLE_BACK_BUTTON_FULL_QUOTE_NO_ADDL_DRIVERS,
    DISABLE_BACK_BUTTON_LEAD_GEN
} from '../../core/constants';
import { PageLeavingAlertModalComponent } from '../page-leaving-alert-modal/page-leaving-alert-modal.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'verti-back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnChanges, OnDestroy {
    @Input('currentRouteIndex') currentRouteIndex: string;
    @Input('flow') flow: string;
    renderBackButton: boolean;
    includedDriversSub: Subscription;
    includedDrivers: Driver[];
    includedVehicles: Vehicle[];
    includedVehiclesSub: Subscription;
    currentRoute: string;
    constructor(private navService: NavigationService, private store: Store<any>,
        private location: Location, private dialog: MatDialog) {
        this.renderBackButton = true;
        this.includedDriversSub = this.store.select(fromStore.includedDrivers).subscribe(drivers => {
            this.includedDrivers = drivers;
        });
        this.includedVehiclesSub = this.store.select(fromStore.includedVehicles).subscribe(vehicles => {
            this.includedVehicles = vehicles;
        });
    }

    ngOnChanges(changes) {
        // this.renderBackButton = changes.currentRouteIndex.currentValue;
        this.currentRouteIndex = changes.currentRouteIndex.currentValue;
        this.renderBackButton = this.doBackButtonDisable();
    }
    doBackButtonDisable() {
        if (this.navService.currentRouteObj) {
            this.currentRoute = this.navService.currentRouteObj.routeName;
        } else {
            this.currentRoute = 'NON_DYNAMIC_ROUTE';
        }
        // const nonPniDrivers = this.includedDrivers.filter(driver => !driver.isPNI && driver.isIncluded);
        if (!this.flow || this.flow === 'organic' || this.flow === 'recover') {
            if (!this.currentRouteIndex) {
                return true;
            } else {
                return DISABLE_BACK_BUTTON_FULL_QUOTE_NO_ADDL_DRIVERS.includes(this.currentRoute);
            }
        }
        return DISABLE_BACK_BUTTON_LEAD_GEN.includes(this.currentRoute);
    }
    goBack() {
        if (this.currentRoute === 'NON_DYNAMIC_ROUTE') {
            this.location.back();
        } else {
            this.navService.navigateBack();
        }
    }

    ngOnDestroy() {
        if (this.includedDriversSub) {
            this.includedDriversSub.unsubscribe();
        }
    }
}
