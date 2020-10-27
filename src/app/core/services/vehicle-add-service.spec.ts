import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { VehicleAddService } from './vehicle-add-service';


describe('VehicleAddService', () => {
    let service: VehicleAddService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [VehicleAddService, HttpClient]
        });
        service = TestBed.get(VehicleAddService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should make http call with correct params on click of getQuotes', () => {
        service.getVehicleYear().subscribe(data => {
            expect(data).toEqual([{ code: '2009', description: '2009' }]);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === environment.nodeserver + 'polk/vehicleYear'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(['2009']);
    });
    it('getVehicleYear method throws error if api response is invalid and has error object', () => {
        service.getVehicleYear().subscribe(data => { }, error => { });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === environment.nodeserver + 'polk/vehicleYear'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ error: 'error' });
    });
    it('should make http call with correct params on click of getVehicleMake', () => {
        service.getVehicleMake('2009').subscribe(data => {
            expect(data).toEqual([{ code: '2009', description: '2009' }]);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === environment.nodeserver + 'polk/make?year=2009'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({
            makes: [
                {
                    code: '2009',
                    description: '2009'
                }
            ]
        });
    });
    it('getVehicleMake method throws error if api response is invalid and has error object', () => {
        service.getVehicleMake('2009').subscribe(data => { }, error => { });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === environment.nodeserver + 'polk/make?year=2009'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({
            error: 'Unexpected response'
        });
    });
    it('should make http call with correct params on click of getVehicleModel', () => {
        service.getVehicleModel('2009', '2008').subscribe(data => {
            expect(data).toEqual([{ code: '2009', description: '2009' }]);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'polk/model?year=2009&make=2008'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({
            models: [
                {
                    code: '2009',
                    description: '2009'
                }
            ]
        });
    });
    it('should make http call with correct params on click of getVehicleModel', () => {
        service.getVehicleTrim('2009', '2008', '2007').subscribe(data => {
            expect(data).toEqual([
                {
                    code: 'string',
                    description: 'string',
                    bodyStyleCode: '43434',
                    bodyStyle: 'string',
                    stubbedVIN: 'SDSFSFFFDSDSD',
                    vinPrefix: 'string',
                    isStubbedVin: true,
                    vin: 'GFFGGFGHJJJJ7GH'
                }
            ]);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'polk/vinPrefix?year=2009&make=2008&model=2007'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({
            vinPrefixes: [
                {
                    trimDisplay: 'string',
                    bodyStyleCode: '43434',
                    bodyStyle: 'string',
                    stubbedVIN: 'SDSFSFFFDSDSD',
                    vinPrefix: 'string',
                    isStubbedVin: true,
                    vin: 'GFFGGFGHJJJJ7GH'
                }
            ]
        });
    });
    it('getVehicleTrim method throws error if api response is invalid and has error object', () => {
        service.getVehicleTrim('2009', '2008', '2007').subscribe(data => { }, error => { });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'polk/vinPrefix?year=2009&make=2008&model=2007'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ error: 'error' });
    });
});
