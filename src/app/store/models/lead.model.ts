export interface Lead {
    leadID: string;
    publicId: string;
    sessionUUID: string;
    firstName: string;
    lastName: string;
    primaryEmailAddress: string;
    dateOfBirth: DateOfBirth;
    genderCode: string;
    genderValue: string;
    maritalStatusCode: string;
    maritalStatusValue: string;
    primaryAddress: PrimaryAddress;
    priorAddress: PriorAddress;
    emailAddress: string;
    phoneNumber: string;
    quickQuote: QuickQuote;
    quote: Quote;
    marketingData: MarketingData;
    relationshipCode: string;
    relationshipValue: string;
    recordStatus: RecordStatus;
    error: Error;
    generateQuickQuotePrice: boolean;
    rateQuote: boolean;
    finalizeQuote: boolean;
    updatePaymentPlan: boolean;
    enterprisePartyID: string;
    quoteSummary: QuoteSummary[];
    vertimode: string;
    leadLandingScreen: string;
    attribution: Attribution;
    phoneNumberType: string;
    insuranceType: string;
}
export interface DateOfBirth {
    year: number;
    month: number;
    day: number;
}

export interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    county?: string;
    country?: string;
    manualAddress?: boolean;
    isAddressVerified?: boolean;
    isAutoComplete?: boolean;
}
export interface Attribution {
    redirectURL: string;
    redirectLead: boolean;
    result: string;
}
export interface PrimaryAddress {
    publicId?: string;
    displayName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    county: string;
    country: string;
    timeAtCurrentResidenceCode: string;
    timeAtCurrentResidenceValue: string;
    isAddressVerified: boolean;
    cantFindAddress: boolean;
    isAutoComplete?: boolean;
}

export interface PriorAddress {
    publicId?: string;
    displayName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    county: string;
    country: string;
    isAddressVerified: boolean;
    cantFindAddress: boolean;
    addressType: 'priorExt';
}

export interface EligibilityAnswers {
    ineligibleVehicle: string;
    majorViolations: string;
    licenseRevoked: string;
}
export interface Quote {
    quoteNumber: string;
    eligibilityAnswers: EligibilityAnswers;
    quoteStatus: string;
    recordStatus: RecordStatus;
    discounts: string[];
    savings: string;
    error: Error;
    isADPFQuote: boolean;
    signForms: SignForm[];
    changedFullPrice: string;
    changedMonthlyPrice: string;
    monthlyPremium: number;
    monthlyPremiumPriorFullQuote: number;
    fullPremium: number;
    premiumChangeIndicator: number;
    pIFSaving: number;
    formsSigned: boolean;
    mailingAddress: MailingAddress;
    updateMailingAddress: boolean;
    updateBillingAddress: boolean;
    updatePayerInfoAddress: boolean;
    payerInfoAddress: PayerInfo;
    verificationDocuments: Array<any>;
    billingAddress: BillingAddress;
    evoToken: EvoToken;
    paymentDetails: PaymentDetails;
    selectedPaymentPlan: string;
    currentInsuranceInfo: CurrentInsuranceInfo;
    policyCoverage: PolicyCoverage;
    customQuote: CustomQuote;
    nextPaymentDueDate: PaymentDueDate;
    signatureCertificates: SignatureCertificates;
    paymentPlans: ViewPorts;
}
export interface ViewPorts {
    desktop: PaymentPlan[];
    tablet: PaymentPlan[];
    mobile: PaymentPlan[];
}

export interface PaymentPlan {
    displayOrder: string;
    displaySize: string;
    dueToday: string;
    paymentSchedule: any[];
    planId: string;
    planName: string;
    textDescription: string;
    theme: string;
    totalAmt: string;
}
// export interface PaymentSchedule {
// }
export interface SignatureCertificates {
    ipAddress: string;
    viewedOnDateAndTime: string;
    signedOnDateAndTime: string;
    signedSource: string;
    latitude: string;
    longitude: string;
    formattedAddress: string;
}

export interface EvoToken {
    paymentGatewayClientURL: string;
    paymentToken: string;
}
export interface GetIpResponse {
    ip: string;
}
export interface PaymentDetails {
    cardNumber: string;
    name: string;
    cardType: string;
}
export interface PayerInfo {
    firstName: string;
    lastName: string;
    emailAddress1: string;
    cellNumber: string;
    primaryAddress: Address;
}

