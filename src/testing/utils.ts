import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockTypeListService } from '@testing/mocks/services/type-list.service';
import { provideMockStore } from '@testing/mocks/store/store';
import { VertiMaterialModule } from '../app/shared/verti-material.module';

export function getButtonWrapperElement(element: HTMLElement): HTMLElement {
    if (element) {
        if (element.tagName === 'BUTTON') {
            return element;
        } else {
            return getButtonWrapperElement(element.parentElement);
        }
    } else {
        return null;
    }
}

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        RouterTestingModule,
        VertiMaterialModule,
        StoreModule.forRoot({})
    ],
    exports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        RouterTestingModule,
        VertiMaterialModule
    ],
    providers: [provideMockStore(), provideMockTypeListService()]
})
export class TestingModule {
    constructor() {}
}
