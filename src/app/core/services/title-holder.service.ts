import { Injectable, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { UpdateVehicle } from '@app/store/actions/lead.actions';
import { AdditionalInterest, TitleHolder, Vehicle } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { NavigationService } from './navigation.service';

interface TitleHolderUpdateObj {
    titleHolder: TitleHolder;
    leaseOrRent: boolean;
    owned: boolean;
    additionalInterests: AdditionalInterest[];
}

@Injectable({
    providedIn: 'root'
})
export class TitleHolderService implements OnDestroy {
    readonly CURR_ROUTE_SELECT = 'titleholder-select';
    readonly CURR_ROUTE_CONTACT = 'titleholder-contact';
    readonly ROUTES = [this.CURR_ROUTE_SELECT, this.CURR_ROUTE_CONTACT];

    private vehicles: Vehicle[] = [];

    private currentVehicleID: string;
    private currentTitleHolder: TitleHolder;

    private vehicleSubject: Subject<Vehicle> = new Subject<Vehicle>();
    public get vehicleObservable(): Observable<Vehicle> {
        const currentVehicle = this.getCurrentVehicle();
        let obs = this.vehicleSubject.asObservable();
        if (currentVehicle) {
            obs = obs.pipe(startWith(currentVehicle));
        }

        return obs.pipe(takeUntil(this.ngDestroy$));
    }

    private hasSubToParams = false;
    private onContactPage = false;

    private backHandlerId = '';

    private ngDestroy$ = new Subject();

    constructor(private store: Store<any>, private navService: NavigationService, router: Router) {
        this.navService.registerBackHandler(this.back.bind(this), this.ngDestroy$);
        this.store
            .select(fromStore.includedVehicles)
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe(vehicles => {
                this.vehicles = vehicles || [];
                if (!this.hasSubToParams) {
                    this.hasSubToParams = true;
                    router.events
                        .pipe(
                            filter(e => e instanceof ActivationEnd),
                            map((e: ActivationEnd) => e.snapshot.url.map(segment => segment.path)),
                            takeUntil(this.ngDestroy$)
                        )
                        .subscribe(this.onUrlChange.bind(this));
                }
            });
    }
    public continue(paramOne: TitleHolder): void {
        if (typeof paramOne === 'string') {
            this.continueTitleholder(paramOne);
        }
    }

    public back(next: Function): void {
        const nextVehicle = this.getNextVehicle(-1);
        if (nextVehicle && !this.onContactPage) {
            this.navService.gotoRouteByName(`${this.CURR_ROUTE_SELECT}/${nextVehicle.vehicleID}`);
        } else {
            next();
        }
    }

    public getCurrentTitleHolder(): TitleHolder {
        return this.currentTitleHolder;
    }

    private continueTitleholder(titleHolder: TitleHolder): void {
        this.currentTitleHolder = titleHolder;
        const update = this.getVehicleUpdateObj(titleHolder);
        this.saveAndContinue(update);
    }
    private getVehicleUpdateObj(
        titleHolder: TitleHolder,
        additionalInterest?: AdditionalInterest
    ): TitleHolderUpdateObj {
        const currentVehicle = this.getCurrentVehicle();
        return {
            titleHolder,
            leaseOrRent: this.currentTitleHolder === TitleHolder.LEASE,
            owned: titleHolder === TitleHolder.OWNED,
            additionalInterests: currentVehicle.additionalInterests ? currentVehicle.additionalInterests : []
        };
    }

    private saveAndContinue(update: TitleHolderUpdateObj) {
        this.store.dispatch(
            new UpdateVehicle({ vehicleID: this.currentVehicleID, isQuoteVehicle: true, ...update } as Vehicle)
        );
        const nextVehicle = this.getNextVehicle(1);
        if (nextVehicle) {
            this.navService.saveLeadAndNavigate(this.ngDestroy$, `${this.CURR_ROUTE_SELECT}/${nextVehicle.vehicleID}`);
        } else {
            this.navService.saveLeadAndNavigate(this.ngDestroy$);
        }
    }

    private onUrlChange(urlSegments: string[]): void {
        if (urlSegments.length === 2 && this.ROUTES.includes(urlSegments[0])) {
            const currentVehicle = this.setCurrentVehicleParameters(urlSegments);
            this.onContactPage = urlSegments[0] === this.CURR_ROUTE_CONTACT;
            this.emitCurrentVehicleOrNavigate(currentVehicle);
        } else {
            this.resetService();
        }
    }

    private setCurrentVehicleParameters(urlSegments: string[]): Vehicle {
        let currentVehicle: Vehicle;
        if (this.currentVehicleID !== urlSegments[1]) {
            this.currentVehicleID = urlSegments[1];
            currentVehicle = this.getCurrentVehicle();
            this.currentTitleHolder = (currentVehicle && currentVehicle.titleHolder) || undefined;
        } else {
            currentVehicle = this.getCurrentVehicle();
        }

        return currentVehicle;
    }

    private emitCurrentVehicleOrNavigate(currentVehicle: Vehicle): void {
        if (currentVehicle) {
            this.vehicleSubject.next(currentVehicle);
        } else {
            this.navService.navigate();
        }
    }

    private resetService(): void {
        this.navService.deregisterBackHandler(this.backHandlerId);
        this.backHandlerId = '';
        this.currentVehicleID = undefined;
        this.currentTitleHolder = undefined;
        this.onContactPage = false;
    }

    private getNextVehicle(direction: number): Vehicle {
        const vehicle = this.getCurrentVehicle();
        if (vehicle) {
            if (direction) {
                const nextVehicleIndex = this.vehicles.indexOf(vehicle) + direction;
                if (nextVehicleIndex >= 0 && nextVehicleIndex < this.vehicles.length) {
                    return this.vehicles[nextVehicleIndex];
                }

                return null;
            }

            return vehicle;
        }

        return null;
    }

    private getCurrentVehicle(): Vehicle {
        return this.vehicles.find(d => d.vehicleID === this.currentVehicleID);
    }
    ngOnDestroy(): void {
        this.vehicleSubject.complete();
        this.ngDestroy$.next();
    }
}
