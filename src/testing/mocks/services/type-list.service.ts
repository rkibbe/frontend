import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
    LicenseTypelistOptions,
    TypeListOption,
    TypeListOptions,
    TypeListService
} from '../../../app/core/services/type-list.service';

@Injectable()
export class MockTypeListService extends TypeListService {
    private typeListOptions: TypeListOption[] | TypeListOptions = [];

    private shouldThrowError = false;
    private error: Error = new Error('This is a test error');

    public setShouldThrowError(shouldThrowError: boolean, error?: Error): void {
        this.shouldThrowError = shouldThrowError;
        if (typeof error !== 'undefined') {
            this.setThrownError(error);
        }
    }

    public setThrownError(error: Error): void {
        this.error = error;
    }

    public setTypeListOptions(typeListOptions: TypeListOption[] | TypeListOptions) {
        this.typeListOptions = typeListOptions;
    }

    public getMaritalStatusOptions(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }
    public getAntiTheftOptions(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }

    public getLicenseTypelistOptions(): Observable<LicenseTypelistOptions> {
        return this.getCommon<LicenseTypelistOptions>();
    }

    public getRelationshipOptions(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }

    public getDiscountTypes(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }

    public getYearsInsuredExtOptions(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }
    public getPriorPolicyLimitsExtOptions(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }
    public getLastActiveInsuranceExtOptions(): Observable<TypeListOption[]> {
        return this.getCommon<TypeListOption[]>();
    }

    private getCommon<T extends TypeListOption[] | TypeListOptions>(): Observable<T> {
        return this.shouldThrowError ? throwError(this.error) : (of(this.typeListOptions) as Observable<T>);
    }
}

export function provideMockTypeListService() {
    return {
        provide: TypeListService,
        useClass: MockTypeListService
    };
}

export function getTypeListOption(typeList: TypeListOption[], code: string): TypeListOption {
    return typeList.find(type => type.code === code);
}
