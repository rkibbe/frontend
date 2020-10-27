import { createSelector } from '@ngrx/store';
import { LeadActionsUnion, LeadActionTypes } from '../actions/lead.actions';
import { Lead, Quote, TitleHolder } from '../models/lead.model';

export type Action = LeadActionsUnion;
export const initialState = {
    leadID: null,
    publicID: null,
    sessionUUID: null,
    genderCode: '',
    genderValue: '',
    maritalStatusCode: '',
    maritalStatusValue: '',
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
    phoneNumberType: 'Mobile',
    insuranceType: 'auto',
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

export function leadReducer(state = initialState, action: Action) {
    switch (action.type) {
        case LeadActionTypes.SAVE_PNI:
            return saveDetails(state, action.payload);
        case LeadActionTypes.ADD_DRIVER:
            return {
                ...state,
                quickQuote: {
                    ...state.quickQuote,
                    drivers: [...state.quickQuote.drivers, action.payload]
                }
            };

        case LeadActionTypes.UPDATE_DRIVER:
            return updateDriver(state, action.payload);

        case LeadActionTypes.ADD_VEHICLE:
            return {
                ...state,
                quickQuote: {
                    ...state.quickQuote,
                    vehicles: [...state.quickQuote.vehicles, action.payload]
                }
            };

        case LeadActionTypes.UPDATE_VEHICLE:
            return updateVehicle(state, action.payload);

        case LeadActionTypes.UPDATE_ALL_VEHICLES:
            return updateAllVehicles(state, action.payload);

        case LeadActionTypes.DELETE_INCOMPLETE_DRIVER:
            return deleteIncomplteDriver(state);

        case LeadActionTypes.DELETE_INCOMPLETE_VEHICLE:
            return deleteIncomplteVehicle(state);

        case LeadActionTypes.POST_LEAD_SUCCESS:
            return createLead(state, action.payload);

        case LeadActionTypes.SAVE_QUOTE:
            return saveQuote(state, action.payload);

        case LeadActionTypes.SAVE_MARKETING_DATA:
            return saveMarketingData(state, action.payload);

        case LeadActionTypes.UPDATE_GENERATE_QUICK_QUOTE_PRICE_FLAG:
            return updateGenerateQuickQuotePriceFlag(state, action.payload);
        case LeadActionTypes.ADD_SNI:
            return addSNI(state, action.payload);
        case LeadActionTypes.UPDATE_POLICY_START_DATE:
            return updatePolicyStartDate(state, action.payload);
        case LeadActionTypes.UPDATE_DOCUMENT_STATUS:
            return updateDocumentStatus(state, action.payload);

        case LeadActionTypes.ADD_INSURANCE_COVERAGE:
            return AddInsuranceCoverageInfo(state, action.payload);
        case LeadActionTypes.UPDATE_POLICY_COVERAGE:
            return updatePolicyCoverage(state, action.payload);
        case LeadActionTypes.UPDATE_CUSTOM_QUOTE:
            return updateCustomQuote(state, action.payload);

        default:
            return state;
    }
}
function AddInsuranceCoverageInfo(state, payload) {
    return updateQuote(state, payload);
}
function updateQuote(state, payload) {
    return {
        ...state,
        quote: {
            ...state.quote,
            ...payload
        }
    };
}
function saveDetails(state, payload) {
    return {
        ...state,
        ...state.lead,
        ...payload
    };
}
function addSNI(state, payload) {
    return {
        ...state,
        quickQuote: {
            ...state.quickQuote,
            ...payload
        }
    };
}
function updatePolicyStartDate(state, payload) {
    return {
        ...state,
        quickQuote: {
            ...state.quickQuote,
            periodStartDate: {
                ...state.quickQuote.periodStartDate,
                ...payload
            }
        }
    };
}
function updateDriver(state, payload) {
    const updatedDrivers = state.quickQuote.drivers.map(item => {
        if (item.driverID === payload.driverID) {
            return {
                ...item,
                ...payload
            };
        }
        return item;
    });

    const driversObj = {
        ...state.quickQuote.drivers,
        ...updatedDrivers
    };
    const driversArr = Object.keys(driversObj).map(k => driversObj[k]);
    return {
        ...state,
        quickQuote: {
            ...state.quickQuote,
            drivers: driversArr
        }
    };
}

function updateDocumentStatus(state, payload) {
    const updatedDocuments = state.quote.verificationDocuments.map((item, index) => {
        if (index === payload.pos) {
            delete payload.pos;
            return {
                ...item,
                ...payload
            };
        }
        return item;
    });

    const documentsObj = {
        ...state.quote.verificationDocuments,
        ...updatedDocuments
    };
    const docsArr = Object.keys(documentsObj).map(k => documentsObj[k]);
    return {
        ...state,
        quote: {
            ...state.quote,
            verificationDocuments: docsArr
        }
    };
}

function updateVehicle(state, payload) {
    const updatedVehicles = state.quickQuote.vehicles.map(item => {
        if (item.vehicleID === payload.vehicleID) {
            return {
                ...item,
                ...payload
            };
        }
        return item;
    });

    const vehiclesObj = {
        ...state.quickQuote.vehicles,
        ...updatedVehicles
    };
    const vehiclesArr = Object.keys(vehiclesObj).map(k => vehiclesObj[k]);
    return {
        ...state,
        quickQuote: {
            ...state.quickQuote,
            vehicles: vehiclesArr
        }
    };
}

function updateAllVehicles(state, payload) {
    const updatedVehicles = state.quickQuote.vehicles.map(item => {
        const foundIndex = payload.findIndex(x => x.vehicleID === item.vehicleID);
        if (foundIndex !== -1) {
            return {
                ...item,
                ...payload[foundIndex]
            };
        } else {
            return item;
        }
    });

    const vehiclesObj = {
        ...state.quickQuote.vehicles,
        ...updatedVehicles
    };
    const vehiclesArr = Object.keys(vehiclesObj).map(k => vehiclesObj[k]);
    return {
        ...state,
        quickQuote: {
            ...state.quickQuote,
            vehicles: vehiclesArr
        }
    };
}

function createLead(state, payload) {
    return {
        ...state,
        ...payload.lead
    };
}

function addDriver(state, payload) {
    return {
        drivers: [state.drivers, payload]
    };
}

function addVehicle(state, payload) {
    return {
        vehicles: [state.vehicles, payload]
    };
}

function deleteIncomplteDriver(state) {
    const index = state.quickQuote.drivers.findIndex(driver => !driver.isADPF && driver.isAlreadyIncluded === false);
    if (index > -1) {
        state.quickQuote.drivers.splice(index, 1);
        return {
            ...state,
            quickQuote: {
                ...state.quickQuote,
                drivers: state.quickQuote.drivers
            }
        };
    } else {
        return state;
    }
}

function deleteIncomplteVehicle(state) {
    const index = state.quickQuote.vehicles.findIndex(
        vehicle => !vehicle.isADPF && vehicle.isAlreadyIncluded === false
    );
    if (index > -1) {
        state.quickQuote.vehicles.splice(index, 1);
        return {
            ...state,
            quickQuote: {
                ...state.quickQuote,
                vehicles: state.quickQuote.vehicles
            }
        };
    } else {
        return state;
    }
}

function saveQuote(state, payload) {
    return updateQuote(state, payload);
}
export function saveMarketingData(state, payload) {
    return {
        ...state,
        marketingData: {
            ...state.marketingData,
            ...payload
        }
    };
}
export function updateGenerateQuickQuotePriceFlag(state, payload) {
    return {
        ...state,
        ...payload
    };
}

function updatePolicyCoverage(state, payload) {
    const coverageObj = payload.payload;

    return {
        ...state,
        quote: {
            ...state.quote,
            policyCoverage: {
                ...state.quote.policyCoverage,
                ...coverageObj
            }
        }
    };
}

function updateCustomQuote(state, payload) {
    return {
        ...state,
        quote: {
            ...state.quote,
            customQuote: {
                ...state.quote.customQuote,
                ...payload
            }
        }
    };
}

export const leadSelector = appState => appState.lead;
export const primaryAddress = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.primaryAddress
);
export const priorAddress = createSelector(
    leadSelector,
    (leadState: Lead) => {
        if (leadState.priorAddress) {
            return leadState.priorAddress;
        }
    }
);
export const quickQuoteSelector = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.quickQuote
);
export const quoteSelector = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.quote
);
export const attributionSelector = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.attribution
);
export const verifyDocSelector = createSelector(
    quoteSelector,
    (quoteState: Quote) => quoteState.verificationDocuments
);
export const quoteSummary = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.quoteSummary
);
export const drivers = createSelector(
    leadSelector,
    (leadState: Lead) => {
        if (leadState.quickQuote && leadState.quickQuote.drivers) {
            return leadState.quickQuote.drivers;
        }
    }
);
export const driverCount = createSelector(
    quickQuoteSelector,
    quickQuote => quickQuote.drivers.length
);
export const selectedDriver = driverId =>
    createSelector(
        quickQuoteSelector,
        quote => quote.drivers.filter(item => item.driverID === driverId)
    );
