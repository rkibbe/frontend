import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationService } from '@app/core/services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/reducers';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { take } from 'rxjs/operators';
import * as LeadActions from '@app/store/actions/lead.actions';
import { Vehicle } from '@app/store/models/lead.model';
import { TypeListService } from '@app/core/services/type-list.service';

@Component({
    selector: 'verti-vehicle-additional-info',
    templateUrl: './vehicle-additional-info.component.html',
    styleUrls: ['./vehicle-additional-info.component.scss']
})
export class VehicleAdditionalInfoComponent implements OnInit {
    public form: FormGroup;
    private vehicleId: string;

    options;

    constructor(
        private store: Store<AppState>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private typeListService: TypeListService
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            mileage: new FormControl(null, Validators.required),
            antitheft: new FormControl(null, Validators.required),
            isRideshare: new FormControl(null, Validators.required),
            isSoleIncome: new FormControl(null)
        });
        this.typeListService.getAntiTheftOptions().subscribe(options => {
            this.options = options;
        });
        this.activatedRoute.paramMap.subscribe(params => {
            this.store
                .select(fromStore.selectedVehicle(params.get('id')))
                .pipe(take(1))
                .subscribe(vehicles => {
                    const selectedVehicle = vehicles[0];
                    if (selectedVehicle) {
                        this.vehicleId = selectedVehicle.vehicleID;
                        this.form.patchValue(selectedVehicle);
                    }
                });
        });
    }
    saveDetails() {
        console.log('form >>>>>>>>>>>>>>> details', this.form.value);

        const controls = this.form.controls;
        console.log('vehicleId >>>>>>>>>>>>>', controls);

        const vehicleObj: Vehicle = {
            mileage: +controls.mileage.value,
            antitheft: controls.antitheft.value,
            isRideshare: controls.isRideshare.value,
            isSoleIncome: controls.isSoleIncome.value,
            vehicleID: this.vehicleId
        } as Vehicle;
        if (this.navService.isLastVisibleChildRoute()) {
            vehicleObj.isIncluded = true;
            vehicleObj.isAlreadyIncluded = true;
            vehicleObj.isVisible = true;
        }
        console.log('form >>>>>>>>>>>>>>> vehicleObj', vehicleObj);

        this.store.dispatch(new LeadActions.UpdateVehicle(vehicleObj));
        this.navService.navigateSubRouteToSubRoute();
    }
}
