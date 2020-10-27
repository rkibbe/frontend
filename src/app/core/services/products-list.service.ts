import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductsListService {
    private readonly URL = `${environment.nodeserver}products/productCheck`;
    constructor(private http: HttpClient) {}

    productListService(zip: string): Observable<string> {
        const params = new HttpParams().set('zipCode', zip);
        return this.http.get<ProductsListResponse>(this.URL, { params }).pipe(
            retry(1),
            map(res => {
                if (res && res.ApiOutput && res.ApiOutput.statusMessage) {
                    if (
                        res.ApiOutput.statusMessage !== 'Product Not Found' &&
                        res.ApiOutput.statusMessage !== 'Product Found'
                    ) {
                        throw new Error('Unexpected product list status message received');
                    }

                    return res.ApiOutput.statusMessage;
                }
                throw new Error('Invalid product list response received');
            })
        );
    }
}

interface ProductsListResponse {
    ApiOutput: { statusMessage: string };
}
