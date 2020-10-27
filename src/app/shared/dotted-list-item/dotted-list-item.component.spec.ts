import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DottedListItemComponent } from './dotted-list-item.component';

describe('DottedListItemComponent', () => {
    let component: DottedListItemComponent;
    let fixture: ComponentFixture<DottedListItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DottedListItemComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DottedListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

// let component: DottedListItemComponent;
//     let fixture: ComponentFixture<DottedListItemComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [DottedListItemComponent]
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DottedListItemComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
