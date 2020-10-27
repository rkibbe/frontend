import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StartLoaderAction, StopLoaderAction } from '@app/store/actions/loader.actions';
import { Driver } from '@app/store/models/lead.model';
import { Store } from '@ngrx/store';
import { DriverIconService } from '@services/driver-icon.service';
import { NavigationService } from '@services/navigation.service';
import { PniRelationshipService } from '@services/pni-relationship.service';
import { TypeListOption, TypeListService } from '@services/type-list.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'verti-pni-relationship',
    providers: [PniRelationshipService],
    templateUrl: './pni-relationship.component.html',
    styleUrls: ['./pni-relationship.component.scss']
})
export class PniRelationshipComponent implements OnInit {
    form: FormGroup;

    private get relationshipControl(): FormControl {
        return this.form.get('relationship') as FormControl;
    }

    relationshipOptions: TypeListOption[];

    driver: Driver;
    driverIcon: string;

    private startedLoader = false;
    private defaultValuesSet = false;
    private typeListOptionsGathered = false;

    private ngDestroy$ = new Subject();

    constructor(
        private typeListService: TypeListService,
        private relationshipService: PniRelationshipService,
        private navService: NavigationService,
        private store: Store<any>,
        public driverIconService: DriverIconService
    ) {}

    ngOnInit() {
        this.startLoader();
        this.buildForm();
        this.getRelationshipTypes();
        this.relationshipService.driverObservable.subscribe(driver => this.resetForDriver(driver));
        this.navService.upDateMarketingData();
    }

    private startLoader(): void {
        if (!this.startedLoader) {
            this.store.dispatch(new StartLoaderAction());
            this.startedLoader = true;
        }
    }

    private stopLoader(): void {
        if (this.typeListOptionsGathered && this.defaultValuesSet) {
            this.store.dispatch(new StopLoaderAction());
            this.startedLoader = false;
        }
    }

    private buildForm(): void {
        this.form = new FormGroup({
            relationship: new FormControl(null, Validators.required)
        });
    }

    private getRelationshipTypes(): void {
        this.typeListService
            .getRelationshipOptions()
            .pipe(
                catchError(_ => {
                    this.navService.routeToSystemFailure();
                    return EMPTY;
                }),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(options => {
                this.relationshipOptions = options;
                this.typeListOptionsGathered = true;
                this.stopLoader();
            });
    }

    private resetForDriver(driver: Driver): void {
        this.startLoader();
        this.driver = driver;
        this.driverIcon = `assets/img/${this.driverIconService.getDriverImageName(driver)}.svg`;
        this.defaultValuesSet = false;

        this.form.reset();

        this.setDefaultDriverValues();
    }

    private setDefaultDriverValues() {
        if (this.driver.relationshipCode && this.navService.currentRouteObj.preFill) {
            this.relationshipControl.setValue(this.driver.relationshipCode);
        }

        this.defaultValuesSet = true;
        this.stopLoader();
    }

    public onButtonToggleClick(relationship: TypeListOption): void {
        this.relationshipService.continue({
            relationshipCode: relationship.code,
            relationshipValue: relationship.description
        });
    }
}
