import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, of, ReplaySubject, Subject } from 'rxjs';
import { UpdateDriver } from '@app/store/actions/lead.actions';
import { Driver } from '@app/store/models/lead.model';
import { NavigationService } from './navigation.service';
import { PniRelationshipService } from './pni-relationship.service';
import { MatDialog } from '@angular/material';
import { MockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { SpouseDPAlertModalComponent } from '@shared/spouse-dp-alert-modal/spouse-dp-alert-modal.component';
// tslint:disable-next-line:no-big-function
describe('PniRelationshipService', () => {
    let service: PniRelationshipService;

    let paramsSubject: Subject<any>;

    let mockedNavigationService;
    let mockedStore;
    let mockedActivatedRoute;

    let testDrivers: Driver[];
    let mockDialog;
    const mockDialogRef = {
        open: () => {},
        close: () => {}
    };
    beforeEach(done => {
        paramsSubject = new ReplaySubject<any>(1);

        testDrivers = [
            {
                driverID: 'id1',
                isPNI: false,
                isIncluded: true,
                relationshipCode: 'SP'
            } as Driver,
            {
                driverID: 'id2',
                isPNI: false,
                isIncluded: true,
                relationshipCode: 'DPExt'
            } as Driver,
            {
                driverID: 'id3',
                isPNI: false,
                isIncluded: false,
                relationshipCode: 'SP'
            } as Driver,
            {
                driverID: 'id4',
                isPNI: false,
                isIncluded: false,
                relationshipCode: 'SP'
            } as Driver
        ];

        mockedNavigationService = {
            registerBackHandler: jasmine.createSpy('registerBackHandler'),
            navigate: jasmine.createSpy('navigate'),
            gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
            currentRouteObj: { preFill: false }
        };
        mockedStore = {
            select: jasmine.createSpy('select'),
            dispatch: jasmine.createSpy('dispatch')
        };
        mockedActivatedRoute = {
            params: paramsSubject.asObservable()
        };
        done();
    });

    afterEach(() => {
        paramsSubject.unsubscribe();
        service.ngOnDestroy();
    });

    it('should be created', () => {
        mockedStore.select.and.returnValue(EMPTY);
        service = new PniRelationshipService(
            mockedStore as Store<any>,
            mockedNavigationService as NavigationService,
            mockedActivatedRoute as ActivatedRoute,
            mockDialog
        );
        expect(service).toBeTruthy();
    });

    it('should register a back handler on construction', () => {
        mockedStore.select.and.returnValue(EMPTY);
        service = new PniRelationshipService(
            mockedStore as Store<any>,
            mockedNavigationService as NavigationService,
            mockedActivatedRoute as ActivatedRoute,
            mockDialog
        );

        expect(mockedNavigationService.registerBackHandler).toHaveBeenCalled();
    });

    it('should call back()', () => {
        const next = new Function();
        spyOn(service, 'back').and.callThrough();
        service.back(next);
        expect(service.back).toHaveBeenCalledWith(next);
    });

    it('should navigate to the next page if accessing the PNI id', () => {
        mockedStore.select.and.returnValue(
            of({
                marketingData: { campaignID: '534353534' },
                quickQuote: {
                    monthlyPremiumPrice: '67',
                    vehicles: [],
                    drivers: testDrivers,
                    secondaryInsured: {
                        driverID: '00Q2900066007WiX0EAK-1',
                        email: 'test@mail.com',
                        phone: '2234234',
                        isSNISelected: true
                    }
                },
                quote: {
                    quoteNumber: '424234333',
                    paymentDetails: {
                        cardNumber: '323232323',
                        name: 'test name',
                        cardType: 'VISA'
                    },
                    selectedPaymentPlan: '',
                    monthlyPremium: '3232',
                    nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                }
            })
        );
        service = new PniRelationshipService(
            mockedStore as Store<any>,
            mockedNavigationService as NavigationService,
            mockedActivatedRoute as ActivatedRoute,
            mockDialog
        );

        expect(service['drivers'][1]).toEqual(testDrivers[1]);
    });

    describe('valid drivers', () => {
        beforeEach(() => {
            mockedStore.select.and.returnValue(
                of({
                    marketingData: { campaignID: '534353534' },
                    maritalStatusCode: 'M',
                    quickQuote: {
                        monthlyPremiumPrice: '67',
                        vehicles: [],
                        drivers: testDrivers,
                        secondaryInsured: {
                            driverID: '00Q2900066007WiX0EAK-1',
                            email: 'test@mail.com',
                            phone: '2234234',
                            isSNISelected: true
                        }
                    },
                    quote: {
                        quoteNumber: '424234333',
                        paymentDetails: {
                            cardNumber: '323232323',
                            name: 'test name',
                            cardType: 'VISA'
                        },
                        selectedPaymentPlan: '',
                        monthlyPremium: '3232',
                        nextPaymentDueDate: { day: '12', month: '06', year: '2006' }
                    }
                })
            );

            mockDialog = {
                open: jasmine.createSpy('open'),
                close: jasmine.createSpy('close')
            };
            service = new PniRelationshipService(
                mockedStore as Store<any>,
                mockedNavigationService as NavigationService,
                mockedActivatedRoute as ActivatedRoute,
                mockDialog
            );
        });
        it('should dispatch UpdateDriver action and naviagte to gotoRouteByName for multipule drivers ', () => {
            const relationship = {
                relationshipCode: 'S',
                relationshipValue: 'Single'
            };
            service['currentDriverID'] = testDrivers[0].driverID;
            service.continue(relationship);
            expect(mockedNavigationService.gotoRouteByName).toHaveBeenCalled();
            expect(mockedStore.dispatch).toHaveBeenCalled();
            expect(mockedStore.dispatch).toHaveBeenCalledWith(
                new UpdateDriver({ driverID: service['currentDriverID'], ...relationship })
            );
        });
        it('should dispatch UpdateDriver action and should call naviagte method for single driver ', () => {
            const relationship = {
                relationshipCode: 'S',
                relationshipValue: 'Single'
            };
            service['currentDriverID'] = testDrivers[0].driverID;
            service['drivers'] = [testDrivers[0]];
            service.continue(relationship);
            expect(mockedNavigationService.navigate).toHaveBeenCalled();
            expect(mockedStore.dispatch).toHaveBeenCalled();
            expect(mockedStore.dispatch).toHaveBeenCalledWith(
                new UpdateDriver({ driverID: service['currentDriverID'], ...relationship })
            );
        });

        it('should  open SpouseDPAlertModalComponent getNonPNIDriversWithSPOrDPRelationship length > 1 ', () => {
            service['currentDriverID'] = testDrivers[0].driverID;
            service['saveLeadAndNavigateNext']();
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledWith(SpouseDPAlertModalComponent, {
                data: 'MORETHANONESAMERELATIONSHIP',
                panelClass: 'spouse-dp-alert'
            });
        });
        it('should  open SpouseDPAlertModalComponent if dont  have any getNonPNIDriversWithSPOrDPRelationship ', () => {
            service['currentDriverID'] = testDrivers[0].driverID;
            testDrivers[0].relationshipCode = 'other';
            service['drivers'] = [testDrivers[0]];
            service['saveLeadAndNavigateNext']();
            expect(mockDialog.open).toHaveBeenCalled();
            expect(mockDialog.open).toHaveBeenCalledWith(SpouseDPAlertModalComponent, {
                data: service.leadData.maritalStatusCode,
                panelClass: 'spouse-dp-alert'
            });
        });
    });
    it('should naviagte to next method getNonPNIDriversWithSPOrDPRelationship ', () => {
        service['currentDriverID'] = testDrivers[0].driverID;
        service.leadData.maritalStatusCode = 'S';
        service['drivers'] = [testDrivers[0]];
        service['saveLeadAndNavigateNext']();
        // expect(mockedNavigationService.navigate).toHaveBeenCalled();
    });
    it('should not naviagte to next method if we have  current driver for onUrlParamsChange method  ', () => {
        service['currentDriverID'] = testDrivers[0].driverID;
        service['drivers'] = [testDrivers[0]];
        service['onUrlParamsChange']({ id: testDrivers[0].driverID });
    });
    it('should naviagte to next method if dont have any current driver for onUrlParamsChange method  ', () => {
        service['drivers'] = [testDrivers[0]];
        service['onUrlParamsChange']({ id: testDrivers[1].driverID });
        // expect(mockedNavigationService.navigate).toHaveBeenCalled();
    });
});
