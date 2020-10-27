import { HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { environment } from '@env/environment';
import { TrilliumModalComponent } from '@shared/trillium-modal/trillium-modal.component';
import { of } from 'rxjs';
import { TrilliumAddressService } from './trillium-address.service';


describe('TrilliumAddressService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let trilliumAddressService: TrilliumAddressService;
    let dialogSpy: jasmine.Spy;
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null, closeAll: () => null });
    dialogRefSpyObj.componentInstance = { body: '' };
    const address1 = {
        addressLine1: '810 Newtown Road',
        city: 'Villanova',
        state: 'PA',
        postalCode: '19085',
        country: 'US',
        addressLine2: 'string',
        county: 'string'
    };
    const address2 = {
        addressLine1: '810 Newtown Road',
        city: 'Villanova',
        state: 'PA',
        postalCode: '19085-234',
        country: 'US',
        addressLine2: 'string',
        county: 'string'
    };
    const address3 = {
        addressLine1: '810 Newtown Roa',
        city: 'Villanova',
        state: 'PA',
        postalCode: '19085-234',
        country: 'US',
        addressLine2: 'string',
        county: 'string'
    };
    const address4 = {
        addressLine1: '810 Newtown Road',
        city: 'Villanova',
        state: 'PA',
        postalCode: '19085',
        country: 'US',
        addressLine2: 'string',
        county: 'string'
    };
    const trilliumResp1 = {
        matchLevel: '1',
        dpvConfirm: 'X',
        rdiFlag: 'a',
        address: address1
    };
    const trilliumResp2 = {
        matchLevel: '0',
        dpvConfirm: 'Y',
        rdiFlag: 'S',
        address: address1
    };
    const trilliumResp3 = {
        matchLevel: '0',
        dpvConfirm: 'x',
        rdiFlag: 'Y',
        address: address2
    };
    const trilliumResp4 = {
        matchLevel: '0',
        dpvConfirm: 'D',
        rdiFlag: 'Y',
        address: address2
    };
    const trilliumRespPartialAdd = {
        matchLevel: '0',
        dpvConfirm: 'Y',
        rdiFlag: 'Y',
        address: address3
    };
    const trilliumResError = {
        matchLevel: '0',
        dpvConfirm: 'Y',
        rdiFlag: 'Y'
    };
    const serviceFailResp = {
        error: {
            errorCode: '404',
            errorMessage: 'resouce not found'
        }
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        close: (dialogResult: any) => {},
                        open: (dialogResult: any) => {},
                        closeAll: () => null
                    }
                },
                HttpClient,
                TrilliumAddressService
            ]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        trilliumAddressService = TestBed.get(TrilliumAddressService);
        dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    });
    afterEach(() => {
        httpTestingController.verify();
    });
    afterAll(() => {
        TestBed.resetTestingModule();
    });
    it('should be created', async(() => {
        const service: TrilliumAddressService = TestBed.get(TrilliumAddressService);
        expect(service).toBeTruthy();
    }));
    it('sendTrilliumPutRequest method makes Http PUT call', async(() => {
        trilliumAddressService.verifyAddress(address1).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === `${environment.nodeserver}address`
        );
        // Assert that the request is a GET.
        expect(req.request.method).toEqual('PUT');
        // expect(req.request.url).toBe('ffd');
        req.flush({
            apiOutput: {
                address: {
                    address: '810 Newtown Road',
                    city: 'Villanova',
                    state: 'PA',
                    postalCode: '19085-0',
                    country: 'US',
                    address2: 'string',
                    county: 'string',
                    cityName: 'string',
                    regionName: 'string'
                }
            }
        });
    }));
    it('sendTrilliumPutRequest method makes Http PUT call', async(() => {
        const mockData = {
            uspsSuggestion: {
                addressLine1: '810 Newtown Road',
                city: 'VILLANOVA',
                state: 'PA',
                postalCode: '19085-234',
                country: 'US',
                addressLine2: 'string',
                county: 'string'
            },
            userEntered: {
                addressLine1: '810 Newtown Road',
                city: 'Villanova',
                state: 'PA',
                postalCode: '19085',
                country: 'US',
                addressLine2: 'string',
                county: 'string'
            },
            invalidAddress: true,
            partialAddress: undefined
        };

        spyOn<any>(trilliumAddressService, 'sendTrilliumPutRequest').and.returnValue(of(trilliumResp3));
        trilliumAddressService.verifyAddress(address1).subscribe(data => {});
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(TrilliumModalComponent, {
            data: mockData,
            panelClass: 'custom-trillium-modal'
        });
    }));
    it('sendTrilliumPutRequest method makes Http PUT call', async(() => {
        const mockData = {
            uspsSuggestion: {
                addressLine1: '810 Newtown Road',
                city: 'VILLANOVA',
                state: 'PA',
                postalCode: '19085',
                country: 'US',
                addressLine2: 'string',
                county: 'string'
            },
            userEntered: {
                addressLine1: '810 Newtown Road',
                city: 'VILLANOVA',
                state: 'PA',
                postalCode: '19085',
                country: 'US',
                addressLine2: 'string',
                county: 'string'
            },
            invalidAddress: true,
            partialAddress: undefined
        };
        spyOn<any>(trilliumAddressService, 'sendTrilliumPutRequest').and.returnValue(of(trilliumResp2));
        trilliumAddressService.verifyAddress(address1).subscribe(data => {});
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(TrilliumModalComponent, {
            data: mockData,
            panelClass: 'custom-trillium-modal'
        });
    }));
    it('sendTrilliumPutRequest method makes Http PUT call', async(() => {
        const mockData = {
            uspsSuggestion: {
                addressLine1: '810 Newtown Road',
                city: 'VILLANOVA',
                state: 'PA',
                postalCode: '19085-234',
                country: 'US',
                addressLine2: 'string',
                county: 'string'
            },
            userEntered: {
                addressLine1: '810 Newtown Road',
                city: 'VILLANOVA',
                state: 'PA',
                postalCode: '19085',
                country: 'US',
                addressLine2: 'string',
                county: 'string'
            },
            invalidAddress: true,
            partialAddress: undefined
        };
        spyOn<any>(trilliumAddressService, 'sendTrilliumPutRequest').and.returnValue(of(trilliumResp4));
        trilliumAddressService.verifyAddress(address1).subscribe(data => {});
        expect(dialogSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith(TrilliumModalComponent, {
            data: mockData,
            panelClass: 'custom-trillium-modal'
        });
    }));
    it('sendTrilliumPutRequest method makes Http PUT call', async(() => {
        spyOn<any>(trilliumAddressService, 'sendTrilliumPutRequest').and.returnValue(
            of({
                ...trilliumResp4,
                address: {
                    address: '810 Newtown Road',
                    city: 'Villanova',
                    state: 'PA',
                    postalCode: '19085',
                    country: 'US',
                    address2: 'string',
                    county: 'string',
                    cityName: 'string',
                    regionName: 'string'
                }
            })
        );
        trilliumAddressService.verifyAddress(address1).subscribe(data => {});
    }));
    it('sendTrilliumPutRequest method makes Http PUT call', async(() => {
        trilliumAddressService.verifyAddress(of(address2)).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === `${environment.nodeserver}address`
        );

        // Assert that the request is a PUT.
        req.flush(trilliumRespPartialAdd);
    }));
    it('verifyAddress check if any address object present in the service response', async(() => {
        trilliumAddressService.verifyAddress(of(address4)).subscribe(data => {});
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === `${environment.nodeserver}address`
        );
        req.flush(trilliumResError);
    }));
    it('verifyAddress throws error if service fails', async(() => {
        const mockError = new ErrorEvent('Network error', {
            message: 'service error'
        });
        trilliumAddressService.verifyAddress(address1).subscribe(
            data => {},
            error => {
                expect(error).toEqual(mockError);
            }
        );
        const req = httpTestingController.expectOne(
            (request: HttpRequest<any>) => request.urlWithParams === `${environment.nodeserver}address`
        );
        req.error(mockError);
    }));
});
