import { HttpClient, HttpClientModule, HttpEventType, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { of } from 'rxjs';
import { AppSettingsService } from './app-settings.service';
import { UploadfileService } from './uploadfile.service';


describe('UploadfileService', () => {
    let service: UploadfileService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                UploadfileService,
                HttpClient,
                {
                    provide: AppSettingsService,
                    useValue: {
                        getSettings: jasmine.createSpy('getSettings').and.returnValue(
                            of({
                                END_POINTS: {
                                    TYPE_LIST: 'products/typeList',
                                    ROUTES: 'routes',
                                    PRODUCT_CHECK: 'products/productCheck',
                                    TRILLIUM: 'address',
                                    LEAD_QUOTE: 'leadQuote',
                                    VEHICLE_YEAR: 'util/vehicleYear',
                                    VEHICLE_MAKE: 'polk/make',
                                    VEHICLE_MODEL: 'polk/model',
                                    VEHICLE_TRIM: 'polk/vinPrefix',
                                    VERTI_BUSINESS_HOURS: 'util/time',
                                    FETCH_DOCUMENT: 'documents/fetchDocument',
                                    SIGN_FORMS: 'documents/signForms',
                                    UPDATE_ADDRESS: 'leadQuote/updateAddress',
                                    UPLOAD_DOCS: 'documents/uploadDocuments',
                                    RECOVER_QUOTE: 'quote/summary',
                                    QUOTE: 'quote',
                                    CALL_BACK: 'leadQuote/evoCallBack',
                                    BIND_POLICY: 'leadQuote/bind'
                                }
                            })
                        )
                    }
                }
            ]
        });
        service = TestBed.get(UploadfileService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should make http call with correct params on click of upload', () => {
        const mockEvent = {
            body: '',
            loaded: 20,
            total: 100,
            type: HttpEventType.UploadProgress
        };

        service.upload('BHGGHJJJKJJSJHWSJWSWS67SWS8SWSW').subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'documents/uploadDocuments'
        );
        expect(req.request.method).toEqual('POST');
        req.flush(mockEvent);
    });
});
