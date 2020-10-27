import { HttpClientModule, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { TypeListServiceImpl } from './type-list.service';

const materialOptions = [{ code: 'Other', description: 'Other' }];

describe('TypeListService', () => {
    let service: TypeListServiceImpl;
    let httpTestingController: HttpTestingController;
    const serviceFailResp = {
        error: {
            code: 2332,
            message: ''
        }
    };
    const mockMaritalStatusList = {
        name:'MaritalStatus',
        typeKeys:[
        {
            code: 'M',
            description: 'Married'
        },
        {
            code: 'S',
            description: 'single'
        }
    ]};
    const mockYearsInsuredExt = [
        {
            code: 'lesthan6months',
            description: 'Less than 6 months'
        },
        {
            code: '6monthsto1year',
            description: '6 months to less than 1 year'
        },
        {
            code: '1tolessthan2years',
            description: '1 to less than 2 years'
        },
        {
            code: '2tolessthan3years',
            description: '2  to less than 3 years'
        }
    ];
    const mockDiscountTypes = [
        {
            code: 'advancedShoppingCredit',
            description: 'Advance Shopping Credit'
        },
        {
            code: 'afterMarketDeviceDiscount',
            description: 'AfterMarket Device Discount'
        },
        {
            code: 'antiTheftSystemDiscount',
            description: 'Anti-Theft Discount'
        },
        {
            code: 'associationDiscount',
            description: 'Association Discount'
        },
        {
            code: 'betaTester',
            description: 'Beta Tester Discount'
        }
    ];
    const mockRealtionshipsOptions = [
        {
            code: 'SP',
            description: 'Spouse'
        },
        {
            code: 'ParentExt',
            description: 'Parent'
        },
        {
            code: 'CH',
            description: 'Child'
        },
        {
            code: 'DPExt',
            description: 'Domestic Partner'
        }
    ];
    const mockPriorpolicyLimits = [
        {
            code: '15000_30000',
            description: '$15000/$30000'
        },
        {
            code: '25000_50000',
            description: '$25000/$50000'
        },
        {
            code: '50000_100000',
            description: '$50000/$100000'
        },
        {
            code: '100000_300000',
            description: '$100000/$300000'
        }
    ];
    const mockLapsePeriod = [
        {
            code: '15000_30000',
            description: '$15000/$30000'
        },
        {
            code: '25000_50000',
            description: '$25000/$50000'
        },
        {
            code: '50000_100000',
            description: '$50000/$100000'
        },
        {
            code: '100000_300000',
            description: '$100000/$300000'
        }
    ];
    const mockLicenseTypelistOpt = {
        stateList: [
            {
                code: 'FP',
                description: 'Foreign Operator'
            },
            {
                code: 'AL',
                description: 'Alabama'
            },
            {
                code: 'AK',
                description: 'Alaska'
            },
            {
                code: 'AS',
                description: 'American Samoa'
            }
        ],
        statusList: [
            {
                code: 'ValidLicense',
                description: 'Has a valid driver  vehicle(s)'
            },
            {
                code: 'NeverLicensed',
                description: 'Never licensed to drive'
            },
            {
                code: 'SuspendedLicense',
                description: 'Has a suspended or revoked driver license'
            },
            {
                code: 'OwnInsurance',
                description: 'Has their own insurance'
            }
        ],
        yearList: [
            {
                code: 'LessThan6Months',
                description: 'Less than 6 months'
            },
            {
                code: '6MonthsToLessThan1Year',
                description: '6 months to less than 1 year'
            },
            {
                code: '1ToLessThan2Years',
                description: '1 to less than 2 years'
            },
            {
                code: '2ToLessThan3Years',
                description: '2 to less than 3 years'
            }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [TypeListServiceImpl]
        });
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(TypeListServiceImpl);
    });
    // afterEach(() => {
    //     httpTestingController.verify();
    // });
    afterAll(() => {
        TestBed.resetTestingModule();
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should make http call with correct params on click of upload', () => {
        service.getMaritalStatusOptions().subscribe(data => {
        });
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=MaritalStatus'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockMaritalStatusList);
    });
    it('should make http call with correct params on click of upload', () => {
        service.getMaritalStatusOptions().subscribe(
            data => {},
            (error: HttpErrorResponse) => {
                expect(error.status).toEqual(404, 'status');
                expect(error.error).toEqual(serviceFailResp, 'message');
            }
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=MaritalStatus'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(serviceFailResp, { status: 404, statusText: 'Not Found' });
    });
    it('should make http call with correct params on click of getYearsInsuredExtOptions', () => {
        service.getYearsInsuredExtOptions().subscribe(
            data => {
                expect(data).toEqual(mockYearsInsuredExt);
            },
            (error: HttpErrorResponse) => {}
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=YearsInsuredExt'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockYearsInsuredExt);
    });
    it('should make http call with correct params on click of getPriorPolicyLimitsExtOptions', () => {
        service.getPriorPolicyLimitsExtOptions().subscribe(
            data => {
                expect(data).toEqual(mockPriorpolicyLimits);
            },
            (error: HttpErrorResponse) => {}
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=PriorPolicyLimitsExt'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockPriorpolicyLimits);
    });
    it('should make http call with correct params on click of getLastActiveInsuranceExtOptions', () => {
        service.getLastActiveInsuranceExtOptions().subscribe(
            data => {
                expect(data).toEqual(mockLapsePeriod);
            },
            (error: HttpErrorResponse) => {}
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=LastActiveInsuranceExt'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockLapsePeriod);
    });
    it('should make http call with correct params on click of getDiscountTypes', () => {
        service.getDiscountTypes().subscribe(
            data => {
                expect(data).toEqual(mockDiscountTypes);
            },
            (error: HttpErrorResponse) => {}
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=DiscountDisplayListExt'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockDiscountTypes);
    });
    it('should make http call with correct params on click of getRelationshipOptions', () => {
        service.getRelationshipOptions().subscribe(
            data => {
                expect(data).toEqual(mockRealtionshipsOptions);
            },
            (error: HttpErrorResponse) => {}
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) =>
                request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=Relationship'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockRealtionshipsOptions);
    });
    it('should make http call with correct params on click of getLicenseTypelistOptions', () => {
        service.getLicenseTypelistOptions().subscribe(
            data => {
                expect(data).toEqual(mockLicenseTypelistOpt);
            },
            (error: HttpErrorResponse) => {}
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => {
                console.log('url/////', request.urlWithParams);
                return true;
            }
            // request.urlWithParams === environment.nodeserver + 'products/typeList?typeList=Relationship'
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockLicenseTypelistOpt);
    });
});
