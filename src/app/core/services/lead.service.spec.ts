import { TestBed, async } from '@angular/core/testing';

import { Router } from '@angular/router';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { LeadService } from './lead.service';

describe('LeadService', () => {
    let service: LeadService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [LeadService, { provide: Router, useValue: {} }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(LeadService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Update Notification method makes Http PUT call', async(() => {
        const zip = '123456';
        service.saveLead({ quickQuote: {}, quote: {} }).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === environment.nodeserver + 'leadQuote'
        );
        expect(req.request.method).toEqual('POST');
        req.flush({ sucess: '' });
    }));
});
