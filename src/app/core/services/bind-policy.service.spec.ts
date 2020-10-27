import { TestBed, async } from '@angular/core/testing';

import { Router } from '@angular/router';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { BindPolicyService } from './bind-policy.service';

describe('BindPolicyService', () => {
    let service: BindPolicyService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [BindPolicyService, { provide: Router, useValue: {} }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(BindPolicyService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Update Notification method makes Http PUT call', async(() => {
        service.bindPolicy({ quickQuote: {}, quote: {} }).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + service.appSettings.END_POINTS.BIND_POLICY
        );
        expect(req.request.method).toEqual('POST');
        req.flush({ sucess: '' });
    }));
});
