// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    name: 'dev',
    production: false,
    googleapikey: 'AIzaSyAlA1sO6G-O4HVjOeEHO_lyeCqGajY2rsc',
    vertiurl: 'https://www.verti.com',
    version: require('../../package.json').version,
    splunk_token: 'B3297F76-DF1E-4AB8-A418-057262A953F9',
    // nodeserver: 'https://mdlnodjs01:57002/',
    nodeserver: 'https://dev.qnb.verti.com/endpoints/',
    // nodeserver: 'https://localhost:57002/',
    sidekickUrl: 'https://staging.account.verti.com/createaccount/user?enterprisePartyID',
    konyUrl: 'https://konydev02.mapfreinsurance.com/CubeSPA/kdw?vertimode=Fusion',
    lattitude: 41.2033216,
    longitude: -77.19452469999999,
    companyName: 'verti',
    defaultStateCode: 'PA'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
