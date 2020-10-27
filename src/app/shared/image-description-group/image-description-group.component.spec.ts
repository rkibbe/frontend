import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDescriptionGroupComponent } from './image-description-group.component';

describe('ImageDescriptionGroupComponent', () => {
    let component: ImageDescriptionGroupComponent;
    let fixture: ComponentFixture<ImageDescriptionGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImageDescriptionGroupComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageDescriptionGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
