import { Injectable } from '@angular/core';
import { AppSettings } from '@shared/settings/app-settings';
import { AppSettingsService } from './app-settings.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class BindPolicyService {
  appSettings: AppSettings;
  constructor(private httpClient: HttpClient, private appSettingService: AppSettingsService) {
    this.appSettingService.getSettings().subscribe(appSettings => {
      this.appSettings = appSettings;
    });
  }
  bindPolicy(leadData) {
    leadData = { lead: leadData };
    return this.httpClient.post(environment.nodeserver + this.appSettings.END_POINTS.BIND_POLICY, leadData);
  }
}
