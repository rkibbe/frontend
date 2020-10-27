import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertiMaterialModule } from '@shared/verti-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { DataLayerService } from '@services/data-layer.service';
import { NavigationService } from '@services/navigation.service';
import { DocVerifyComponent } from './doc-verify.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SentModalComponent } from '@shared/sent-modal/sent-modal.component';
import { CancelModalComponent } from '@shared/cancel-modal/cancel-modal.component';
import { WalmericDialogModalComponent } from '@app/core/walmeric-dialog-modal/walmeric-dialog-modal.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DocVerifyComponent', () => {
    let component: DocVerifyComponent;
    let fixture: ComponentFixture<DocVerifyComponent>;
    const mockMatDialog = {
        open: jasmine.createSpy('open')
    };
    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    const mockData = [
        {
            doc_icon: './assets/img/lisence-icon.svg',
            title: "Picture of driver's license",
            docTypeId: 'dl_picture'
        },
        {
            doc_icon: './assets/img/envelope-icon.svg',
            title: 'Proof of residence',
            docTypeId: 'residence_proof'
        },
        {
            doc_icon: './assets/img/car-registration-icon.svg',
            title: 'Vehicle registration',
            docTypeId: 'veh_reg_proof'
        },
        {
            doc_icon: './assets/img/doc-icon.svg',
            title: 'Proof of current insurance',
            docTypeId: 'curr_ins_proof'
        },
        {
            doc_icon: './assets/img/car-registration-icon.svg',
            title: 'Visual documentation',
            docTypeId: 'veh_pictures'
        },
        {
            doc_icon: './assets/img/doc-icon.svg',
            title: 'Proof of driving history',
            docTypeId: 'drive_hist_proof'
        }
    ];
    const mockedStore = {
        select: jasmine.createSpy('select').and.returnValue(of(mockData)),
        dispatch: jasmine.createSpy('disaptch')
    };
    const mockWindow = {
        dataLayer: []
    };
    const dataLayerServiceStub = { pushToDataLayer: object => ({}) };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DocVerifyComponent, PageImageTitleComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                StoreModule.forRoot({}),
                CoreModule,
                FormsModule,
                ReactiveFormsModule,
                VertiMaterialModule,
                RouterTestingModule,
                StoreModule,
                HttpClientModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: window, useValue: mockWindow },
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: Router, useValue: mockRouter },

                { provide: DataLayerService, useValue: dataLayerServiceStub },
                {
                    provide: NavigationService,
                    useValue: {
                        upDateMarketingData: jasmine.createSpy('updateMarketingData').and.returnValue(of({})),
                        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate')
                    }
                },
                { provide: Store, useValue: mockedStore }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocVerifyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });
    it('should naviagte uploadfile on click of navigateToFileUpload ', () => {
        component.navigateToFileUpload('test_ID');
        expect(mockRouter.navigate).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['uploadfile/test_ID'], { queryParamsHandling: 'merge' });
    });
    it('should open SentModalComponent  on click of openSentDialog ', () => {
        component.openSentDialog();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(SentModalComponent, {
            panelClass: 'verti-sent-modal'
        });
    });
    it('should open CancelModalComponent  on click of openCancelDialog ', () => {
        component.openCancelDialog();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(CancelModalComponent, {
            panelClass: 'verti-cancel-modal'
        });
    });
    it('should open WalmericDialogModalComponent  on click of callToFinish ', () => {
        component.callToFinish();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockMatDialog.open).toHaveBeenCalledWith(WalmericDialogModalComponent, {
            panelClass: 'custom-header-modal'
        });
    });
});
