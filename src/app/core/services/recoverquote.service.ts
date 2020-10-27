import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from './app-settings.service';


@Injectable({
    providedIn: 'root'
})
export class RecoverquoteService {
    appSettings: AppSettings;

    constructor(
        private httpClient: HttpClient,
        private appSettingService: AppSettingsService
    ) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    public getQuotes(searchKey) {
        const recoverquoteURL = environment.nodeserver + this.appSettings.END_POINTS.RECOVER_QUOTE;

        return this.httpClient.get(recoverquoteURL, { params: this.setParams(searchKey) });
    }

    setParams(searchKey) {
        return new HttpParams()
                    .set('email', searchKey.emailID)
                    .set('dob', searchKey.dob)
                    .set('zipCode', searchKey.zipCode)
                    .set('lastName', searchKey.lastName)
                    .set('firstName', searchKey.firstName);
    }
}
