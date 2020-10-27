import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class VinDetailsService {
    readonly typelistUrl = environment.nodeserver + 'polk/vin';
    constructor(private httpClient: HttpClient) {}
    getVINDetails(vin): Observable<any> {
        const vinDetailsUrl = this.typelistUrl + `?vin=${vin}`;
        return this.httpClient.get(vinDetailsUrl);
    }
}
