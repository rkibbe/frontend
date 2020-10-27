import { TestBed, async } from '@angular/core/testing';

import { LienHolderService } from './lien-holder.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@env/environment';
import { LienHolder, Address } from 'src/app/store/models/lead.model';

describe('LienHolderService', () => {
    let httpClient: HttpClient;
    let lienHolderService: LienHolderService;
    let httpTestingController: HttpTestingController;
    const url = environment.nodeserver + 'products/lienHolderList';

    let tempLienData: LienHolder[] = [];
    let addresData;
    addresData = [
        {
            addressLine1: 'string',
            addressLine2: 'string',
            city: 'string',
            state: 'string',
            postalCode: 'string'
        }
    ];
    tempLienData = [
        {
            name: 'name',
            address: addresData
        },
        {
            name: 'name',
            address: addresData
        }
    ];
    const payerResp = { status: 'success' };

    let mockHttpClient;
    let tempLien;
    beforeEach(() => {
        mockHttpClient = {};
        lienHolderService = new LienHolderService(mockHttpClient);
        tempLien = lienHolderService;
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, NoopAnimationsModule],
            providers: [LienHolderService]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        lienHolderService = TestBed.get(LienHolderService);
    });
    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(lienHolderService).toBeTruthy();
    });

    it('should have called getLienHolders()', () => {
        lienHolderService.getLienHolders().subscribe(lienHolder => {});
        const req = httpTestingController.expectOne(`${url}`);
        expect(req.request.method).toEqual('GET');
        req.flush(payerResp);
    });

    it('should have called getLienHolders() and check the lienHolderService.lienHolders.length', () => {
        lienHolderService.lienHolders = tempLienData;
        lienHolderService.getLienHolders().subscribe(res => {});
        expect(lienHolderService.lienHolders.length).toBeTruthy();
        lienHolderService.resetResourceRelease();
        expect(lienHolderService.resourceTimer).toBeTruthy();

        return tempLien['mapUnparsedLienHolderToLienHolder'](tempLienData);
        // expect(tempLien['mapUnparsedLienHolderToLienHolder']).toBeTruthy();
    });

    it('should have called resetResourceRelease()', () => {
        lienHolderService.resetResourceRelease();
        expect(lienHolderService.resourceTimer).toBeTruthy();
        clearTimeout(lienHolderService.resourceTimer);
        expect(lienHolderService.resetResourceRelease).toBeTruthy();
        expect(clearTimeout).toBeTruthy();
    });

    it('should have called resetResourceRelease() and clearTimeout()', () => {
        lienHolderService.resetResourceRelease();
        expect(lienHolderService.resourceTimer).toBeTruthy();
        lienHolderService.resetResourceRelease();
        expect(lienHolderService.resourceTimer).toBeTruthy();
        clearTimeout(lienHolderService.resourceTimer);
        httpTestingController.verify();
        expect(lienHolderService.resetResourceRelease).toBeTruthy();
        expect(clearTimeout).toBeTruthy();
    });

    it('should have called clearTimeout() and setTimeout()', done => {
        clearTimeout(lienHolderService.resourceTimer);
        setTimeout(() => {
            lienHolderService.lienHolders = [];
            expect(lienHolderService.lienHolders).toEqual([]);
            expect(lienHolderService.RESOURCE_TIMEOUT).toBeTruthy();
            done();
        });
    });

    it('should have called ngOnDestroy()', () => {
        lienHolderService.resetResourceRelease();
        expect(lienHolderService.resourceTimer).toBeTruthy();
        lienHolderService.ngOnDestroy();
        clearTimeout(lienHolderService.resourceTimer);
        httpTestingController.verify();
        expect(clearTimeout).toBeTruthy();
    });

    it('should have called ngOnDestroy() and clearTimeout()', () => {
        lienHolderService.ngOnDestroy();
        expect(lienHolderService.resourceTimer).toBeUndefined();
        clearTimeout(lienHolderService.resourceTimer);
        expect(lienHolderService.resourceTimer).toBeUndefined();
        expect(clearTimeout).toBeTruthy();
    });
});
