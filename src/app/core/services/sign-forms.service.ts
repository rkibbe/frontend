import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AppSettings } from '@shared/settings/app-settings';
import { GetIpResponse } from 'src/app/store/models/lead.model';
import { AppSettingsService } from './app-settings.service';


@Injectable({
    providedIn: 'root'
})
export class SignFormsService {
    appSettings: AppSettings;
    pdfData: string;
    // readonly typelistUrl = environment.nodeserver + 'polk/vin';
    constructor(private httpClient: HttpClient, private appSettingService: AppSettingsService) {
        this.appSettingService.getSettings().subscribe(appSettings => {
            this.appSettings = appSettings;
        });
    }
    getSignFormBase64(documentNum) {
        return this.httpClient.get(environment.nodeserver + this.appSettings.END_POINTS.FETCH_DOCUMENT, {
            params: this.setParams(documentNum)
        });
    }
    setParams(documentNum: string): HttpParams {
        return new HttpParams().set('attributes', documentNum.trim());
    }
    signForm(leadData) {
        leadData = { lead: leadData.payload };
        return this.httpClient.put(environment.nodeserver + this.appSettings.END_POINTS.SIGN_FORMS, leadData);
    }
    public getIp() {
        return this.httpClient.get<GetIpResponse>('https://api.ipify.org/?format=json');
    }
    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resp => {
                    if (resp.coords.longitude !== null && resp.coords.latitude !== null) {
                        const myLatlng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

                        const currgeocoder = new google.maps.Geocoder();
                        currgeocoder.geocode(
                            {
                                location: myLatlng
                            },
                            function(results, status) {
                                if (status === google.maps.GeocoderStatus.OK) {
                                    resolve({
                                        lat: resp.coords.latitude,
                                        long: resp.coords.longitude,
                                        addr: results[0]
                                    });
                                } else {
                                    reject({ err: 'error' });
                                }
                            }
                        );
                    }
                },
                err => {
                    reject(err);
                }
            );
        });
    }
}
