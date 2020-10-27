import {
    leadReducer,
    initialState,
    leadSelector,
    primaryAddress,
    quickQuoteSelector,
    priorAddress,
    quoteSelector,
    attributionSelector,
    includedLoanLeasedVehicles,
    marketingData,
    signFormsSelector,
    drivers
} from './lead.reducers';
import {
    SavePNIData,
    AddDriver,
    UpdateDriver,
    AddVehicle,
    UpdateVehicle,
    SaveQuote,
    SaveMarketingData,
    UpdateGenerateQuickQuotePriceFlag,
    UpdatePolicyStartDateAction,
    UpdateAllVehicles,
    DeleteIncompleteDriver,
    DeleteIncompleteVehicle,
    PostLeadSuccessAction,
    AddSNIAction,
    UpdateDocumentStatusAction,
    AddInsuranceCoverageInfo,
    UpdatePolicyCoverage,
    UpdateCustomQuoteAction
} from '../actions/lead.actions';
import { Vehicle, LicenseYears, LicenseStatus, TitleHolder, Sni } from '../models/lead.model';
import { Driver } from 'selenium-webdriver/safari';

const leadData = {
    leadID: null,
    publicID: null,
    sessionUUID: null,
    genderCode: '',
    genderValue: '',
    maritalStatusCode: '',
    maritalStatusValue: '',
    // attribution:{
    //     redirectURL: 'string',
    //     redirectLead: false,
    //     result: 'string',
    // },
    primaryAddress: {
        publicID: null,
        addressLine1: '',
        addressLine2: null,
        cantFindAddress: false,
        city: '',
        state: '',
        zipCode: '',
        county: '',
        country: '',
        // timeAtCurrentResidenceExt: '',
        timeAtCurrentResidenceCode: '',
        timeAtCurrentResidenceValue: '',
        isAddressVerified: false
    },
    priorAddress: {
        publicID: null,
        addressLine1: '',
        addressLine2: null,
        cantFindAddress: false,
        city: '',
        state: '',
        zipCode: '',
        county: '',
        country: '',
        isAddressVerified: false
    },
    phoneNumberType: 'Mobile',
    insuranceType: 'auto',
    primaryEmailAddress: '',
    phoneNumber: '',
    quickQuote: {
        quickQuoteNumber: null,
        drivers: [],
        vehicles: [],
        periodStartDate: {
            year: '',
            month: '',
            day: ''
        },
        periodEndDate: {
            year: '',
            month: '',
            day: ''
        },
        monthlyPremiumPrice: null,
        fullTermPremiumPrice: null,
        policyTerm: '',
        whatToDo: {
            eligible: '',
            referToPA: '',
            knockOut: ''
        },
        quoteStatus: null,
        recordStatus: {
            statusCode: '',
            statusMessage: ''
        },
        secondaryInsured: {
            driverID: null,
            email: null,
            phone: null,
            isSNISelected: null
        }
    },
    quote: {
        quoteNumber: null,
        quoteStatus: null,
        isADPFQuote: false,
        // signForms: {
        // description: 'string',
        // documentID: 'string',
        // formNumber: 'string',
        // formStatus: 'string',
        // name: 'string'
        // },
        eligibilityAnswers: {
            ineligibleVehicle: '',
            majorViolations: '',
            licenseRevoked: ''
        },
        currentInsuranceInfo: {
            currentInsurance: null,
            lastActiveInsurance: '',
            yearsInsured: '',
            bILimits: '',
            bILimitsValue: ''
        },
        policyCoverage: {
            bILimit: '',
            uIMBILimit: '',
            uMBILimit: '',
            pDLimit: ''
        }
    },
    marketingData: {
        campaignID: null,
        leadSource: null,
        currentURL: null,
        referringURL: null,
        zipCode: null,
        mbsy: null
    },
    generateQuickQuotePrice: false,
    rateQuote: false,
    finalizeQuote: false,
    updatePaymentPlan: false,
    evo: false
};

