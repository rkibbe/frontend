import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class CitiesListService {
    constructor(private http: HttpClient) {}

    getCitiesList(zip) {
        const url = `${environment.nodeserver}address?zipCode=${zip}&countryCode=USA`;
        return this.http.get(url);
    }
}
