import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Driver } from '@app/store/models/lead.model';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DriverIconService {
    private drivers: Driver[] = [];

    private driverToImageName: { [key: string]: string } = {};

    private readonly imageNameToUsage = {
        'male-1': 0,
        'male-2': 0,
        'male-3': 0,
        'male-4': 0,
        'female-1': 0,
        'female-2': 0,
        'female-3': 0,
        'female-4': 0,
        'undefined-1': 0,
        'undefined-2': 0
    };

    constructor(private store: Store<any>) {
        this.store
            .select(fromStore.drivers)
            .pipe(distinctUntilChanged())
            .subscribe(drivers => {
                this.updateChangedDrivers(drivers);
                this.updateImageUsage(drivers);
                this.assignNewImages(drivers);
                this.drivers = drivers;
            });
    }

    public getDriverImageName(driver: Driver, defaultVal?: string): string {
        return (
            this.driverToImageName[driver.driverID] || (typeof defaultVal === 'undefined' ? 'undefined-1' : defaultVal)
        );
    }

    private getRemovedDrivers(newDrivers: Driver[]): Driver[] {
        return this.drivers.filter(d1 => !newDrivers.some(d2 => d2.driverID === d1.driverID));
    }

    private getNewDrivers(newDrivers: Driver[]): Driver[] {
        return newDrivers.filter(d1 => !this.drivers.some(d2 => d2.driverID === d1.driverID));
    }

    private getUpdatedDrivers(newDrivers: Driver[]): Driver[] {
        return newDrivers.filter(d1 => {
            const newD = this.drivers.find(d2 => d2.driverID === d1.driverID);
            return !!(newD && newD.genderCode !== d1.genderCode);
        });
    }

    private updateChangedDrivers(newDrivers: Driver[]) {
        const updatedDrivers = this.getUpdatedDrivers(newDrivers);
        for (const driver of updatedDrivers) {
            this.imageNameToUsage[this.driverToImageName[driver.driverID]]--;

            const imgName = this.mapDriverToImage(driver);
            this.imageNameToUsage[imgName]++;
            this.driverToImageName[driver.driverID] = imgName;
        }
    }

    private updateImageUsage(drivers: Driver[]) {
        const removedDrivers = this.getRemovedDrivers(drivers);
        for (const driver of removedDrivers) {
            this.imageNameToUsage[this.driverToImageName[driver.driverID]]--;
            delete this.driverToImageName[driver.driverID];
        }
    }

    private assignNewImages(drivers: Driver[]): void {
        const newDrivers = this.getNewDrivers(drivers);
        for (const driver of newDrivers) {
            const imgName = this.mapDriverToImage(driver);
            this.imageNameToUsage[imgName]++;
            this.driverToImageName[driver.driverID] = imgName;
        }
    }

    private mapDriverToImage(driver: Driver) {
        switch (driver.genderCode) {
            case 'M':
                return this.getNextGenderImageName('male');
            case 'F':
                return this.getNextGenderImageName('female');
            default:
                return this.getNextGenderImageName('undefined');
        }
    }

    private getNextGenderImageName(gender: string): string {
        return Object.keys(this.imageNameToUsage)
            .filter(name => name.startsWith(gender))
            .sort((n1, n2) => {
                if (this.imageNameToUsage[n1] !== this.imageNameToUsage[n2]) {
                    return this.imageNameToUsage[n1] - this.imageNameToUsage[n2];
                } else {
                    return n1.localeCompare(n2);
                }
            })[0];
    }
}
