import { TestBed, async } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppSettingsService } from './app-settings.service';
import { of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { AppSettings } from '@shared/settings/app-settings';
import { TimeoutModalComponent } from '@shared/timeout-modal/timeout-modal.component';

let store: MockStore<AppState>;
let service: NavigationService;
let dialogSpy;
const DRIVER_LICENSE_NUMBER = 'Driver license number';
const initialState = {
    lead: fromStore.initialState,
    error: { code: '', message: '' }
};
const mockRouter = {
    navigate: jasmine.createSpy('navigate')
};
const mockDialogRef = {
    open: () => { },
    close: () => { }
};
const appSettingsService = {
    getSettings: () => of<AppSettings>(new AppSettings())
};
const dialogRefSpyObj = jasmine.createSpyObj({ afterOpened: of({}), close: null });
const visibleRoutes = [
    {
        'referringURL': '',
        'routeName': 'basicinfo',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'contactinfo',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'homeaddress',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'rules': [
            'productUWRuleCheck',
            'productAvailabiltyRuleCheck'
        ],
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'previousaddress',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'eligibilityquestionone',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'eligibilityquestiontwo',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'eligibilityquestionthree',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'leadlanding',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'maritalstatus',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'insurancecoverage',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'vehiclesummary',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'childRoutes': [
            {
                'referringURL': '',
                'routeName': 'vehicleadd/:id',
                'visible': true,
                'preFill': true,
                'generateQuickQuotePrice': false,
                'rateQuote': false,
                'finalizeQuote': false,
                'updatePaymentPlan': false,
                'evo': false,
                'replaceUrl': false,
                'validateDriver': false,
                'validateRules': false
            }
        ],
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'driversummary',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'childRoutes': [
            {
                'referringURL': '',
                'routeName': 'driverbasicinfo/:id',
                'visible': true,
                'preFill': true,
                'generateQuickQuotePrice': false,
                'rateQuote': false,
                'finalizeQuote': false,
                'updatePaymentPlan': false,
                'evo': false,
                'replaceUrl': false,
                'validateDriver': false,
                'validateRules': false
            },
            {
                'referringURL': '',
                'routeName': 'drivermaritalstatus/:id',
                'visible': true,
                'preFill': true,
                'generateQuickQuotePrice': false,
                'rateQuote': false,
                'finalizeQuote': false,
                'updatePaymentPlan': false,
                'evo': false,
                'replaceUrl': false,
                'validateDriver': false,
                'validateRules': false
            },
            {
                'referringURL': '',
                'routeName': 'drivermajorviolation/:id',
                'visible': true,
                'preFill': true,
                'generateQuickQuotePrice': false,
                'rateQuote': false,
                'finalizeQuote': false,
                'updatePaymentPlan': false,
                'evo': false,
                'replaceUrl': false,
                'validateDriver': false,
                'validateRules': false
            },
            {
                'referringURL': '',
                'routeName': 'licensesuspended/:id',
                'visible': true,
                'preFill': true,
                'generateQuickQuotePrice': false,
                'rateQuote': false,
                'finalizeQuote': false,
                'updatePaymentPlan': false,
                'evo': false,
                'replaceUrl': false,
                'validateDriver': false,
                'validateRules': false
            },
            {
                'referringURL': '',
                'routeName': 'driverdrivinghistory/:id',
                'visible': true,
                'preFill': true,
                'generateQuickQuotePrice': false,
                'rateQuote': false,
                'finalizeQuote': false,
                'updatePaymentPlan': false,
                'evo': false,
                'replaceUrl': false,
                'validateDriver': false,
                'validateRules': false
            }
        ],
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'relationship/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'quickquote',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'licenseinfoprerc/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': true,
        'content': [
            {
                'attribute': 'licenseStatus',
                'type': 'select',
                'label': 'Driver status',
                'placeHolder': 'Select',
                'visible': true,
                'required': true,
                'hasDependency': false
            },
            {
                'attribute': 'state',
                'type': 'select',
                'label': 'Issuing state',
                'placeHolder': 'Select',
                'visible': true,
                'required': true,
                'hasDependency': true
            },
            {
                'attribute': 'licenseNum',
                'type': 'text',
                'label': DRIVER_LICENSE_NUMBER,
                'placeHolder': DRIVER_LICENSE_NUMBER,
                'visible': true,
                'required': true,
                'hasDependency': true
            },
            {
                'attribute': 'licenseYears',
                'type': 'select',
                'label': 'Years licensed',
                'placeHolder': 'Select',
                'visible': true,
                'required': true,
                'hasDependency': true
            }
        ],
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'sni',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'snicontact/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'vin/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'isCTAEnabled': true,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'vehicledamage',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'titleholder-select/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'policystartdate',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': true,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': true
    },
    {
        'referringURL': '',
        'routeName': 'phone',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': true,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': true
    },
    {
        'referringURL': '',
        'routeName': 'policyreview',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': true,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'licenseinfopostrc/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': true,
        'content': [
            {
                'attribute': 'licenseStatus',
                'type': 'select',
                'label': 'Driver status',
                'placeHolder': 'Select',
                'visible': true,
                'required': true,
                'hasDependency': false
            },
            {
                'attribute': 'state',
                'type': 'select',
                'label': 'Issuing state',
                'placeHolder': 'Select',
                'visible': true,
                'required': true,
                'hasDependency': true
            },
            {
                'attribute': 'licenseNum',
                'type': 'text',
                'label': DRIVER_LICENSE_NUMBER,
                'placeHolder': DRIVER_LICENSE_NUMBER,
                'visible': true,
                'required': true,
                'hasDependency': true
            },
            {
                'attribute': 'licenseYears',
                'type': 'select',
                'label': 'Years licensed',
                'placeHolder': 'Select',
                'visible': true,
                'required': true,
                'hasDependency': true
            }
        ],
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'vin/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'isCTAEnabled': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'titleholder-contact/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'docverify',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'uploadfile/:id',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'pricechange',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'finalprice',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': true,
        'updatePaymentPlan': true,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'signforms',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'mailingaddress',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'payer',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': true,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'billingaddress',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': true,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'pay',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'paymentstatus',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': false,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'paymentconfirm',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': true,
        'validateDriver': false,
        'validateRules': false
    },
    {
        'referringURL': '',
        'routeName': 'paymentsuccess',
        'visible': true,
        'preFill': true,
        'generateQuickQuotePrice': false,
        'rateQuote': false,
        'finalizeQuote': false,
        'updatePaymentPlan': false,
        'evo': false,
        'replaceUrl': true,
        'validateDriver': false,
        'validateRules': false
    }
];
const lead = {
    'leadID': '00Q29000007Wsx5EAC',
    'publicID': 'pc:193067',
    'sessionUUID': 'c8b93af2-ed54-40bd-a26e-365a7d0ed48b',
    'genderCode': 'M',
    'genderValue': 'Male',
    'maritalStatusCode': 'S',
    'maritalStatusValue': 'Single',
    'primaryAddress': {
        'publicID': 'pc:435851',
        'displayName': '347 Oliver St, JERSEY SHORE, PA 17740',
        'addressLine1': '347 Oliver St',
        'city': 'JERSEY SHORE',
        'county': 'LYCOMING',
        'state': 'PA',
        'postalCode': '17740',
        'country': 'US',
        'addressType': 'home',
        'timeAtCurrentResidenceExt': 'greaterThan2Months',
        'isAddressVerified': true,
        'timeAtCurrentResidenceCode': 'greaterThan2Months'
    },
    'priorAddress': null,
    'primaryEmailAddress': 'john.p@verti.com',
    'phoneNumber': '',
    'quickQuote': {
        'quickQuoteNumber': null,
        'monthlyPremiumPrice': 345,
        'drivers': [
            {
                'driverID': '00Q29000007Wsx5EAC-1',
                'firstName': 'John',
                'lastName': 'Papa',
                'genderCode': 'M',
                'genderValue': 'Male',
                'age': 32,
                'dateOfBirth': {
                    'year': 1987,
                    'month': 12,
                    'day': 12
                },
                'isIncluded': true,
                'isPNI': true,
                'maritalStatusCode': 'S',
                'maritalStatusValue': 'Single',
                'isADPF': false,
                'isVisible': true,
                'accidentsAndViolations': [

                ],
                'noOfAccidentsAndViolations': {
                    'noOfMovingViolations': 'none',
                    'noOfAtFaultAccidents': 'none',
                    'noOfNotAtFaultAccidents': 'none',
                    'noOfComprehensiveClaims': 'none'
                },
                'relationshipCode': '',
                'relationshipValue': '',
                'licenseState': 'PA',
                'yearsLicensed': 'LessThan6Months',
                'isQuoteDriver': true,
                'licenseStatus': 'ValidLicense',
                'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                'yearsLicensedValue': 'Less than 6 months',
                'person': {
                    'publicID': 'pc:193067'
                },
                'publicID': 'pc:447795'
            }, {
                'driverID': '00Q29000007Wsx5EAC-2',
                'firstName': 'John',
                'lastName': 'Write',
                'genderCode': 'M',
                'genderValue': 'Male',
                'age': 31,
                'dateOfBirth': {
                    'year': 1989,
                    'month': 10,
                    'day': 12
                },
                'isIncluded': true,
                'isPNI': false,
                'maritalStatusCode': 'S',
                'maritalStatusValue': 'Single',
                'isADPF': false,
                'isVisible': true,
                'accidentsAndViolations': [

                ],
                'noOfAccidentsAndViolations': {
                    'noOfMovingViolations': 'none',
                    'noOfAtFaultAccidents': 'none',
                    'noOfNotAtFaultAccidents': 'none',
                    'noOfComprehensiveClaims': 'none'
                },
                'relationshipCode': '',
                'relationshipValue': '',
                'licenseState': 'PA',
                'yearsLicensed': 'LessThan6Months',
                'isQuoteDriver': true,
                'licenseStatus': 'ValidLicense',
                'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                'yearsLicensedValue': 'Less than 6 months',
                'person': {
                    'publicID': 'pc:193067'
                },
                'publicID': 'pc:447795'
            },
            {
                'driverID': '00Q29000007Wsx5EAC-2',
                'firstName': 'David',
                'lastName': 'Warner',
                'genderCode': 'M',
                'genderValue': 'Male',
                'age': 29,
                'dateOfBirth': {
                    'year': 1990,
                    'month': 10,
                    'day': 12
                },
                'isIncluded': true,
                'isPNI': false,
                'maritalStatusCode': 'S',
                'maritalStatusValue': 'Single',
                'isADPF': false,
                'isVisible': true,
                'accidentsAndViolations': [

                ],
                'noOfAccidentsAndViolations': {
                    'noOfMovingViolations': 'none',
                    'noOfAtFaultAccidents': 'none',
                    'noOfNotAtFaultAccidents': 'none',
                    'noOfComprehensiveClaims': 'none'
                },
                'relationshipCode': '',
                'relationshipValue': '',
                'licenseState': 'PA',
                'ownInsuranceApprovedExt': false,
                'yearsLicensed': 'LessThan6Months',
                'isQuoteDriver': true,
                'licenseStatus': 'OwnInsurance',
                'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                'yearsLicensedValue': 'Less than 6 months',
                'person': {
                    'publicID': 'pc:193067'
                },
                'publicID': 'pc:447798'
            }
        ],
        'vehicles': [
            {
                'vehicleID': '00Q29000007Wsx5EAC-1',
                'isIncluded': true,
                'isADPF': false,
                'isQuoteVehicle': true,
                'isAlreadyIncluded': true,
                'isVisible': true,
                'year': 2018,
                'make': 'BMW',
                'model': '320',
                'trim': 'I 4DR SEDAN AUTOMATIC',
                'bodyStyleCode': 'SD',
                'bodyStyle': 'SEDAN',
                'stubbedVIN': 'WBA8A9C5*J*******',
                'vinPrefix': 'WBA8A9C5*J*******',
                'isStubbedVin': true,
                'vin': 'WBA8A9C5*J*******',
                'iconExisted': true,
                'publicID': 'pc:246016',
                'registeredState': 'PA',
                'registeredOwner': 'John Papa',
                'primaryUse': 'Commuting to Work or School',
                'primaryUseCode': 'commuting',
                'usedInRideSharing': false,
                'rideShare': 'No',
                'afterMarketDevice': 'No',
                'passiveAlarm': 'No',
                'commuteNYNJ': 'No',
                'commutetoNYNJ': 'No',
                'garagedAt': {
                    'publicID': 'pc:268902',
                    'addressLine1': '347 Oliver St',
                    'city': 'JERSEY SHORE',
                    'state': 'PA',
                    'postalCode': '17740',
                    'country': 'US',
                    'isAddressVerified': true
                },
                'garagingAddress': 'Residential',
                'titleHolder': 'PaidFor',
                'leaseOrRent': false,
                'owned': true,
                'additionalInterests': [

                ]
            }
        ],
        'periodStartDate': {
            'year': 2020,
            'month': 6,
            'day': 30
        },
        'periodEndDate': {
            'year': 2020,
            'month': 12,
            'day': 31
        },
        'fullTermPremiumPrice': null,
        'policyTerm': '',
        'whatToDo': {
            'eligible': '',
            'referToPA': '',
            'knockOut': ''
        },
        'quoteStatus': null,
        'recordStatus': {
            'statusCode': '',
            'statusMessage': ''
        },
        'secondaryInsured': {
            'driverID': null,
            'email': null,
            'phone': null,
            'isSNISelected': null
        },
        'currentCarrier': {
            'currentInsurance': false,
            'lapseReason': '',
            'yearsInsuredValue': '',
            'bILimitFormatted': null
        }
    },
    'quote': {
        'quoteNumber': 'Q1000082338',
        'quoteStatus': null,
        'isADPFQuote': false,
        'eligibilityAnswers': {
            'ineligibleVehicle': '',
            'majorViolations': '',
            'licenseRevoked': ''
        },
        'premiumChangeIndicator': true,
        'currentInsuranceInfo': {
            'currentInsurance': false,
            'lastActiveInsurance': 'neverhadinsurance',
            'yearsInsured': '',
            'bILimits': '',
            'bILimitsValue': ''
        },
        'policyCoverage': {
            'bILimit': '',
            'uIMBILimit': '',
            'uMBILimit': '',
            'pDLimit': ''
        },
        'verificationDocuments': [{
            'title': 'Visual documentation',
            'docTypeId': 'veh_pictures'
        },
        {
            'title': 'Proof of driving history',
            'docTypeId': 'drive_hist_proof'
        }]
    },
    'marketingData': {
        'campaignID': 'WC100000092517',
        'leadSource': 'Fusion',
        'currentURL': 'https://konydev02.mapfreinsurance.com/car-insurance/#titleholder-select/00Q29000007Wsx5EAC-1',
        'referringURL': null,
        'zipCode': null,
        'mbsy': null,
        'leadID': '00Q29000007Wsx5EAC'
    },
    'generateQuickQuotePrice': false,
    'rateQuote': false,
    'finalizeQuote': false,
    'updatePaymentPlan': false,
    'evo': false,
    'validateDriver': false,
    'validateRules': false,
    'firstName': 'John',
    'lastName': 'Papa',
    'dateOfBirth': {
        'year': 1987,
        'month': 12,
        'day': 12
    },
    'enterprisePartyID': '0012900000Zg9koAAB',
    'gender': 'M',
    'residenceOwnership': 'rent',
    'residenceOwnershipValue': 'Rent',
    'noOfMovingViolations': 'none',
    'noOfAtFaultAccidents': 'none',
    'noOfNotAtFaultAccidents': 'none',
    'noOfComprehensiveClaims': 'none',
    'quoteRated': false,
    'maritalStatus': 'S'
};
describe('NavigationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NavigationService,
                { provide: Router, useValue: mockRouter },
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: AppSettingsService, useValue: appSettingsService },
                provideMockStore({ initialState })
            ]
        });
        store = TestBed.get(Store) as MockStore<AppState>;
        service = TestBed.get(NavigationService);
        service.visibleRoutes = visibleRoutes;
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'basicinfo',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': false,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': false
        },
            dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
        mockRouter.navigate.calls.reset();
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('setPhonePageFlag() sets phone number availability', () => {
        service.setPhonePageFlag(true);
        expect(service.phoneSetOnPhonePage).toBe(true);
    });
    it('redirects to kodecline if error code is 603', () => {
        store.setState({
            lead: fromStore.initialState,
            error: { code: '603', message: '' }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['kodecline'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('redirects to contactus if error code is 651130', () => {
        store.setState({
            lead: fromStore.initialState,
            error: { code: '651130', message: '' }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['contactus'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('redirects to personaldataalert if error code is 651130', () => {
        store.setState({
            lead: fromStore.initialState,
            error: { code: '651600', message: '' }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['personaldataalert'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });

    it(`time out modal should be shown if the result is not 'success' and error happens less than 4 times in row`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: 'http://bindable.com',
                    redirectLead: true,
                    result: 'error'
                }
            },
            error: { code: '651600', message: '' }
        });
        service.navigate();
        expect(dialogSpy).toHaveBeenCalledWith(TimeoutModalComponent, {
            data: { code: '651600', message: '' },
            panelClass: 'custom-timeout-modal'
        });
    }));
    it(`time out modal should be shown if the result is 'success' and there is no redict url`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: '',
                    redirectLead: true,
                    result: 'success'
                }
            },
            error: { code: '651600', message: '' }
        });
        service.navigate();
        expect(dialogSpy).toHaveBeenCalledWith(TimeoutModalComponent, {
            data: { code: '651600', message: '' },
            panelClass: 'custom-timeout-modal'
        });
    }));
    it(`if result is not 'success' and error happens more than 3 times in row, redirected to personaldataalert`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: 'http://bindable.com',
                    redirectLead: true,
                    result: 'error'
                }
            },
            error: { code: '651600', message: '' }
        });
        service.navigate();
        service.navigate();
        service.navigate();
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['personaldataalert'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    }));
    it(`if result is not 'success' and error with code '651600' occurs more than 3 times in row, 
    redirected to personaldataalert`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: 'http://bindable.com',
                    redirectLead: true,
                    result: 'error'
                }
            },
            error: { code: '651600', message: '' }
        });
        service.navigate();
        service.navigate();
        service.navigate();
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['personaldataalert'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    }));
    it(`if result is not 'success' and error with code '603' occurs more than 3 times in row, 
    redirected to personaldataalert`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: 'http://bindable.com',
                    redirectLead: true,
                    result: 'error'
                }
            },
            error: { code: '603', message: '' }
        });
        service.navigate();
        service.navigate();
        service.navigate();
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['kodecline'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    }));
    it(`if result is not 'success' and error with code '602' occurs more than 3 times in row, 
    redirected to contactus`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: 'http://bindable.com',
                    redirectLead: true,
                    result: 'error'
                }
            },
            error: { code: '602', message: '' }
        });
        service.navigate();
        service.navigate();
        service.navigate();
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['contactus'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    }));
    it(`if redirectLead is false and error with code that doesn't match any defined error occurs less than 4 times in row,
    time out modal pop up will be displayed`, async(() => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                attribution: {
                    redirectURL: '',
                    redirectLead: false,
                    result: 'error'
                }
            },
            error: { code: '56546', message: '' }
        });
        service.navigate();
        service.navigate();
        service.navigate();
        expect(dialogSpy).toHaveBeenCalledWith(TimeoutModalComponent, {
            data: { code: '56546', message: '' },
            panelClass: 'custom-timeout-modal'
        });
    }));
    it('navigate() method takes to contactinfo page from basicinfo ', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['contactinfo'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() method takes to phone page from policystartdate if there is no phone number existed', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'policystartdate',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['phone'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() method takes to policyreview page from policystartdate if there is phone number existed', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'policystartdate',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738'
            },
            error: { code: '', message: '' }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['policyreview'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('saveLeadAndNavigate() method takes to policyreview page from policystartdate if there is phone number existed', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'policystartdate',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738'
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.saveLeadAndNavigate(new Subject());
        expect(mockRouter.navigate).toHaveBeenCalledWith(['policyreview'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('saveLeadAndGoToUrl() method redirects to URL', () => {
        const navigateToUrlSpy = spyOn(service, 'gotoUrl');
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'policystartdate',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738'
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.saveLeadAndGoToUrl('https://bindable.com', new Subject());
        expect(navigateToUrlSpy).toHaveBeenCalledWith('https://bindable.com');
    });
    it('navigate() method skips pricechange page if premiumChangeIndicator is false', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'uploadfile/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.saveLeadAndNavigate(new Subject());
        expect(mockRouter.navigate).toHaveBeenCalledWith(['finalprice'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('isVinSkippable() method should return false if there are no non adpf included vehicle', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        expect(service.isVinSkippable()).toBe(false);
    });
    it('isVinSkippable() method should return true if there ais/are non adpf included vehicle', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quickQuote: {
                    ...lead.quickQuote,
                    vehicles: [
                        {
                            'vehicleID': '00Q29000007Wsx5EAC-1',
                            'isIncluded': true,
                            'isADPF': true,
                            'isQuoteVehicle': true,
                            'isAlreadyIncluded': true,
                            'isVisible': true,
                            'year': 2018,
                            'make': 'BMW',
                            'model': '320',
                            'trim': 'I 4DR SEDAN AUTOMATIC',
                            'bodyStyleCode': 'SD',
                            'bodyStyle': 'SEDAN',
                            'stubbedVIN': 'WBA8A9C5*J*******',
                            'vinPrefix': 'WBA8A9C5*J*******',
                            'isStubbedVin': true,
                            'vin': 'WBA8A9C5*J*******',
                            'iconExisted': true,
                            'publicID': 'pc:246016',
                            'registeredState': 'PA',
                            'registeredOwner': 'John Papa',
                            'primaryUse': 'Commuting to Work or School',
                            'primaryUseCode': 'commuting',
                            'usedInRideSharing': false,
                            'rideShare': 'No',
                            'afterMarketDevice': 'No',
                            'passiveAlarm': 'No',
                            'commuteNYNJ': 'No',
                            'commutetoNYNJ': 'No',
                            'garagedAt': {
                                'publicID': 'pc:268902',
                                'addressLine1': '347 Oliver St',
                                'city': 'JERSEY SHORE',
                                'state': 'PA',
                                'postalCode': '17740',
                                'country': 'US',
                                'isAddressVerified': true
                            },
                            'garagingAddress': 'Residential',
                            'titleHolder': 'PaidFor',
                            'leaseOrRent': false,
                            'owned': true,
                            'additionalInterests': [
                            ]
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        expect(service.isVinSkippable()).toBe(true);
    });
    it('makeChangesOnRouteNav() method should set currentRouteObj', () => {
        service.currentRoute = 'contactinfo';
        const routeObj = {
            'referringURL': '',
            'routeName': 'contactinfo',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': false,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': false
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.makeChangesOnRouteNav();
        expect(service.currentRouteObj).toEqual(routeObj);
    });
    it('isPriceChangeSkippable() should return true if premiumChangeIndicator is false', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        expect(service.isPriceChangeSkippable()).toBe(true);
    });
    it('isRelationshipPageSkippable() should return false if there are some non PNI included drivers', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        expect(service.isRelationshipPageSkippable()).toBe(false);
    });
    it('isDocverifySkippable() should return false if there are documenst to verify', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        expect(service.isDocverifySkippable()).toBe(false);
    });
    it('isBillingAddrSkippable() should return true if updatePayerInfoAddress is true', () => {
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        expect(service.isBillingAddrSkippable()).toBe(false);
    });
    it('proceedOnSuccess() navigates to specified URL if there is no valid next route', () => {
        const navigateToUrlSpy = spyOn(service, 'gotoUrl');
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'uploadfile/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.proceedOnSuccess('', 'https://account.verti.com');
        expect(navigateToUrlSpy).toHaveBeenCalledWith('https://account.verti.com');
    });
    it('navigate() skips previous address screen if time at current residence is greater than 2 months', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'homeaddress',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['eligibilityquestionone'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() skips relationship page if there are no non adpf drivers', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'driversummary',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    'drivers': [
                        {
                            'driverID': '00Q29000007Wsx5EAC-1',
                            'firstName': 'John',
                            'lastName': 'Papa',
                            'genderCode': 'M',
                            'genderValue': 'Male',
                            'age': 32,
                            'dateOfBirth': {
                                'year': 1987,
                                'month': 12,
                                'day': 12
                            },
                            'isIncluded': true,
                            'isPNI': true,
                            'maritalStatusCode': 'S',
                            'maritalStatusValue': 'Single',
                            'isADPF': false,
                            'isVisible': true,
                            'accidentsAndViolations': [
                            ],
                            'noOfAccidentsAndViolations': {
                                'noOfMovingViolations': 'none',
                                'noOfAtFaultAccidents': 'none',
                                'noOfNotAtFaultAccidents': 'none',
                                'noOfComprehensiveClaims': 'none'
                            },
                            'relationshipCode': '',
                            'relationshipValue': '',
                            'licenseState': 'PA',
                            'yearsLicensed': 'LessThan6Months',
                            'isQuoteDriver': true,
                            'licenseStatus': 'ValidLicense',
                            'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                            'yearsLicensedValue': 'Less than 6 months',
                            'person': {
                                'publicID': 'pc:193067'
                            },
                            'publicID': 'pc:447795'
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['quickquote'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() skips sni page if there are no non adpf drivers with valid license', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'licenseinfoprerc/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    'drivers': [
                        {
                            'driverID': '00Q29000007Wsx5EAC-1',
                            'firstName': 'John',
                            'lastName': 'Papa',
                            'genderCode': 'M',
                            'genderValue': 'Male',
                            'age': 32,
                            'dateOfBirth': {
                                'year': 1987,
                                'month': 12,
                                'day': 12
                            },
                            'isIncluded': true,
                            'isPNI': true,
                            'maritalStatusCode': 'S',
                            'maritalStatusValue': 'Single',
                            'isADPF': false,
                            'isVisible': true,
                            'accidentsAndViolations': [
                            ],
                            'noOfAccidentsAndViolations': {
                                'noOfMovingViolations': 'none',
                                'noOfAtFaultAccidents': 'none',
                                'noOfNotAtFaultAccidents': 'none',
                                'noOfComprehensiveClaims': 'none'
                            },
                            'relationshipCode': '',
                            'relationshipValue': '',
                            'licenseState': 'PA',
                            'yearsLicensed': 'LessThan6Months',
                            'isQuoteDriver': true,
                            'licenseStatus': 'ValidLicense',
                            'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                            'yearsLicensedValue': 'Less than 6 months',
                            'person': {
                                'publicID': 'pc:193067'
                            },
                            'publicID': 'pc:447795'
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['vin/true'], {
            replaceUrl: false,
            queryParamsHandling: 'merge'
        });
    });
    it('navigateBack() skips previous address screen if time at current residence is greater than 2 months', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'eligibilityquestionone',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                phoneNumber: '5557334738',
                quote: {
                    ...lead.quote,
                    premiumChangeIndicator: false,
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['homeaddress'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigateBack() skips relationship page if there are no non adpf drivers', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'quickquote',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    'drivers': [
                        {
                            'driverID': '00Q29000007Wsx5EAC-1',
                            'firstName': 'John',
                            'lastName': 'Papa',
                            'genderCode': 'M',
                            'genderValue': 'Male',
                            'age': 32,
                            'dateOfBirth': {
                                'year': 1987,
                                'month': 12,
                                'day': 12
                            },
                            'isIncluded': true,
                            'isPNI': true,
                            'maritalStatusCode': 'S',
                            'maritalStatusValue': 'Single',
                            'isADPF': false,
                            'isVisible': true,
                            'accidentsAndViolations': [
                            ],
                            'noOfAccidentsAndViolations': {
                                'noOfMovingViolations': 'none',
                                'noOfAtFaultAccidents': 'none',
                                'noOfNotAtFaultAccidents': 'none',
                                'noOfComprehensiveClaims': 'none'
                            },
                            'relationshipCode': '',
                            'relationshipValue': '',
                            'licenseState': 'PA',
                            'yearsLicensed': 'LessThan6Months',
                            'isQuoteDriver': true,
                            'licenseStatus': 'ValidLicense',
                            'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                            'yearsLicensedValue': 'Less than 6 months',
                            'person': {
                                'publicID': 'pc:193067'
                            },
                            'publicID': 'pc:447795'
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['driversummary'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigateBack() skips sni page if there are no non adpf drivers with valid license', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'vin/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
            'isCTAEnabled': true
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    'drivers': [
                        {
                            'driverID': '00Q29000007Wsx5EAC-1',
                            'firstName': 'John',
                            'lastName': 'Papa',
                            'genderCode': 'M',
                            'genderValue': 'Male',
                            'age': 32,
                            'dateOfBirth': {
                                'year': 1987,
                                'month': 12,
                                'day': 12
                            },
                            'isIncluded': true,
                            'isPNI': true,
                            'maritalStatusCode': 'S',
                            'maritalStatusValue': 'Single',
                            'isADPF': false,
                            'isVisible': true,
                            'accidentsAndViolations': [
                            ],
                            'noOfAccidentsAndViolations': {
                                'noOfMovingViolations': 'none',
                                'noOfAtFaultAccidents': 'none',
                                'noOfNotAtFaultAccidents': 'none',
                                'noOfComprehensiveClaims': 'none'
                            },
                            'relationshipCode': '',
                            'relationshipValue': '',
                            'licenseState': 'PA',
                            'yearsLicensed': 'LessThan6Months',
                            'isQuoteDriver': true,
                            'licenseStatus': 'ValidLicense',
                            'licenseStatusValue': `Has a valid driver's license and drives listed vehicle(s)`,
                            'yearsLicensedValue': 'Less than 6 months',
                            'person': {
                                'publicID': 'pc:193067'
                            },
                            'publicID': 'pc:447795'
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['licenseinfoprerc/00Q29000007Wsx5EAC-1'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() skips verify docs page and upload docs page if there are no documents to verify', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'titleholder-contact/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quote: {
                    ...lead.quote,
                    verificationDocuments: []
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['pricechange'], {
            queryParamsHandling: 'merge',
            replaceUrl: false
        });
    });
    it('navigateBack() skips verify docs page and upload docs page if there are no documents to verify', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'pricechange',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quote: {
                    ...lead.quote,
                    verificationDocuments: []
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['vin/false'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() skips billing Address page if there is updatePayerInfoAddress falg is true', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'payer',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quote: {
                    ...lead.quote,
                    updatePayerInfoAddress: true
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['pay'], {
            queryParamsHandling: 'merge',
            replaceUrl: false
        });
    });
    it('navigateBack() skips billing Address page if there is updatePayerInfoAddress falg is true', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'pay',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quote: {
                    ...lead.quote,
                    updatePayerInfoAddress: true
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['payer'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigateBack() skips payment confirm, payment status, and pay pages', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'paymentsuccess',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['billingaddress'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() skips vin page if there are no non adpf vehicles', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'snicontact/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    vehicles: [
                        {
                            'vehicleID': '00Q29000007Wsx5EAC-1',
                            'isIncluded': true,
                            'isADPF': true,
                            'isQuoteVehicle': true,
                            'isAlreadyIncluded': true,
                            'isVisible': true,
                            'year': 2018,
                            'make': 'BMW',
                            'model': '320',
                            'trim': 'I 4DR SEDAN AUTOMATIC',
                            'bodyStyleCode': 'SD',
                            'bodyStyle': 'SEDAN',
                            'stubbedVIN': 'WBA8A9C5*J*******',
                            'vinPrefix': 'WBA8A9C5*J*******',
                            'isStubbedVin': true,
                            'vin': 'WBA8A9C5*J*******',
                            'iconExisted': true,
                            'publicID': 'pc:246016',
                            'registeredState': 'PA',
                            'registeredOwner': 'John Papa',
                            'primaryUse': 'Commuting to Work or School',
                            'primaryUseCode': 'commuting',
                            'usedInRideSharing': false,
                            'rideShare': 'No',
                            'afterMarketDevice': 'No',
                            'passiveAlarm': 'No',
                            'commuteNYNJ': 'No',
                            'commutetoNYNJ': 'No',
                            'garagedAt': {
                                'publicID': 'pc:268902',
                                'addressLine1': '347 Oliver St',
                                'city': 'JERSEY SHORE',
                                'state': 'PA',
                                'postalCode': '17740',
                                'country': 'US',
                                'isAddressVerified': true
                            },
                            'garagingAddress': 'Residential',
                            'titleHolder': 'PaidFor',
                            'leaseOrRent': false,
                            'owned': true,
                            'additionalInterests': [
                            ]
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['vehicledamage'], {
            queryParamsHandling: 'merge',
            replaceUrl: false
        });
    });

    it('navigate() skips post rc vin page if there are no adpf vehicles', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'licenseinfopostrc/:id',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    vehicles: [
                        {
                            'vehicleID': '00Q29000007Wsx5EAC-1',
                            'isIncluded': true,
                            'isADPF': true,
                            'isQuoteVehicle': true,
                            'isAlreadyIncluded': true,
                            'isVisible': true,
                            'year': 2018,
                            'make': 'BMW',
                            'model': '320',
                            'trim': 'I 4DR SEDAN AUTOMATIC',
                            'bodyStyleCode': 'SD',
                            'bodyStyle': 'SEDAN',
                            'stubbedVIN': 'WBA8A9C5*J*******',
                            'vinPrefix': 'WBA8A9C5*J*******',
                            'isStubbedVin': true,
                            'vin': 'WBA8A9C5*J*******',
                            'iconExisted': true,
                            'publicID': 'pc:246016',
                            'registeredState': 'PA',
                            'registeredOwner': 'John Papa',
                            'primaryUse': 'Commuting to Work or School',
                            'primaryUseCode': 'commuting',
                            'usedInRideSharing': false,
                            'rideShare': 'No',
                            'afterMarketDevice': 'No',
                            'passiveAlarm': 'No',
                            'commuteNYNJ': 'No',
                            'commutetoNYNJ': 'No',
                            'garagedAt': {
                                'publicID': 'pc:268902',
                                'addressLine1': '347 Oliver St',
                                'city': 'JERSEY SHORE',
                                'state': 'PA',
                                'postalCode': '17740',
                                'country': 'US',
                                'isAddressVerified': true
                            },
                            'garagingAddress': 'Residential',
                            'titleHolder': 'PaidFor',
                            'leaseOrRent': false,
                            'owned': true,
                            'additionalInterests': [
                            ]
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['docverify'], {
            queryParamsHandling: 'merge',
            replaceUrl: false
        });
    });
    it('navigateBack() skips post rc vin page if there are no adpf vehicles', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'docverify',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead,
                quickQuote: {
                    ...lead.quickQuote,
                    vehicles: [
                        {
                            'vehicleID': '00Q29000007Wsx5EAC-1',
                            'isIncluded': true,
                            'isADPF': true,
                            'isQuoteVehicle': true,
                            'isAlreadyIncluded': true,
                            'isVisible': true,
                            'year': 2018,
                            'make': 'BMW',
                            'model': '320',
                            'trim': 'I 4DR SEDAN AUTOMATIC',
                            'bodyStyleCode': 'SD',
                            'bodyStyle': 'SEDAN',
                            'stubbedVIN': 'WBA8A9C5*J*******',
                            'vinPrefix': 'WBA8A9C5*J*******',
                            'isStubbedVin': true,
                            'vin': 'WBA8A9C5*J*******',
                            'iconExisted': true,
                            'publicID': 'pc:246016',
                            'registeredState': 'PA',
                            'registeredOwner': 'John Papa',
                            'primaryUse': 'Commuting to Work or School',
                            'primaryUseCode': 'commuting',
                            'usedInRideSharing': false,
                            'rideShare': 'No',
                            'afterMarketDevice': 'No',
                            'passiveAlarm': 'No',
                            'commuteNYNJ': 'No',
                            'commutetoNYNJ': 'No',
                            'garagedAt': {
                                'publicID': 'pc:268902',
                                'addressLine1': '347 Oliver St',
                                'city': 'JERSEY SHORE',
                                'state': 'PA',
                                'postalCode': '17740',
                                'country': 'US',
                                'isAddressVerified': true
                            },
                            'garagingAddress': 'Residential',
                            'titleHolder': 'PaidFor',
                            'leaseOrRent': false,
                            'owned': true,
                            'additionalInterests': [
                            ]
                        }
                    ]
                }
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });

        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['licenseinfopostrc/00Q29000007Wsx5EAC-2'], {
            queryParamsHandling: 'merge'
        });
    });
    it('navigate() takes to relationship page for first non adpf driver from driver summary', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'driversummary',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });
        service.navigate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['relationship/00Q29000007Wsx5EAC-2'], {
            queryParamsHandling: 'merge',
            replaceUrl: false
        });
    });
    it('navigateBack() takes relationship page for last non adpf driver from quickquote', () => {
        service.currentRouteObj = {
            'referringURL': '',
            'routeName': 'quickquote',
            'visible': true,
            'preFill': true,
            'generateQuickQuotePrice': false,
            'rateQuote': true,
            'finalizeQuote': false,
            'updatePaymentPlan': false,
            'evo': false,
            'replaceUrl': false,
            'validateDriver': false,
            'validateRules': true,
        };
        store.setState({
            lead:
            {
                ...fromStore.initialState,
                ...lead
            },
            error: { code: '', message: '' },
            loader: {
                isloading: false
            }
        });

        service.navigateBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['relationship/00Q29000007Wsx5EAC-2'], {
            queryParamsHandling: 'merge'
        });
    });
});
