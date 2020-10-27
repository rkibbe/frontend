import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VehicleAddService {
    readonly UTIL_URL = environment.nodeserver + 'util';
    readonly POLK_URL = environment.nodeserver + 'polk';

    constructor(private httpClient: HttpClient) { }

    public getVehicleYear(): Observable<VehicleInfoItem[]> {
        return this.httpClient.get<number[]>(`${this.POLK_URL}/vehicleYear`).pipe(
            retry(1),
            map(yearList => {
                if (yearList && yearList.length) {
                    // FIXME cast to 'any' is to keep consistent with legacy code that kept the value as 'number'
                    return yearList.map(year => ({
                        code: year as any,
                        description: year as any
                    }));
                }
                throw new Error(JSON.stringify(yearList));
            })
        );
    }

    public getVehicleMake(year: string): Observable<VehicleInfoItem[]> {
        return this.getVehicleInfoItems('make', this.createHttpParams(year), 'makes');
    }

    public getVehicleModel(year: string, make: string): Observable<VehicleInfoItem[]> {
        return this.getVehicleInfoItems('model', this.createHttpParams(year, make), 'models');
    }

    public getVehicleTrim(year: string, make: string, model: string): Observable<VinPrefixInfoItem[]> {
        const params = this.createHttpParams(year, make, model);
        return this.httpClient.get<VinPrefixResponse>(`${this.POLK_URL}/vinPrefix`, { params }).pipe(
            retry(1),
            map(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                return data.vinPrefixes.map(vinPrefix => ({
                    code: vinPrefix.trimDisplay,
                    description: vinPrefix.trimDisplay,
                    bodyStyleCode: vinPrefix.bodyStyleCode,
                    bodyStyle: vinPrefix.bodyStyle,
                    stubbedVIN: vinPrefix.stubbedVIN,
                    vinPrefix: vinPrefix.vinPrefix,
                    isStubbedVin: vinPrefix.isStubbedVin,
                    vin: vinPrefix.vin,
                    modelPattern: vinPrefix.modelPattern
                }));
            })
        );
    }

    private getVehicleInfoItems(endpoint: string, params: HttpParams, typeName: string): Observable<VehicleInfoItem[]> {
        return this.httpClient.get<PolkResponse>(`${this.POLK_URL}/${endpoint}`, { params }).pipe(
            retry(1),
            map(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                return data[typeName];
            })
        );
    }

    private createHttpParams(year: string, make?: string, model?: string): HttpParams {
        let params = new HttpParams();

        if (year) {
            params = params.set('year', year);
        }

        if (make) {
            params = params.set('make', make);
        }

        if (model) {
            params = params.set('model', model);
        }

        return params;
    }
}

interface PolkResponse {
    [key: string]: VehicleInfoItem[];
    error?: any;
}

interface VinPrefixResponse {
    vinPrefixes: {
        trimDisplay: string;
        bodyStyleCode: string;
        bodyStyle: string;
        stubbedVIN: string;
        vinPrefix: string;
        isStubbedVin: boolean,
        vin: string;
        modelPattern: string;
    }[];
    error?: any;
}

export interface VehicleInfoItem {
    code: string;
    description: string;
}

export interface VinPrefixInfoItem extends VehicleInfoItem {
    bodyStyleCode: string;
    bodyStyle: string;
    stubbedVIN: string;
    vinPrefix: string;
    isStubbedVin: boolean;
    vin: string;
    modelPattern: string;
}
