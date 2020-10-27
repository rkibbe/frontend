import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppSettings } from '@shared/settings/app-settings';
import { map } from 'rxjs/operators';
import { AppSettingsService } from './app-settings.service';


@Injectable({
    providedIn: 'root'
})
export class UploadfileService {
    appSettings: AppSettings;

    constructor(private httpClient: HttpClient, private appSettingService: AppSettingsService) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }

    public upload(document) {
        const uploadURL = environment.nodeserver + this.appSettings.END_POINTS.UPLOAD_DOCS;

        const docdata = {
            documents: document
        };

        return this.httpClient
            .post<any>(uploadURL, docdata, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                map(event => {
                    switch (event.type) {
                        case HttpEventType.UploadProgress:
                            const progress = Math.round((100 * event.loaded) / event.total);
                            return { status: 'progress', message: progress };
                        case HttpEventType.Response:
                            return event.body;
                        default:
                            return `Unhandled event: ${event.type}`;
                    }
                })
            );
    }
}
