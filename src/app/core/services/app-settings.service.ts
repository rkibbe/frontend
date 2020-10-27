import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppSettings } from '@shared/settings/app-settings';
@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    settings: AppSettings;
    constructor() {
        this.settings = new AppSettings();
    }
    getSettings(): Observable<any> {
        return of<AppSettings>(this.settings);
    }
}
