import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from './app-settings.service';


@Injectable({
    providedIn: 'root'
})
export class QuoteService {
    appSettings: AppSettings;

    constructor(
        private httpClient: HttpClient,
        private appSettingService: AppSettingsService
    ) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    public getQuote(request) {
        const quoteURL = environment.nodeserver + this.appSettings.END_POINTS.QUOTE;

        return this.httpClient.post(quoteURL, request);
    }

    setParams(quoteNumber) {
        return new HttpParams().set('quoteNumber', quoteNumber);
    }
}
