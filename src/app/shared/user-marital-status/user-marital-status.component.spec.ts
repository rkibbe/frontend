import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaritalStatusComponent } from './user-marital-status.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { TypeListService } from '@services/type-list.service';
import { Store } from '@ngrx/store';
import { NavigationService } from '@services/navigation.service';
import { MatButtonToggleModule } from '@angular/material';
import { MockTypeListService, provideMockTypeListService } from '@testing/mocks/services/type-list.service';

// tslint:disable-next-line:no-big-function
describe('UserMaritalStatusComponent', () => {
    let component: UserMaritalStatusComponent;

    let mockedStore: any;
    let mockedNavigationService: any;

    let testFormGroup: FormGroup;

    beforeEach(() => {

        testFormGroup = new FormBuilder().group({
            maritalStatusCode: ['']
        });
    });

    describe('integrated test', () => {
        let fixture: ComponentFixture<UserMaritalStatusComponent>;
        let de: DebugElement;
        let el: any;

        let mockedTypeListService: MockTypeListService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [UserMaritalStatusComponent],
                imports: [ReactiveFormsModule, MatButtonToggleModule],
                providers: [
                    provideMockTypeListService(),
                    {
                        provide: Store,
                        useValue: mockedStore
                    },
                    {
                        provide: NavigationService,
                        useValue: mockedNavigationService
                    }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserMaritalStatusComponent);
            component = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;

            mockedTypeListService = TestBed.get(TypeListService);
            spyOn(mockedTypeListService, 'getMaritalStatusOptions').and.callThrough();

            mockedStore = TestBed.get(Store);
            mockedNavigationService = TestBed.get(NavigationService);

            component.formGroup = testFormGroup;
        });

        it('should create', () => {
            fixture.detectChanges();
            expect(component).toBeTruthy();
        });
        it('should emit the form value on click of onButtonToggleClick ', () => {
            const spy = spyOn(component.formGroupValue, 'emit');
            component.onButtonToggleClick();
            expect(spy).toHaveBeenCalled();
        });
        it('should emit the form value on click of saveDetails ', () => {
            const spy = spyOn(component.formSubmit, 'emit');
            component.saveDetails();
            expect(spy).toHaveBeenCalled();
        });
    });
});