export interface MailingAddress {
    publicId: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    county: string;
    country: string;
    isAddressVerified: boolean;
}
export interface BillingAddress {
    publicId: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    county: string;
    country: string;
    isAddressVerified: boolean;
}
export interface SignForm {
    description: string;
    documentID: string;
    formNumber: string;
    formStatus: string;
    name: string;
}
export interface QuickQuote {
    quickQuoteNumber: string;
    drivers: Driver[];
    vehicles: Vehicle[];
    monthlyPremiumPrice: string;
    fullTermPremiumPrice: number;
    periodStartDate: PeriodStartDate;
    periodEndDate: PeriodEndDate;
    quickQuoteCreationDate: QuickQuoteCreationDate;
    policyTerm: string;
    quickQuoteStatus: string;
    quoteEligiblity: QuoteEligiblity;
    recordStatus: RecordStatus;
    error: Error;
    secondaryInsured: Sni;
    redirectRouteName: string;
    isQQAvailable: boolean;
}
export interface Sni {
    driverID: string;
    email: string;
    phone: string;
    isSNISelected: boolean;
}
export interface QuickQuoteCreationDate {
    year: number;
    month: number;
    day: number;
}
export interface QligibilityAnswers {
    ineligibleVehicle: string;
    majorViolations: string;
    licenseRevoked: string;
}
export interface Driver {
    // driverId = leadId-1
    driverID: string;
    // enterprisePartyId: string;
    publicId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: DateOfBirth;
    maritalStatusCode: string;
    maritalStatusValue: string;
    genderCode: string;
    genderValue: string;
    age: string;
    isIncluded: boolean;
    isPNI: boolean;
    isADPF: boolean;
    isQuoteDriver: boolean;
    accidentsAndViolations: AccidentsAndViolations;
    noOfAccidentsAndViolations: NoOfAccidentsAndViolations;
    relationshipCode: string;
    relationshipValue: string;
    licenseStatus: LicenseStatus;
    licenseStatusValue: string;
    ownInsuranceApprovedExt: boolean;
    licenseNumber: string;
    licenseState: string;
    yearsLicensed: LicenseYears;
    yearsLicensedValue: string;
    recordStatus: RecordStatus;
    error: Error;
    isVisible: boolean;
    genderImg: string;
    isAlreadyIncluded: boolean;
}
export interface NoOfAccidentsAndViolations {
    noOfMovingViolations: string;
    noOfAtFaultAccidents: string;
    noOfNotAtFaultAccidents: string;
    noOfComprehensiveClaims: string;
}

export interface Vehicle {
    vehicleID: string;
    publicId: string;
    year: string;
    make: string;
    model: string;
    trim: string;
    vin: string;
    bodyStyle: string;
    vinPrefix: string;
    bodyStyleDesc: string;
    trimDesc: string;
    bodyStyleCode: string;
    stubbedVIN: string;
    isIncluded: boolean;
    isAlreadyIncluded: boolean;
    isADPF: boolean;
    isQuoteVehicle: boolean;
    recordStatus: RecordStatus;
    error: Error;
    unrepairDamage: boolean;
    leaseOrRent: boolean;
    owned: boolean;
    additionalInterests: AdditionalInterest[];
    titleHolder: TitleHolder;
    isVisible: boolean;
    isStubbedVin: boolean;
    compDeductible: string;
    compDisplayValue: string;
    selCodeComp: string;
    selValueComp: string;
    collDisplayValue: string;
    collDeductible: string;
    selValueColl: string;
    selCodeColl: string;
    displayRoadsideAssistance: boolean;
    modelPattern: string;
    mileage: number;
    antitheft: string;
    isRideshare: boolean;
    isSoleIncome: boolean;
}

export interface AdditionalInterest {
    contactName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    additionalInterestType: TitleHolder;
    isAddressVerified: boolean;
    publicID: string;
}

