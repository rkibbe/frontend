import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { UpdateDriver } from '@app/store/actions/lead.actions';
import { Driver, Lead } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { SpouseDPAlertModalComponent } from '@shared/spouse-dp-alert-modal/spouse-dp-alert-modal.component';
import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { NavigationService } from './navigation.service';

@Injectable()
export class PniRelationshipService implements OnDestroy {
    private readonly CURR_ROUTE = 'relationship';

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

    leadData: Lead;
    constructor(private store: Store<any>, private navService: NavigationService,
        route: ActivatedRoute, private dialog: MatDialog) {
        this.navService.registerBackHandler(this.back.bind(this), this.ngDestroy$);
        this.store
            .select(fromStore.leadSelector)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(lead => {
                this.leadData = lead;
                this.drivers = (this.leadData && this.leadData.quickQuote.drivers &&
                    this.leadData.quickQuote.drivers.filter(d => !d.isPNI && d.isIncluded)) || [];
                if (!this.hasSubToParams) {
                    this.hasSubToParams = true;
                    route.params.pipe(takeUntil(this.ngDestroy$)).subscribe(this.onUrlParamsChange.bind(this));
                }
            });
    }
    public continue(relationship: Partial<Driver>): void {
        this.updateRelationship(relationship);

        const nextDriver = this.getNextDriver(1);
        if (nextDriver) {
            this.navService.gotoRouteByName(`${this.CURR_ROUTE}/${nextDriver.driverID}`);
        } else {
            this.saveLeadAndNavigateNext();
        }
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

    private updateRelationship(relationship: Partial<Driver>) {
        this.store.dispatch(new UpdateDriver({ driverID: this.currentDriverID, ...relationship }));
    }

    private saveLeadAndNavigateNext(nextRoute?: string): void {
        if (this.leadData && (this.leadData.maritalStatusCode === 'M' || this.leadData.maritalStatusCode === 'C')) {
            const relationCode = this.leadData.maritalStatusCode === 'M' ? 'SP' : 'DPExt';
            if (this.getNonPNIDriverRelationship(relationCode).length) {
                if (this.getNonPNIDriversWithSPOrDPRelationship().length > 1) {
                    this.dialog.open(SpouseDPAlertModalComponent, {
                        data: 'MORETHANONESAMERELATIONSHIP',
                        panelClass: 'spouse-dp-alert'
                    });
                } else {
                    this.navService.currentRouteObj.preFill = true;
                    this.navService.navigate();
                }
            } else {
                this.dialog.open(SpouseDPAlertModalComponent, {
                    data: this.leadData.maritalStatusCode,
                    panelClass: 'spouse-dp-alert'
                });
            }
        } else {
            this.navService.currentRouteObj.preFill = true;
            this.navService.navigate();
        }
    }
    private getNonPNIDriversWithSPOrDPRelationship() {
        return this.drivers.filter(driver =>
            driver.relationshipCode === 'SP' || driver.relationshipCode === 'DPExt');
    }
    private getNonPNIDriverRelationship(relationship) {
        return this.drivers.filter(driver =>
            driver.relationshipCode === relationship);
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
