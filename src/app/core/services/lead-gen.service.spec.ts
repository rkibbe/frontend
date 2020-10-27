import { TestBed, async } from '@angular/core/testing';

import { LeadGenService } from './lead-gen.service';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('LeadGenService', () => {
    let service: LeadGenService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [LeadGenService, { provide: Router, useValue: {} }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(LeadGenService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getLeadGen method makes Http GET call', async(() => {
        const leadId = '123456';
        const quoteId = '4343';
        service.getLeadGen(leadId, quoteId).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'leadGen/lead?leadID=123456&qqID=4343'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ sucess: '' });
    }));
    it('getLeadGen method makes Http GET call only with leadID param if qqID is undefined', async(() => {
        const leadId = '123456';
        service.getLeadGen(leadId, '').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'leadGen/lead?leadID=123456'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ sucess: '' });
    }));
});
