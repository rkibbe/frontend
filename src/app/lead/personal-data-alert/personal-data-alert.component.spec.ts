import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PersonalDataAlertComponent } from './personal-data-alert.component';
import { PageImageTitleComponent } from '@shared/page-image-title/page-image-title.component';
import { VertiMaterialModule } from '@shared/verti-material.module';
import { TranslateModule } from '@ngx-translate/core';

describe('PersonalDataAlertComponent', () => {
    let component: PersonalDataAlertComponent;
    let fixture: ComponentFixture<PersonalDataAlertComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PersonalDataAlertComponent, PageImageTitleComponent],
            imports: [VertiMaterialModule, TranslateModule.forRoot()]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PersonalDataAlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', fakeAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('should be check imasource, title and subtitle', fakeAsync(() => {
        expect(component.imgSource).toBeTruthy();
        expect(component.title).toBeTruthy();
        expect(component.subTitle).toBeTruthy();
    }));
    it('should call ngOnInit() and check contact number', fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(component.contactNumber).toBeTruthy();
        tick();
    }));
});
