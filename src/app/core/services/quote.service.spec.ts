import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { QuoteService } from './quote.service';


describe('QuoteService', () => {
    let service: QuoteService;
    let httpTestingController: HttpTestingController;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientModule,
                HttpClientTestingModule],
            providers: [QuoteService, { provide: Router, useValue: {} }]
        })
    );
    beforeEach(() => {
        service = TestBed.get(QuoteService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Update Notification method makes Http PUT call', async(() => {
        const zip = '123456';
        service.getQuote('123456').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + service.appSettings.END_POINTS.QUOTE
        );
        expect(req.request.method).toEqual('POST');
        req.flush({ sucess: '' });
    }));
});