export const includedDrivers = createSelector(
    drivers,
    driverList => driverList.filter(item => item.isIncluded === true)
);

export const vehicles = createSelector(
    leadSelector,
    (leadState: Lead) => {
        if (leadState.quickQuote && leadState.quickQuote.vehicles) {
            return leadState.quickQuote.vehicles;
        }
    }
);

export const vehicleCount = createSelector(
    quickQuoteSelector,
    quickQuote => quickQuote.vehicles.length
);
export const selectedVehicle = vehicleId =>
    createSelector(
        quickQuoteSelector,
        quote => quote.vehicles.filter(item => item.vehicleID === vehicleId)
    );
export const isQuoteCreatedSelector = createSelector(
    quoteSelector,
    quote => !!quote.quoteNumber
);
export const includedVehicles = createSelector(
    vehicles,
    vehicleList => vehicleList.filter(item => item.isIncluded === true)
);
export const includedLoanLeasedVehicles = createSelector(
    includedVehicles,
    vehicleList =>
        vehicleList.filter(item => item.titleHolder === TitleHolder.LOAN || item.titleHolder === TitleHolder.LEASE)
);
export const pniMaritalStatus = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.maritalStatusCode
);
export const leadID = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.leadID
);
export const marketingData = createSelector(
    leadSelector,
    (leadState: Lead) => leadState.marketingData
);
export const sni = createSelector(
    quickQuoteSelector,
    quickQuote => quickQuote.secondaryInsured
);
export const signFormsSelector = createSelector(
    quoteSelector,
    quote => quote.signForms
);
