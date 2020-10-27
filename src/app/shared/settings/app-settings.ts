export class AppSettings {
    END_POINTS = {
        TYPE_LIST: 'products/typeList',
        ROUTES: 'routes',
        PRODUCT_CHECK: 'products/productCheck',
        TRILLIUM: 'address',
        LEAD_QUOTE: 'leadQuote',
        VEHICLE_YEAR: 'util/vehicleYear',
        VEHICLE_MAKE: 'polk/make',
        VEHICLE_MODEL: 'polk/model',
        VEHICLE_TRIM: 'polk/vinPrefix',
        VERTI_BUSINESS_HOURS: 'util/time',
        FETCH_DOCUMENT: 'documents/fetchDocument',
        SIGN_FORMS: 'documents/signForms',
        UPDATE_ADDRESS: 'leadQuote/updateAddress',
        UPLOAD_DOCS: 'documents/uploadDocuments',
        RECOVER_QUOTE: 'quote/summary',
        QUOTE: 'quote',
        CALL_BACK: 'leadQuote/evoCallBack',
        BIND_POLICY: 'leadQuote/bind'
    };
    SPLUNK_LOGGING = {
        URL: 'http://mpv-splunk01.cgi.int:8088/services/collector',
        dev: false,
        sit: false,
        ppr: false,
        prod: false
    };
    VEHICLE_BODY_STYLES = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
    DECLINE_CODES = [603, 610028];
    CALL_US_CODES = [610001, 610024, 651140, 651130, 90000, 602];
    PERSONAL_DATA_ALERT_CODES = [651600];
    FULL_PROGRESS_PAGES = ['callcustomize'];
    LEAD_REDIRECT_AUTO_DISMISS_TIME = 4000;
}
