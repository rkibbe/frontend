import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavigationService } from '@app/core/services/navigation.service';
import { CallToCustomizeComponent } from './call-to-customize.component';

describe('CallToCustomizeComponent', () => {
    let component: CallToCustomizeComponent;
    let fixture: ComponentFixture<CallToCustomizeComponent>;
    beforeEach(() => {
        const navigationServiceStub = { upDateMarketingData: () => ({}) };
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [CallToCustomizeComponent],
            providers: [{ provide: NavigationService, useValue: navigationServiceStub }]
        });
        fixture = TestBed.createComponent(CallToCustomizeComponent);
        component = fixture.componentInstance;
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const navigationServiceStub: NavigationService = fixture.debugElement.injector.get(NavigationService);
            spyOn(navigationServiceStub, 'upDateMarketingData').and.callThrough();
            component.ngOnInit();
            expect(navigationServiceStub.upDateMarketingData).toHaveBeenCalled();
        });
    });
});
