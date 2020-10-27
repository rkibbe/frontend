import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';
import { ProductsListService } from './products-list.service';


describe('ProductsListService', () => {
    let service: ProductsListService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],
            providers: [ProductsListService]
        })
    );
    beforeEach(() => {
        service = TestBed.get(ProductsListService);
        httpTestingController = TestBed.get(HttpTestingController);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
        service.productListService('123456').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === `${environment.nodeserver}products/productCheck?zipCode=123456`
        );
        expect(req.request.method).toEqual('GET');
        req.flush({
            ApiOutput: { statusMessage: 'Product Not Found' }
        });
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
        service.productListService('123456').subscribe(
            data => {},
            error => {
                expect(error).toEqual(new Error('Unexpected product list status message received'));
            }
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === `${environment.nodeserver}products/productCheck?zipCode=123456`
        );
        expect(req.request.method).toEqual('GET');
        req.flush({
            ApiOutput: { statusMessage: 'Success message' }
        });
    });
});
