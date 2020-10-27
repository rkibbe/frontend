import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from './app-settings.service';

@Injectable({
    providedIn: 'root'
})
export class SplunkService {
    private appSettings: AppSettings;
    private url: string;
    private headers: HttpHeaders;

    constructor(private httpClient: HttpClient, private appSettingService: AppSettingsService) {
        // get and set settings
        this.appSettingService.getSettings().subscribe(settings => {
            this.appSettings = settings;
            // Splunk URL
            this.url = this.appSettings.SPLUNK_LOGGING.URL || '';
        });
        const token = environment.splunk_token;
        this.headers = new HttpHeaders();
        // HttpHeadsers
        this.headers = this.headers.set('Content-Type', 'application/json').set('Authorization', 'Splunk ' + token);
    }

    public log(logMessage) {
        if (this.appSettings.SPLUNK_LOGGING[environment.name]) {
            this.httpClient.post(this.url, { event: logMessage }, { headers: this.headers }).subscribe(resp => {});
        }
    }
}