const mockDriver = [
    {
        driverID: '00Q2900066007WiX0EAK-1',
        genderImg: 'string',
        licenseNumber: '65656565',
        firstName: 'Kavink',
        lastName: 'Sdfsddfsddsf',
        genderCode: 'F',
        genderValue: 'Male',
        age: '11',
        dateOfBirth: { year: 2009, month: 2, day: 13 },
        isIncluded: true,
        isPNI: true,
        maritalStatusCode: 'F',
        maritalStatusValue: 'Married',
        isADPF: false,
        isVisible: true,
        ownInsuranceApprovedExt: true,
        recordStatus: {
            statusCode: 45445,
            statusDescrition: 'string'
        },
        accidentsAndViolations: {
            accidentsAndViolationsId: 'string',
            violationCode: 'string',
            incidentType: 'string',
            incidentDate: {
                year: 2009,
                month: 5,
                day: 5
            },
            recordStatus: {
                statusCode: 45445,
                statusDescrition: 'string'
            },
            error: {
                code: '6565',
                errorDescription: 'string'
            }
        },
        noOfAccidentsAndViolations: {
            noOfMovingViolations: 'none',
            noOfAtFaultAccidents: 'none',
            noOfNotAtFaultAccidents: 'none',
            noOfComprehensiveClaims: 'none'
        },
        relationshipCode: '',
        relationshipValue: '',
        licenseState: 'PA',
        yearsLicensed: LicenseYears.LessThanSixMonths,
        isQuoteDriver: true,
        licenseStatus: LicenseStatus.NeverLicensed,
        licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
        yearsLicensedValue: 'Less than 6 months',
        publicId: 'pc:447252',
        error: {
            code: '6565',
            errorDescription: 'string'
        }
    },
    {
        driverID: '00Q29000007WiX0EAK-1',
        genderImg: 'string',
        licenseNumber: '65656565',
        firstName: 'Kavink',
        lastName: 'Sdfsddfsddsf',
        genderCode: 'M',
        genderValue: 'Male',
        age: '11',
        dateOfBirth: { year: 2009, month: 2, day: 13 },
        isIncluded: true,
        isPNI: true,
        maritalStatusCode: 'M',
        maritalStatusValue: 'Married',
        isADPF: false,
        isVisible: true,
        ownInsuranceApprovedExt: true,
        recordStatus: {
            statusCode: 45445,
            statusDescrition: 'string'
        },
        accidentsAndViolations: {
            accidentsAndViolationsId: 'string',
            violationCode: 'string',
            incidentType: 'string',
            incidentDate: {
                year: 2009,
                month: 5,
                day: 5
            },
            recordStatus: {
                statusCode: 45445,
                statusDescrition: 'string'
            },
            error: {
                code: '6565',
                errorDescription: 'string'
            }
        },
        noOfAccidentsAndViolations: {
            noOfMovingViolations: 'none',
            noOfAtFaultAccidents: 'none',
            noOfNotAtFaultAccidents: 'none',
            noOfComprehensiveClaims: 'none'
        },
        relationshipCode: '',
        relationshipValue: '',
        licenseState: 'PA',
        yearsLicensed: LicenseYears.LessThanSixMonths,
        isQuoteDriver: true,
        licenseStatus: LicenseStatus.NeverLicensed,
        licenseStatusValue: " Has a valid driver's license and drives listed vehicle(s)",
        yearsLicensedValue: 'Less than 6 months',
        publicId: 'pc:447252',
        error: {
            code: '6565',
            errorDescription: 'string'
        }
    }
];
const mockVehicle = [
    {
        // vehicleId = leadId-1
        vehicleID: 'SSDDSDD55',
        publicId: 'string',
        year: 'string',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: 'string',
        bodyStyle: 'string',
        vinPrefix: 'string',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'string',
        stubbedVIN: 'string',
        isIncluded: true,
        isAlreadyIncluded: true,
        isADPF: true,
        isQuoteVehicle: true,
        recordStatus: {
            statusCode: 6776,
            statusDescrition: 'string'
        },
        error: {
            code: 'string',
            errorDescription: 'string'
        },
        unrepairDamage: true,
        leaseOrRent: true,
        owned: true,
        additionalInterests: [],
        titleHolder: TitleHolder.COMPANY,
        isVisible: true,
        isStubbedVin: true,
        compDeductible: 'string',
        compDisplayValue: 'string',
        selCodeComp: 'string',
        selValueComp: 'string',
        collDisplayValue: 'string',
        collDeductible: 'string',
        selValueColl: 'string',
        selCodeColl: 'string',
        displayRoadsideAssistance: true
    },
    {
        // vehicleId = leadId-1
        vehicleID: 'SSDDSDD55',
        publicId: 'string',
        year: 'string',
        make: '2009',
        model: 'CHAVROLET',
        trim: 'TRIM',
        vin: 'string',
        bodyStyle: 'string',
        vinPrefix: 'string',
        bodyStyleDesc: 'string',
        trimDesc: 'string',
        bodyStyleCode: 'string',
        stubbedVIN: 'string',
        isIncluded: true,
        isAlreadyIncluded: true,
        isADPF: true,
        isQuoteVehicle: true,
        recordStatus: {
            statusCode: 6776,
            statusDescrition: 'string'
        },
        error: {
            code: 'string',
            errorDescription: 'string'
        },
        unrepairDamage: true,
        leaseOrRent: true,
        owned: true,
        additionalInterests: [],
        titleHolder: TitleHolder.COMPANY,
        isVisible: true,
        isStubbedVin: true,
        compDeductible: 'string',
        compDisplayValue: 'string',
        selCodeComp: 'string',
        selValueComp: 'string',
        collDisplayValue: 'string',
        collDeductible: 'string',
        selValueColl: 'string',
        selCodeColl: 'string',
        displayRoadsideAssistance: true
    }
];
describe('lead reducer', () => {
    it('returns inital state for default action', () => {
        const action: any = {};
        expect(leadReducer(initialState, action)).toEqual(initialState);
    });
    it('returns save pni data action', () => {
        const action = new SavePNIData(leadData);
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });

    it('returns add driver action', () => {
        const action = new AddDriver(mockDriver);
        const state = leadReducer(initialState, action);
        expect(state.quickQuote.drivers).toEqual([mockDriver]);
    });
    it('returns add vehicle action', () => {
        const action = new AddVehicle(mockVehicle);
        const state = leadReducer(initialState, action);
        expect(state.quickQuote.vehicles).toEqual([mockVehicle]);
    });

    it('returns Save Quote action', () => {
        const action = new SaveQuote(leadData.quote);
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });
    it('returns Save Marketing Data action', () => {
        const action = new SaveMarketingData(leadData.marketingData);
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });
    it('returns Update Generate Quick Quote Price Flag action', () => {
        const action = new UpdateGenerateQuickQuotePriceFlag({
            rateQuote: false,
            finalizeQuote: false
        });
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });
    it('returns Update Policy Start Date Action action', () => {
        const periodStartDate = {
            year: '',
            month: '',
            day: ''
        };
        const action = new UpdatePolicyStartDateAction(periodStartDate);
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });
    it('returns Post Lead Success action', () => {
        const action = new PostLeadSuccessAction(leadData);
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });
    it('returns Add SNI action', () => {
        const sniContact: Sni = {
            driverID: null,
            email: null,
            phone: null,
            isSNISelected: null
        };
        const action = new AddSNIAction({ secondaryInsured: sniContact });
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });

    it('returns Add Insurance Coverage Info action', () => {
        const currentInsuranceInfo = {
            currentInsurance: null,
            lastActiveInsurance: '',
            yearsInsured: '',
            bILimits: '',
            bILimitsValue: ''
        };
        const action = new AddInsuranceCoverageInfo({
            currentInsuranceInfo
        });
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });
    it('returns Update Policy Coverage action', () => {
        const payload = {};
        const action = new UpdatePolicyCoverage({
            payload
        });
        const state = leadReducer(initialState, action);
        expect(state).toEqual(leadData);
    });

    // no expect
    it('returns Update All Vehicles action', () => {
        const action = new UpdateAllVehicles(mockVehicle);
        const state = leadReducer(initialState, action);
        console.log('update vehicles-------------', state.quickQuote.vehicles);
        // expect(state).toEqual(mockVehicle);
    });
    //
    it('returns update driver action', () => {
        const action = new UpdateDriver(mockDriver[0]);
        const state = leadReducer(initialState, action);
        // expect(state.quickQuote.drivers).toEqual([mockDriver]);
        console.log('update drivers-------------', state.quickQuote.drivers);
    });
    it('returns Delete Incomplete Driver action', () => {
        const action = new DeleteIncompleteDriver();
        const state = leadReducer(initialState, action);
        // expect(state).toEqual(mockDriver);
        console.log('DeleteIncompleteDriver -------------', state.quickQuote.drivers);
    });
    it('returns Delete Incomplete Vehicle action', () => {
        const action = new DeleteIncompleteVehicle();
        const state = leadReducer(initialState, action);
        // expect(state).toEqual(mockVehicle);
        console.log('DeleteIncompletevehicles -------------', state.quickQuote.vehicles);
    });
    it('returns update vehicle action', () => {
        const action = new UpdateVehicle({
            vehicleID: '12345',
            publicId: 'abcd',
            year: '2008'
        });
        const state = leadReducer(initialState, action);
        // expect(state.quickQuote.drivers).toEqual(mockVehicle);
        console.log('update vehicles-------------', state.quickQuote.vehicles);
    });
    // it('returns Update Document Status action', () => {
    //     const action = new UpdateDocumentStatusAction({
    //         pos: '',
    //         preview: '',
    //         fileType: '',
    //         uploadStatus: true
    //     });
    //     const state = leadReducer(initialState, action);
    //     console.log('state.quote.verificationDocuments', state.quote.verificationDocuments);
    //     // expect(state).toEqual(leadData);
    // });
    it('returns Update Custom Quote action', () => {
        const action = new UpdateCustomQuoteAction({
            isQuoteCustomized: false,
            fullQuote: true
        });
        const state = leadReducer(initialState, action);
        // expect(state).toEqual(leadData);
    });

    describe('lead selectors', () => {
        // it('should return quickQuoteSelector as undefined', () => {
        // expect(quickQuoteSelector.projector(undefined)).toBe(undefined);
        // });
        it('should return quickQuoteSelector', () => {
            expect(quickQuoteSelector.projector({ quickQuote: leadData.quickQuote })).toEqual(leadData.quickQuote);
        });
        // it('should return primaryAddress as undefined', () => {
        //     expect(primaryAddress.projector(undefined)).toEqual(undefined);
        // });
        it('should return primaryAddress ', () => {
            expect(primaryAddress.projector({ primaryAddress: leadData.primaryAddress })).toEqual(
                leadData.primaryAddress
            );
        });
        it('should return priorAddress undefined', () => {
            expect(priorAddress.projector({ lead: leadData.priorAddress })).toEqual(undefined);
        });
        it('should return priorAddress', () => {
            expect(priorAddress.projector({ priorAddress: leadData.priorAddress })).toEqual(leadData.priorAddress);
        });
        it('should return quoteSelector', () => {
            expect(quoteSelector.projector({ quote: leadData.quote })).toEqual(leadData.quote);
        });
        it('should return marketingData', () => {
            expect(marketingData.projector({ marketingData: leadData.marketingData })).toEqual(leadData.marketingData);
        });
        it('should return drivers', () => {
            expect(drivers.projector({ drivers: leadData.quickQuote.drivers })).toEqual(undefined);
        });
        // it('should return signFormsSelector', () => {
        //     expect(signFormsSelector.projector({ signForms: leadData.signForms })).toEqual(leadData.signForms);
        // });
        // it('should return attributionSelector as undefined', () => {
        //     expect(attributionSelector.projector({ attribution: leadData.attribution })).toEqual(leadData.attribution);
        // });
    });
});
