import { Injectable } from '@angular/core';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from './app-settings.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    appSettings: AppSettings;
    constructor(private httpClient: HttpClient, private appSettingService: AppSettingsService) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }
    updateAddress(leadData) {
        leadData = { lead: leadData.payload };
        return this.httpClient.put(environment.nodeserver + this.appSettings.END_POINTS.UPDATE_ADDRESS, leadData);
    }
}
