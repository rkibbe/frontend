import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/store/reducers';
import { MatDialog, MatDialogModule } from '@angular/material';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot(reducers), TranslateModule.forRoot(), MatDialogModule],
            declarations: [FooterComponent],
            providers: [MatDialog, TranslateService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call isMobile()', () => {
        expect(component.isMobileDevice).toEqual(null);
    });
});
