import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, startWith, take, takeUntil } from 'rxjs/operators';
import { PostLeadAction, UpdateDriver, UpdateGenerateQuickQuotePriceFlag, UpdateCustomQuoteAction } from '@app/store/actions/lead.actions';
import { Driver, Lead, LicenseStatus, Vehicle, TitleHolder } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { NavigationService } from './navigation.service';

@Injectable()
export class LicenseInfoStateService implements OnDestroy {
    CURR_ROUTE = 'licenseinfoprerc';

    private drivers: Array<Driver> = [];

    private currentDriverID: string;

    private driverSubject: Subject<Driver> = new Subject<Driver>();
    public get driverObservable(): Observable<Driver> {
        const currentDriver = this.getCurrentDriver();
        let obs = this.driverSubject.asObservable();
        if (currentDriver) {
            obs = obs.pipe(startWith(currentDriver));
        }

        return obs.pipe(takeUntil(this.ngDestroy$));
    }

    private hasSubToParams = false;

    private ngDestroy$ = new Subject();
    leasedLoanVehicles: Vehicle[];
    nonAdpfIncludedVehicles: Vehicle[];
    constructor(private store: Store<any>, private navService: NavigationService, route: ActivatedRoute) {
        this.navService.registerBackHandler(this.back.bind(this), this.ngDestroy$);
        this.CURR_ROUTE = route.url['value'][0].path;
        if (this.CURR_ROUTE === 'licenseinfoprerc') {
            this.store
                .select(fromStore.includedDrivers)
                .pipe(takeUntil(this.ngDestroy$))
                .subscribe(drivers => {
                    this.drivers = drivers || [];
                    this.sortDrivers();
                    this.setcurrentDriverDetails(route);
                });
        } else {
            this.store
                .select(fromStore.includedDrivers)
                .pipe(takeUntil(this.ngDestroy$))
                .subscribe(drivers => {
                    this.drivers = drivers.filter(driver => this.shouldShowPostRc(driver));
                    this.sortDrivers();
                    this.setcurrentDriverDetails(route);
                });
            this.getIncludedVehicles();
        }
    }
    getIncludedVehicles() {
        this.store
            .select(fromStore.includedVehicles)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(vehicles => {
                this.leasedLoanVehicles = vehicles.filter(
                    vehicle => vehicle.isIncluded && [TitleHolder.LEASE, TitleHolder.LOAN].includes(vehicle.titleHolder)
                );
                this.nonAdpfIncludedVehicles = vehicles.filter(
                    vehicle => vehicle.isIncluded && !vehicle.isADPF
                );
            });
    }
    setcurrentDriverDetails(route) {
        if (!this.hasSubToParams) {
            this.hasSubToParams = true;
            route.params.pipe(takeUntil(this.ngDestroy$)).subscribe(this.onUrlParamsChange.bind(this));
        }
    }
    sortDrivers() {
        this.drivers.sort((d1, d2) => {
            if (d1.isPNI) {
                return -1;
            } else if (d2.isPNI) {
                return 1;
            } else {
                return d1.driverID.localeCompare(d2.driverID);
            }
        });
    }
    public continue(licenseInfo: Partial<Driver>): void {
        this.navService.upDateMarketingData();
        const nextDriver = this.getNextDriver(1);
        if (nextDriver) {
            this.updateBackendFlags(false);
            this.saveLeadAndNavigateNext(licenseInfo, `${this.CURR_ROUTE}/${nextDriver.driverID}`);
        } else {
            if (this.CURR_ROUTE === 'licenseinfopostrc') {
                if (this.nonAdpfIncludedVehicles.length || this.leasedLoanVehicles.length) {
                    this.updateBackendFlags(false);
                } else {
                    this.updateBackendFlags(true);
                }
            }
            this.saveLeadAndNavigateNext(licenseInfo);
        }
    }
    updateBackendFlags(value) {
        this.store.dispatch(
            new UpdateGenerateQuickQuotePriceFlag({
                rateQuote: value,
                finalizeQuote: value
            })
        );
        if (value) {
            this.store.dispatch(
                new UpdateCustomQuoteAction({
                    isQuoteCustomized: false,
                    fullQuote: true
                })
            );
        }
    }
    shouldShowPostRc(driver: Driver): boolean {
        return (
            driver.licenseStatus === LicenseStatus.ValidLicense ||
            (driver.licenseStatus === LicenseStatus.OwnInsurance && !driver.ownInsuranceApprovedExt)
        );
    }
    public back(next: Function): void {
        const nextDriver = this.getNextDriver(-1);
        if (nextDriver) {
            this.navService.gotoRouteByName(`${this.CURR_ROUTE}/${nextDriver.driverID}`);
        } else {
            next();
        }
    }

    private onUrlParamsChange(params: Params): void {
        this.currentDriverID = params.id;
        const currentDriver = this.getCurrentDriver();
        if (currentDriver) {
            this.driverSubject.next(currentDriver);
        } else {
            this.navService.navigate();
        }
    }

    private saveLeadAndNavigateNext(licenseInfo: Partial<Driver>, nextRoute?: string): void {
        this.store.dispatch(new UpdateDriver({ driverID: this.currentDriverID, isQuoteDriver: true, ...licenseInfo }));

        const leadSub = this.store
            .select(fromStore.leadSelector)
            .pipe(take(1))
            .subscribe((lead: Lead) => {
                this.store.dispatch(new PostLeadAction(lead));
            });

        this.store
            .select(state => state.loader.isLoading)
            .pipe(
                takeUntil(this.ngDestroy$),
                first(val => !val)
            )
            .subscribe(_ => {
                if (!leadSub.closed) {
                    leadSub.unsubscribe();
                }

                if (nextRoute) {
                    this.navService.gotoRouteByName(nextRoute);
                } else {
                    this.navService.currentRouteObj.preFill = true;
                    this.navService.navigate();
                }
            });
    }

    private getCurrentDriver(): Driver {
        return this.drivers.find(d => d.driverID === this.currentDriverID);
    }

    private getNextDriver(direction: number): Driver {
        const driver = this.getCurrentDriver();
        if (driver) {
            if (direction) {
                const nextDriverIndex = this.drivers.indexOf(driver) + direction;
                if (nextDriverIndex >= 0 && nextDriverIndex < this.drivers.length) {
                    return this.drivers[nextDriverIndex];
                }
                return null;
            }

            return driver;
        }

        return null;
    }

    ngOnDestroy(): void {
        this.driverSubject.complete();
        this.ngDestroy$.next();
    }
}
