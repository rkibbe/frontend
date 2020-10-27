export const progressBarArray = {
    mileStoneObj: [
        {
            model: 'pniProgressValue',
            inCompleteImg: './assets/img/progress_Img_Driver.svg',
            completedImg: './assets/img/progress_Img_Driver_filled.svg',
            alt: 'driver',
            routeName: 'driversummary'
        },
        {
            model: 'driverProgressValue',
            inCompleteImg: './assets/img/progress_Img_Vehicle.svg',
            completedImg: './assets/img/progress_Img_Vehicle_filled.svg',
            alt: 'vehicle',
            routeName: 'vehiclesummary'
        },
        {
            model: 'vehicleProgressValue',
            inCompleteImg: './assets/img/progress_Img_Finish.svg',
            completedImg: './assets/img/progress_Img_Finish_filled.svg',
            alt: 'Finish',
            routeName: 'quickquote'
        }
    ],
    fullQuotemileStoneObj: [
        {
            model: 'coverageProgressValue',
            inCompleteImg: './assets/img/coverage_incomplete.svg',
            completedImg: './assets/img/coverage_complete.svg',
            alt: 'Coverage',
            routeName: 'policyreview'
        },
        {
            model: 'signProgressValue',
            inCompleteImg: './assets/img/sign_incomplete.svg',
            completedImg: './assets/img/sign_complete.svg',
            alt: 'Sign',
            routeName: 'signforms'
        },
        {
            model: 'cartProgressValue',
            inCompleteImg: './assets/img/cart_incomplete.svg',
            completedImg: './assets/img/cart_complete.svg',
            alt: 'Cart',
            routeName: 'paymentconfirm'
        },
        {
            model: 'finishProgressValue',
            inCompleteImg: './assets/img/progress_Img_Finish.svg',
            completedImg: './assets/img/progress_Img_Finish_filled.svg',
            alt: 'Fihish',
            routeName: 'paymentsuccess'
        }
    ]
};

export const hideMileStoneinPages = [
    'notinyourarea',
    'kodecline',
    'systemfailure',
    'calltofinish',
    'recoverquote',
    'quotesfound',
    'nonadpfcta',
    'tokenconfirm',
    'quotes',
    'personaldataalert',
    'contactus',
    'leadlanding'
];
export const DISABLE_BACK_BUTTON_LEAD_GEN = ['basicinfo', 'paymentsuccess'];
export const DISABLE_BACK_BUTTON_FULL_QUOTE_WITH_ADDL_DRIVERS = ['paymentsuccess', ''];
export const DISABLE_BACK_BUTTON_FULL_QUOTE_NO_ADDL_DRIVERS = ['paymentsuccess', ''];
const DEFAULT_PHONE_NUMBER = '1-267-310-3021';
export const VERTI_CONTACT_NUMBERS = {
    DEFAULT: DEFAULT_PHONE_NUMBER,
    // KODECLINE: '1-267-927-3115',
    // NONADPFCTA: '1-267-927-3157',
    // CALLCUSTOMIZE: '1-267-214-4360',
    // PRICECHANGE: '1-267-214-4964',
    // SYSTEMFAILURE: '1-267-460-0755'
    KODECLINE: DEFAULT_PHONE_NUMBER,
    NONADPFCTA: DEFAULT_PHONE_NUMBER,
    CALLCUSTOMIZE: DEFAULT_PHONE_NUMBER,
    PRICECHANGE: DEFAULT_PHONE_NUMBER,
    SYSTEMFAILURE: DEFAULT_PHONE_NUMBER,
    CONTACTUS: DEFAULT_PHONE_NUMBER
};

export const NO_COVERAGE = 'No Coverage';

export const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
