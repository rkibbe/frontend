import { Injectable } from '@angular/core';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from './app-settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class CallBackService {
    appSettings: AppSettings;
    constructor(private httpClient: HttpClient, private appSettingService: AppSettingsService) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }
    doCallBack(token) {
        return this.httpClient.get(environment.nodeserver + this.appSettings.END_POINTS.CALL_BACK, {
            params: this.setParams(token)
        });
    }
    setParams(token: string): HttpParams {
        return new HttpParams().set('paymentToken', token.trim());
    }
}
