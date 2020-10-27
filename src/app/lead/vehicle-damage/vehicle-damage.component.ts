import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { ExistingDamageComponent } from '@shared/existing-damage/existing-damage.component';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'verti-vehicle-damage',
    templateUrl: './vehicle-damage.component.html',
    styleUrls: ['./vehicle-damage.component.scss']
})
export class VehicleDamageComponent implements OnInit, OnDestroy {
    imgSource: string;
    imgSource2: string;
    title: string;
    vehicleData: any;
    vehicleCount: number;
    maxVehicleLimit: boolean;
    slideToggleBtn: FormControl;
    vehicleObservable$: any;
    vehiclesList = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
    vehicleDamageForm: FormGroup;
    loaderStopped: boolean;
    leadSub: Subscription;
    loaderSubscription: Subscription;

    private ngDestroy$ = new Subject();

    constructor(
        private dialog: MatDialog,
        private store: Store<any>,
        private fb: FormBuilder,
        private navService: NavigationService
    ) {
        this.imgSource = './assets/img/Damage_Icon.svg';
        this.imgSource2 = './assets/img/Group_Copy.svg';
        this.title = 'Select ALL vehicles that have any existing damage.';
        this.vehicleCount = 0;
    }

    ngOnInit() {
        this.vehicleObservable$ = this.store
            .select(fromStore.includedVehicles)
            .pipe(take(1))
            .subscribe(vehicles => {
                this.vehicleData = vehicles;
                this.vehicleDamageForm = this.fb.group(
                    this.vehicleData.reduce(
                        (acc, curr) => ({
                            ...acc,
                            [curr.vehicleID]: curr.unrepairDamage === true
                        }),
                        {}
                    )
                );
            });
        this.navService.upDateMarketingData();
    }

    checkBodyStyleCode(bodyStyleCode) {
        if (bodyStyleCode) {
            return this.vehiclesList.includes(bodyStyleCode.trim());
        }
    }

    isClickable(vehicle) {
        if (this.vehicleDamageForm.get(vehicle.vehicleID)) {
            const damageValue = this.vehicleDamageForm.get(vehicle.vehicleID).value;
            this.vehicleDamageForm.controls[vehicle.vehicleID].patchValue(!damageValue);
        }
    }

    onModalOpen() {
        this.dialog.open(ExistingDamageComponent, {
            data: 'modal opened',
            panelClass: 'existing-damage-modal'
        });
    }
    onChange(event, vehicle) {
        this.vehicleDamageForm.controls[vehicle.vehicleID].patchValue(!event.checked);
    }

    saveDetails() {
        const updatedVehicles = this.vehicleData.map(vehicle => {
            const vehicleDamage = this.vehicleDamageForm.get(vehicle.vehicleID).value;
            return {
                ...vehicle,
                isQuoteVehicle: true,
                unrepairDamage: vehicleDamage
            };
        });
        this.store.dispatch(new LeadActions.UpdateAllVehicles(updatedVehicles));

        this.loaderStopped = false;
        this.navService.saveLeadAndNavigate(this.ngDestroy$);
    }
    ngOnDestroy() {
        if (this.vehicleObservable$) {
            this.vehicleObservable$.unsubscribe();
        }
        this.ngDestroy$.next();
    }
}
