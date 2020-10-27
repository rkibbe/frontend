import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { RouteService } from './route.service';


describe('RouteService', () => {
    let service: RouteService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [RouteService, HttpClient]
        });
        service = TestBed.get(RouteService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    xit('should make http call with correct params on click of getRoutes', () => {
        service.getRoutes({ payload: 'testRoute' }).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'routes?referringURL=testRoute'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ apiOutput: { result: { status: 'SUCCESS' } } });
    });
    xit('should make http call with defult  param "organic" on click of getRoutes', () => {
        service.getRoutes({ payload: '' }).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'routes?referringURL=organic'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ apiOutput: { result: { status: 'SUCCESS' } } });
    });
    it('should make http call with correct params on click of getRoutesFromFallback', () => {
        service.getRoutesFromFallback().subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === 'assets/data/routes.json'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ apiOutput: { result: { status: 'SUCCESS' } } });
    });
});
