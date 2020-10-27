import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadLandingComponent } from './lead-landing.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddressPipe } from '@shared/pipes/address.pipe';
import * as fromStore from '@app/store/reducers/lead.reducers';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
const LESS_THAN_6_MONTHS = 'Less than 6 months';
const VIN_MASK = 'WBA8A9C5*J*******';
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
  'phoneNumber': '5557894324',
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
        'yearsLicensedValue': LESS_THAN_6_MONTHS,
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
        'yearsLicensedValue': LESS_THAN_6_MONTHS,
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
        'yearsLicensedValue': LESS_THAN_6_MONTHS,
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
        'stubbedVIN': VIN_MASK,
        'vinPrefix': VIN_MASK,
        'isStubbedVin': true,
        'vin': VIN_MASK,
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
let store: MockStore<AppState>;
let navService: NavigationService;
describe('LeadLandingComponent', () => {
  let component: LeadLandingComponent;
  let fixture: ComponentFixture<LeadLandingComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadLandingComponent, AddressPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AddressPipe, NavigationService,
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialogRef },
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LeadLandingComponent);
    store = TestBed.get(Store) as MockStore<AppState>;
    navService = TestBed.get(NavigationService);
    navService.visibleRoutes = visibleRoutes;
    navService.currentRouteObj = {
      'referringURL': '',
      'routeName': 'leadlanding',
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
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    store.setState({
      lead: {
        initialState, ...lead
      }
    });
    fixture.detectChanges();
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
  it('goToBasicInfo() takes to basicinfo page', () => {
    component.goToBasicInfo();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['basicinfo'], {
      replaceUrl: false,
      queryParamsHandling: 'merge'
    });
  });
  it('formatPhoneNumber() takes to basicinfo page', () => {
    expect(component.formatPhoneNumber('4556645645')).toBe('455-664-5645');
  });
  it('continue() takes to maritalstatus page', () => {
    store.setState({
      lead: {
        initialState, ...lead
      }, error: { code: '', message: '' },
      loader: {
        isloading: false
      }
    });
    fixture.detectChanges();
    component.continue();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['maritalstatus'], {
      replaceUrl: false,
      queryParamsHandling: 'merge'
    });
  });
  it('if phoneNumber is empty then phoneNum of component is empty', () => {
    store.setState({
      lead: {
        initialState, ...lead,
        phoneNumber: ''
      }
    });
    fixture.detectChanges();
    expect(component.phoneNum).toBe('');
  });
});
