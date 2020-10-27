import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as LeadActions from '@app/store/actions/lead.actions';
import * as LoaderActions from '@app/store/actions/loader.actions';
import { Vehicle } from '@app/store/models/lead.model';
import { AppState } from '@app/store/reducers';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { SplunkService } from '@services/splunk.service';
import { VehicleAddService, VehicleInfoItem, VinPrefixInfoItem } from '@services/vehicle-add-service';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';
import { EMPTY, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, finalize, map, switchMap, take, takeUntil } from 'rxjs/operators';

export interface VehicleAdd {
    code: string;
    description: string;
}

@Component({
    selector: 'verti-vehicleadd',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnDestroy {
    @HostBinding('class.verti-vehicleadd') mainClass = true;
    @ViewChild('datalists') datalists: ElementRef;

    private readonly YEAR_INDEX = 0;
    private readonly MAKE_INDEX = 1;
    private readonly MODEL_INDEX = 2;
    private readonly TRIM_INDEX = 3;

    private readonly masterLabels = ['SELECT YEAR', 'SELECT MAKE', 'SELECT MODEL', 'SELECT TRIM'];

    // private
    private leadID: string;
    private vehicleId: string;

    private isADPF: boolean;
    private isAlreadyIncluded = false;

    private saveButtonFlag = true;

    private gatheringYearInfo = false;
    private gatheringEditInfo = false;

    private yearsMasterData = [];

    private carsAdded = 0;
    private numberOfVehicles: number;
    private vehicleData: any;

    private numOfTimesErrorOccurredOnScreen: number;

    // public
    public readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    public title: string;
    public buttonTxt: string;

    public inputLabel = '';

    public maxVehicleLimit = true;
    public hideAddVehicle = false;

    public listData: VehicleInfoItem[] = [];
    public vehiclesTotal: Array<VehicleInfoItem[]> = [];
    public selectedDataIndex = 0;

    private ngDestroy$ = new Subject();

    constructor(
        private store: Store<AppState>,
        private navService: NavigationService,
        private activatedRoute: ActivatedRoute,
        private vehicleAddService: VehicleAddService,
        private dialog: MatDialog,
        private splunkService: SplunkService
    ) {
        this.title = 'Add a Vehicle';
        this.inputLabel = this.masterLabels[this.selectedDataIndex];
        this.vehiclesTotal[this.carsAdded] = [];
        this.numberOfVehicles = 0;
        this.numOfTimesErrorOccurredOnScreen = 0;
    }

    public ngOnInit(): void {
        this.getVehicleYear();
        this.activatedRoute.paramMap.subscribe(params => {
            this.store
                .select(fromStore.selectedVehicle(params.get('id')))
                .pipe(take(1))
                .subscribe(vehicles => {
                    const selectedVehicle = vehicles[0];
                    if (selectedVehicle) {
                        this.vehicleId = selectedVehicle.vehicleID;
                        this.isADPF = selectedVehicle.isADPF;
                        this.vehicleData = selectedVehicle;
                        this.title = 'Add a vehicle';
                        this.buttonTxt = 'NEXT';
                        if (
                            (selectedVehicle.isIncluded && !this.isAlreadyIncluded) ||
                            ((selectedVehicle.stubbedVIN === undefined || !selectedVehicle.stubbedVIN) &&
                                (!selectedVehicle.isIncluded && (selectedVehicle.year || selectedVehicle.make)))
                        ) {
                            this.vehiclesTotal[this.carsAdded] = [];
                            this.editVehicle();
                            this.title = 'Edit vehicle';
                            this.buttonTxt = 'SAVE';
                            this.hideAddVehicle = true;
                        }
                    }
                });
        });
        this.store
            .select(fromStore.vehicleCount)
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(vehicleCount => {
                if (vehicleCount) {
                    this.numberOfVehicles = vehicleCount;
                }
            });
        this.store
            .select(fromStore.includedVehicles)
            .pipe(
                map(drivers => drivers.length >= 4),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(maxLimit => (this.maxVehicleLimit = maxLimit));
        this.store
            .select(fromStore.leadID)
            .pipe(
                take(1),
                takeUntil(this.ngDestroy$)
            )
            .subscribe(leadID => (this.leadID = leadID));
        this.navService.upDateMarketingData();
    }

    public addAnotherVehicle() {
        this.vehiclesTotal = [];
        this.saveButtonFlag = true;
        this.carsAdded += 1;
        this.vehiclesTotal[this.carsAdded] = [];
        this.selectedDataIndex = 0;
        this.listData = this.yearsMasterData;
        this.inputLabel = this.masterLabels[this.selectedDataIndex];

        const vehicle = {
            vehicleID: this.leadID + '-' + (this.numberOfVehicles + 1).toString(),
            isIncluded: false,
            isADPF: false,
            isQuoteVehicle: false
        };
        this.store.dispatch(new LeadActions.AddVehicle(vehicle));
        this.navService.gotoRouteByName('vehicleadd/' + vehicle.vehicleID);
    }

    public saveDetails() {
        this.navService.navigateSubRouteToSubRoute();
    }

    public save(cars: VehicleInfoItem): void {
        if (this.selectedDataIndex <= 4) {
            if (this.selectedDataIndex === 3) {
                this.vehiclesTotal[this.carsAdded].push(cars);
                this.updateVehicleSummary();
                this.selectedDataIndex++;
            } else {
                if (this.selectedDataIndex === -1) {
                    this.selectedDataIndex = 0;
                }
                this.getListData(cars, false);
            }
        }
    }

    public remove(vehicleAdd: VehicleAdd): void {
        const index = this.vehiclesTotal[this.carsAdded].indexOf(vehicleAdd);

        if (index >= 0) {
            this.listData = [];
            if (index < this.selectedDataIndex) {
                this.vehiclesTotal[this.carsAdded].splice(index, this.vehiclesTotal[this.carsAdded].length - index);
                this.selectedDataIndex = index;
            } else {
                this.vehiclesTotal[this.carsAdded].splice(index, 1);
            }
            this.inputLabel = this.masterLabels[this.selectedDataIndex];
            this.selectedDataIndex--;
            this.getListData(this.vehiclesTotal[this.carsAdded][index - 1], true);
        }
    }

    private startLoader(): void {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
    }

    private stopLoader(): void {
        if (!this.gatheringEditInfo && !this.gatheringYearInfo) {
            this.store.dispatch(new LoaderActions.StopLoaderAction());
        }
    }

    private getVehicleYear() {
        this.gatheringYearInfo = true;
        this.startLoader();
        this.vehicleAddService
            .getVehicleYear()
            .pipe(
                takeUntil(this.ngDestroy$),
                finalize(() => {
                    this.gatheringYearInfo = false;
                    this.stopLoader();
                })
            )
            .subscribe(
                yearList => {
                    this.listData = yearList;
                    this.yearsMasterData = yearList;
                    this.numOfTimesErrorOccurredOnScreen = 0;
                },
                error => {
                    this.handleYearServiceFailure(error);
                }
            );
    }

    private editVehicle() {
        this.gatheringEditInfo = true;
        this.startLoader();
        const year: VehicleInfoItem = {
            code: this.vehicleData.year,
            description: this.vehicleData.year
        };
        let make: VehicleInfoItem;
        let model: VehicleInfoItem;
        let trim: VehicleInfoItem;

        this.vehicleAddService
            .getVehicleMake(year.code)
            .pipe(
                switchMap(makeList => {
                    make = makeList.find(
                        m => m.description.toLocaleLowerCase() === this.vehicleData.make.toLocaleLowerCase()
                    );
                    if (make) {
                        return this.vehicleAddService.getVehicleModel(year.code, make.code);
                    } else {
                        this.vehiclesTotal[this.carsAdded] = [year];
                        return EMPTY;
                    }
                }),
                switchMap(modelList => {
                    model = modelList.find(
                        m => m.description.toLocaleLowerCase() === this.vehicleData.model.toLocaleLowerCase()
                    );
                    if (model) {
                        return this.vehicleAddService.getVehicleTrim(year.code, make.code, model.code);
                    } else {
                        this.vehiclesTotal[this.carsAdded] = [year, make];
                        return EMPTY;
                    }
                }),
                map(trimList => {
                    trim = trimList.find(
                        t => t.description.toLocaleLowerCase() === this.vehicleData.trim.toLocaleLowerCase()
                    );
                    if (trim) {
                        this.vehiclesTotal[this.carsAdded] = [year, make, model, trim];
                    } else {
                        this.vehiclesTotal[this.carsAdded] = [year, make, model];
                    }
                }),
                takeUntil(this.ngDestroy$),
                finalize(() => {
                    this.gatheringEditInfo = false;
                    if (year && make && model && trim) {
                        this.selectedDataIndex = 4;
                    } else {
                        this.selectedDataIndex = this.vehiclesTotal[this.carsAdded].length - 1;
                        this.getListData(this.vehiclesTotal[this.carsAdded][this.selectedDataIndex], true);
                    }
                    this.stopLoader();
                })
            )
            .subscribe(
                () => {
                    if (year && make && model && trim) {
                        this.vehiclesTotal[this.carsAdded] = [year, make, model, trim];
                    }
                },
                error => this.handleErrorScenarios(error)
            );
    }

    private updateVehicleSummary() {
        this.saveButtonFlag = false;
        this.isAlreadyIncluded = true;
        const vehicleObj: Vehicle = {
            vehicleID: this.vehicleId,
            // isIncluded: true,
            isADPF: false,
            // isAlreadyIncluded: true,
            isQuoteVehicle: true
            // isVisible: true
        } as Vehicle;
        if (this.navService.isLastVisibleChildRoute()) {
            vehicleObj.isIncluded = true;
            vehicleObj.isAlreadyIncluded = true;
            vehicleObj.isVisible = true;
        }

        vehicleObj.year = this.vehiclesTotal[this.carsAdded][this.YEAR_INDEX].description;
        vehicleObj.make = this.vehiclesTotal[this.carsAdded][this.MAKE_INDEX].description;
        vehicleObj.model = this.vehiclesTotal[this.carsAdded][this.MODEL_INDEX].description;
        vehicleObj.trim = this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX].description;
        vehicleObj.bodyStyleCode =
            (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).bodyStyleCode || '';
        vehicleObj.bodyStyle =
            (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).bodyStyle || '';
        vehicleObj.stubbedVIN =
            (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).stubbedVIN || '';
        vehicleObj.vinPrefix =
            (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).vinPrefix || '';
        vehicleObj.isStubbedVin =
            (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).isStubbedVin || false;
        vehicleObj.vin = (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).vin || '';
        vehicleObj.modelPattern =
            (this.vehiclesTotal[this.carsAdded][this.TRIM_INDEX] as VinPrefixInfoItem).modelPattern || '';
        this.store.dispatch(new LeadActions.UpdateVehicle(vehicleObj));
    }

    private getListData(cars: VehicleInfoItem, edit: boolean): void {
        switch (this.masterLabels[this.selectedDataIndex + 1]) {
            case 'SELECT YEAR':
                this.listData = this.yearsMasterData;
                this.scrollToTop();
                break;
            case 'SELECT MAKE':
                this.saveSelectionAndGatherNextItems(this.vehicleAddService.getVehicleMake(cars.code), cars, edit);
                break;
            case 'SELECT MODEL':
                this.saveSelectionAndGatherNextItems(
                    this.vehicleAddService.getVehicleModel(
                        this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 1].code,
                        cars.code
                    ),
                    cars,
                    edit
                );
                break;
            case 'SELECT TRIM':
                this.saveSelectionAndGatherNextItems(
                    this.vehicleAddService.getVehicleTrim(
                        this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 2].code,
                        this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 1].code,
                        cars.code
                    ),
                    cars,
                    edit
                );
                break;
            default:
                // Do nothing
                break;
        }
    }

    private handleErrorScenarios(error?) {
        if (error) {
            this.splunkService.log(error);
        }

        if (this.numOfTimesErrorOccurredOnScreen < 3) {
            this.numOfTimesErrorOccurredOnScreen++;
            this.dialog.open(TimeoutModalComponent, {
                panelClass: 'custom-timeout-modal'
            });
        } else {
            this.navService.gotoRouteByName('systemfailure');
        }
    }

    private handleYearServiceFailure(error) {
        this.splunkService.log(error);

        // if error while fetching year, navigate user to vehicle summary page
        this.dialog
            .open(TimeoutModalComponent, {
                panelClass: 'custom-timeout-modal'
            })
            .afterClosed()
            .subscribe(() => {
                this.navService.gotoRouteByName('vehiclesummary');
            });
    }

    private saveSelectionAndGatherNextItems(
        obs: Observable<VehicleInfoItem[]>,
        cars: VehicleInfoItem,
        edit: boolean
    ): void {
        this.store.dispatch(new LoaderActions.StartLoaderAction());
        obs.pipe(
            takeUntil(this.ngDestroy$),
            finalize(() => this.store.dispatch(new LoaderActions.StopLoaderAction()))
        ).subscribe(
            infoList => this.onNextInfoItemsGathered(infoList, cars, edit),
            error => this.handleErrorScenarios(error)
        );
    }

    private onNextInfoItemsGathered(newListData: VehicleInfoItem[], cars: VehicleInfoItem, edit: boolean): void {
        this.listData = [...newListData];
        this.selectedDataIndex++;
        this.inputLabel = this.masterLabels[this.selectedDataIndex];
        if (!edit) {
            this.vehiclesTotal[this.carsAdded].push(cars);
        }
        this.scrollToTop();
    }

    private scrollToTop() {
        if (this.datalists && this.datalists.nativeElement) {
            this.datalists.nativeElement.scrollTop = 0;
        }
    }

    public ngOnDestroy(): void {
        this.ngDestroy$.next();
    }
}
