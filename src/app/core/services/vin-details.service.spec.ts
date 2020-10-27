import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { VinDetailsService } from './vin-details.service';


describe('VinDetailsService', () => {
    let service: VinDetailsService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [VinDetailsService, HttpClient]
        });
        service = TestBed.get(VinDetailsService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should make http call with correct params on click of getQuotes', () => {
        service.getVINDetails('JHDJDHSDJHSDSU44JD').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'polk/vin?vin=JHDJDHSDJHSDSU44JD'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ status: 'SUCCESS' });
    });
});
