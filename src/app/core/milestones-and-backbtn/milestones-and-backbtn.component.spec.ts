import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { AppSettingsService } from '@services/app-settings.service';
import { NavigationService } from '@services/navigation.service';
import { ProgressbarService } from '@services/progressbar.service';
import { SharedModule } from '@shared/shared.module';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { of } from 'rxjs';
import { MilestonesAndBackbtnComponent } from './milestones-and-backbtn.component';


describe('MilestonesAndBackbtnComponent', () => {
    let component: MilestonesAndBackbtnComponent;
    let fixture: ComponentFixture<MilestonesAndBackbtnComponent>;
    const mockNavigationService = {
        navigateBack: jasmine.createSpy('navigateBack'),
        upDateMarketingData: jasmine.createSpy('upDateMarketingData'),
        gotoRouteByName: jasmine.createSpy('gotoRouteByName'),
        getRouteIndexByName: jasmine.createSpy('getRouteIndexByName'),
        getCurrentRouteIndex: jasmine.createSpy('getCurrentRouteIndex').and.returnValue(of(-1)),
        saveLeadAndNavigate: jasmine.createSpy('saveLeadAndNavigate'),
        getPrevoiusRoute: jasmine.createSpy('getPrevoiusRoute').and.returnValue(of(2)),
        currentRoute: 'test Route',
        currentRouteObj: 2
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MilestonesAndBackbtnComponent],
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
                SharedModule
            ],
            providers: [
                { provide: ProgressbarService, useValue: {} },
                {
                    provide: AppSettingsService,
                    useValue: {
                        getSettings: jasmine
                            .createSpy('getSettings')
                            .and.returnValue(of({ FULL_PROGRESS_PAGES: ['callcustomize'] }))
                    }
                },
                // Router,
                {
                    provide: Router,
                    useValue: {
                        url: '/non-pdp/?phases/8',
                        events: of(
                            new NavigationEnd(
                                0,
                                'http://localhost:4200/#/non-pdp/phases/8',
                                'http://localhost:4200/#/non-pdp/phases/8'
                            )
                        ),
                        navigate: jasmine.createSpy('navigate')
                    }
                },
                { provide: NavigationService, useValue: mockNavigationService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MilestonesAndBackbtnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should hide milestone conatiner if currentRoute is value not landing', () => {
        expect(component.hideMileStoneContainer).toBe(false);
    });
    it('should get prevous index from navigation service getPrevoiusRoute method ', () => {
        mockNavigationService.currentRoute = 'leadlanding';
        fixture = TestBed.createComponent(MilestonesAndBackbtnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(mockNavigationService.getPrevoiusRoute).toHaveBeenCalled();
    });
});
