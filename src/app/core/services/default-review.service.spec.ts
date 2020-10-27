import { TestBed, async } from '@angular/core/testing';

import { Router } from '@angular/router';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { DefaultReviewService } from './default-review.service';

describe('DefaultReviewService', () => {
    let service: DefaultReviewService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [DefaultReviewService, { provide: Router, useValue: {} }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(DefaultReviewService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Update Notification method makes Http PUT call', async(() => {
        const zip = '123456';
        service.getCoverageDetails().subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === service.coverageUrl
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ sucess: '' });
    }));
});
