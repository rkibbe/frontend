import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';
import { SignFormsService } from './sign-forms.service';

describe('SignFormsService', () => {
    let service: SignFormsService;
    let httpTestingController: HttpTestingController;
    let constructorSpy, geocoder;
    navigator.geolocation.getCurrentPosition = success =>
        success({
            coords: {
                latitude: 30,
                longitude: -105,
                accuracy: 223,
                altitude: 34,
                altitudeAccuracy: 3433,
                heading: 766,
                speed: 888
            },
            timestamp: Date.now()
        });

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, StoreModule.forRoot({})],
            providers: [SignFormsService]
        })
    );
    beforeEach(() => {
        service = TestBed.get(SignFormsService);
        httpTestingController = TestBed.get(HttpTestingController);

        constructorSpy = spyOn(google.maps, 'Geocoder');
        geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);
        constructorSpy.and.returnValue(geocoder);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getSignFormBase64 method should return base64File ', () => {
        const successRep = {
            file: 'JJHJDJSDJSDJSDJHHBHJD23233JDJD'
        };
        expect(service).toBeTruthy();
        service.getSignFormBase64('123456').subscribe(data => {
            expect(data).toEqual(successRep);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'documents/fetchDocument?attributes=123456'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(successRep);
    });
    it('getSignFormBase64 method should return base64File ', () => {
        const successRep = {
            signForms: {}
        };
        expect(service).toBeTruthy();
        service.signForm({ payload: {} }).subscribe(data => {
            expect(data).toEqual(successRep);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === environment.nodeserver + 'documents/signForms'
        );
        expect(req.request.method).toEqual('PUT');
        req.flush(successRep);
    });
    it('getIp method should return correct ip Address ', () => {
        const successRep = {
            ip: '192.872.09.88'
        };
        expect(service).toBeTruthy();
        service.getIp().subscribe(data => {
            expect(data).toEqual(successRep);
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === 'https://api.ipify.org/?format=json'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(successRep);
    });

    it('getPosition method should return correct postion', async(() => {
        service.getPosition();
        geocoder.geocode.calls.mostRecent();
        expect(geocoder.geocode).toHaveBeenCalled();
    }));
});
