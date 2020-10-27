import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoQuestionsListsComponent } from './ko-questions-lists.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { VertiMaterialModule } from '../verti-material.module';
import { CoreModule } from '@angular/flex-layout';

describe('KoQuestionsListsComponent', () => {
    let component: KoQuestionsListsComponent;
    let fixture: ComponentFixture<KoQuestionsListsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [KoQuestionsListsComponent],
            imports: [
                BrowserAnimationsModule,
                BrowserModule,
                CoreModule,
                VertiMaterialModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KoQuestionsListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
