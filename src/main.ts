import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
if (environment.production) {
    enableProdMode();
}

document.write(
    '<script src=https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleapikey +
        '&libraries=places async defer></script>'
);
document.write('<span style="display:none">App Version: ' + environment.version + '</span>');

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
