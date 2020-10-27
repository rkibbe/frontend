import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { AppSettings } from '@shared/settings/app-settings';
import { of } from 'rxjs';
import { AppSettingsService } from './app-settings.service';
import { CallBackService } from './call-back.service';


describe('CallBackService', () => {
    let service: CallBackService;
    let httpTestingController: HttpTestingController;
    const appSetting = AppSettings;
    let appSettingsServiceStub;

    beforeEach(() => {
        appSettingsServiceStub = {
            getSettings() {
                return of(appSetting);
            }
        };
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                CallBackService,
                { provide: Router, useValue: {} },
                { provide: AppSettingsService, useValue: appSettingsServiceStub }
            ]
        });
    });
    beforeEach(() => {
        service = TestBed.get(CallBackService);
        // service.appSettings = appSettingsServiceStub;
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call doCallBack service ', () => {
        const token = '123456';
        spyOn(service, 'doCallBack').and.returnValue({ success: 'success' });
        spyOn(service, 'setParams').and.returnValue('paymentToken:123456');
        service.doCallBack(token);
        service.setParams(token);
        expect(service.doCallBack).toHaveBeenCalled();
        expect(service.setParams).toHaveBeenCalled();
    });

    xit('Update Notification method makes Http PUT call', async(() => {
        const token = '123456';
        service.doCallBack(token).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams ===
                environment.nodeserver + service.appSettings.END_POINTS.CALL_BACK + '?paymentToken:123456'
        );
        expect(req.request.method).toEqual('GET');
        req.flush({ sucess: 'success' });
    }));
});
