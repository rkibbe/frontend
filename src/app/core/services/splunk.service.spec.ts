import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppSettingsService } from './app-settings.service';
import { SplunkService } from './splunk.service';

describe('SplunkService', () => {
    let service: SplunkService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                SplunkService,
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
                                },
                                SPLUNK_LOGGING: {
                                    URL: 'http://mpv-splunk01.cgi.int:8088/services/collector',
                                    dev: 'testurl@com',
                                    sit: false,
                                    ppr: false,
                                    prod: false
                                }
                            })
                        )
                    }
                }
            ]
        });
        service = TestBed.get(SplunkService);
        httpTestingController = TestBed.get(HttpTestingController);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should make http call with correct params for log method if we have dev url in appSettings', () => {
        service.log('test logmessage ');
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === 'http://mpv-splunk01.cgi.int:8088/services/collector'
        );
        expect(req.request.method).toEqual('POST');
        req.flush({ success: '' });
    });
});
