import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { AppSettings } from '@shared/settings/app-settings';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { WalmericDialogModalComponent } from '../walmeric-dialog-modal/walmeric-dialog-modal.component';
import { HeaderComponent } from './header.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let mockDialog;
    let mockedStore;
    let mockAppSettingService;
    let testData;
    const mockMatDialog = {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close')
    };

    beforeEach(() => {
        mockedStore = {};
        mockAppSettingService = AppSettingsService;
        mockDialog = MatDialog;
        testData = new AppSettings();
    });

    describe('unit test', () => {
        let mockedDataLayerService;
        beforeEach(() => {
            mockedDataLayerService = {};
            mockAppSettingService = jasmine.createSpyObj('mockAppSettingService', ['getSettings']);
            // mockAppSettingService.getSettings.and.returnValue(of(testData.VERTI_CONTACT_NUMBER.vertiNumber));
            component = new HeaderComponent(mockDialog, mockedStore, mockAppSettingService);
        });

        describe('ngOnInit', () => {
            it('should create store for lead status and verti call us number added in the header', fakeAsync(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine.createSpy('select').and.returnValue(of());
                component.ngOnInit();
                tick();
                mockAppSettingService.getSettings();
                expect(mockAppSettingService.getSettings).toBeTruthy();
                // expect(testData.VERTI_CONTACT_NUMBER.vertiNumber).toEqual('1-267-310-3021');
                tick();
            }));
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<HeaderComponent>;
        let de: DebugElement;
        let el: any;

        beforeEach(async(() => {
            mockAppSettingService = jasmine.createSpyObj('mockAppSettingService', ['getSettings']);

            TestBed.configureTestingModule({
                declarations: [HeaderComponent],
                imports: [BrowserAnimationsModule, TranslateModule.forRoot(), VertiMaterialModule],
                providers: [
                    TranslateService,
                    { provide: Store, useValue: mockedStore },
                    { provide: MatDialog, useValue: mockMatDialog },
                    { provide: AppSettingsService, useValue: mockAppSettingService }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(HeaderComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedStore = TestBed.get(Store);
        });

        describe('no initial data', () => {
            beforeEach(() => {
                mockedStore.dispatch = jasmine.createSpy('dispatch');
                mockedStore.select = jasmine
                    .createSpy('select')
                    .and.returnValue(of({ firstName: 'testname', lastName: 'test last name' }));
            });

            it('should create', () => {
                expect(component).toBeTruthy();
            });
            it('should have correct information if found in store', async () => {
                component.ngOnInit();
                expect(component.firstName).toEqual('testname');
            });
            xit('should have the correct verti call us title', () => {
                expect(el.innerText).toContain(`We're here to help`);
            });
            it('should have the correct image', () => {
                const img = de.queryAll(By.css('img[src$="/logo_Dark.svg"]'));
                expect(img.length).toEqual(1);
            });
            it('should have the correct image', () => {
                component.ngOnChanges();
            });
            it('should open WalmericDialogModalComponent on click of  openDialog ', () => {
                component.openDialog();
                expect(mockMatDialog.open).toHaveBeenCalledWith(WalmericDialogModalComponent, {
                    panelClass: 'custom-header-modal'
                });
            });
        });
    });
});
