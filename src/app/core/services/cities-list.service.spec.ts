import { TestBed, async } from '@angular/core/testing';

import { CitiesListService } from './cities-list.service';
import { Router } from '@angular/router';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';

describe('CitiesListService', () => {
    let service: CitiesListService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule,
                HttpClientTestingModule],
            providers: [CitiesListService, { provide: Router, useValue: {} }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(CitiesListService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Update Notification method makes Http PUT call', async(() => {
        const zip = '123456';
        service.getCitiesList('123456').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === `${environment.nodeserver}address?zipCode=${zip}&countryCode=USA`
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ sucess: '' });
    }));
});