export interface AccidentsAndViolations {
    // accidentsAndViolationsId = leadId-1-1
    accidentsAndViolationsId: string;
    violationCode: string;
    incidentType: string;
    incidentDate: IncidentDate;
    recordStatus: RecordStatus;
    error: Error;
}
export interface IncidentDate {
    year: number;
    month: number;
    day: number;
}
export interface MarketingData {
    campaignId: string;
    leadSource: string;
    currentURL: string;
    referringURL: string;
    mbsy: string;
    zipCode?: string;
}

export interface LienHolder {
    name: string;
    address: Address;
}

export interface PeriodStartDate {
    year: number;
    month: number;
    day: number;
}
export interface PeriodEndDate {
    year: number;
    month: number;
    day: number;
}
export interface QuoteEligiblity {
    isEligible: boolean;
    isKnockout: boolean;
    isReferToPA: boolean;
}
export interface RecordStatus {
    statusCode: number;
    statusDescrition: string;
}
export interface Error {
    code: string;
    errorDescription: string;
}
export interface CurrentInsuranceInfo {
    currentInsurance: boolean;
    lastActiveInsurance: string;
    yearsInsured: string;
    bILimits: string;
    bILimitsValue: string;
}

export enum TitleHolder {
    OWNED = 'PaidFor',
    LOAN = 'LIEN',
    LEASE = 'LESSOR',
    COMPANY = 'corporationExt',
    TRUST = 'trusteeExt',
    UNKNOWN = 'otherExt'
}

export enum LicenseStatus {
    ValidLicense = 'ValidLicense',
    NotInHoushold = 'NotInHoushold',
    NeverLicensed = 'NeverLicensed',
    SuspendedLicense = 'SuspendedLicense',
    OwnInsurance = 'OwnInsurance',
    OutOfCountry = 'OutofCountry',
    MilitaryDeployed = 'MilitaryDeployed',
    LearnersPermit = 'LearnersPermit',
    DoNotKnowThisPerson = 'DontKnowThisPerson'
}

export enum LicenseYears {
    LessThanSixMonths = 'LessThan6Months',
    SixMonthsToLessThanOneYear = '6MonthsToLessThan1Year',
    OneToLessThanTwoYears = '1ToLessThan2Years',
    TwoToLessThanThreeYears = '2ToLessThan3Years',
    ThreeToLessThanFourYears = '3ToLessThan4Years',
    FourToLessThanFiveYears = '4ToLessThan5Years',
    FivePlusYears = '5PlusYears'
}

export interface QuoteSummary {
    quoteNumber: string;
    isQuickQuote: boolean;
    fullPremium: number;
    monthlyPremium: number;
    drivers: string;
    vehicles: string;
    createdDate: string;
    redirectRouteName: string;
}

export interface PolicyCoverage {
    bILimit: string;
    combined: string;
    death: string;
    extraMedical: string;
    funeral: string;
    idTheft: false;
    identityTheft: boolean;
    income: string;
    medical: string;
    pDLimit: string;
    repairAssistance: boolean;
    tort: string;
    uIMBILimit: string;
    uMBILimit: string;
    selCodeBiLimit: string;
    selCodeCombined: string;
    selCodeDeath: string;
    selCodeExtraMed: string;
    selCodeFuneral: string;
    selCodeIncome: string;
    selCodeMedical: string;
    selCodeProperty: string;
    selCodeStackUIMBI: boolean;
    selCodeStackUMBI: boolean;
    selCodeTort: string;
    selCodeUMBI: string;
    selCodeUIMBI: string;
    selValueBiLimit: string;
    selValueCombined: string;
    selValueDeath: string;
    selValueExtraMed: string;
    selValueFuneral: string;
    selValueIncome: string;
    selValueMedical: string;
    selValueProperty: string;
    selValueStackUIMBI: boolean;
    selValueStackUMBI: boolean;
    selValueTort: string;
    selValueUMBI: string;
    selValueUIMBI: string;
    stackedUIMBILimit: boolean;
    stackedUMBILimit: boolean;
    futureAccident: boolean;
    currentAccident: boolean;
    immediateAccident: boolean;
}

export interface CustomQuote {
    fullQuote: boolean;
    isCustom: boolean;
    isQuoteCustomized: boolean;
    quoteRated: boolean;
}
export interface PaymentDueDate {
    year: number;
    month: number;
    day: number;
}
export enum InputTypes {
    TEXT = 'text',
    CHECKBOX = 'checkbox'
}
